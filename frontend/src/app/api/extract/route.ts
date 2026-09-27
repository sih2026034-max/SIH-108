import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  const pdfParse = require('pdf-parse');
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "Empty file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    // Validate size (e.g. 10MB limit)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB size limit." }, { status: 400 });
    }

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } catch (err) {
        return NextResponse.json({ error: "Text could not be extracted from this document. OCR processing is required or the PDF is corrupted." }, { status: 400 });
      }
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (err) {
        return NextResponse.json({ error: "Failed to extract text from DOCX file. File may be corrupted." }, { status: 400 });
      }
    } else if (file.type === "text/plain" || file.name.toLowerCase().endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: "Unsupported file format. Please upload PDF, DOCX, or TXT." }, { status: 400 });
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text could not be extracted from this document. OCR processing is required." }, { status: 400 });
    }

    // Clean text
    text = text.replace(/\\s+/g, ' ').trim();

    // Mock NLP extraction of structured fields based on common tender keywords
    const lowerText = text.toLowerCase();
    
    const extractSection = (regex: RegExp) => {
      const match = text.match(regex);
      return match && match[1] ? match[1].trim() : "Not detected";
    };

    const extracted = {
      productName: extractSection(/(?:product name|equipment|item|procurement of)\\s*[:-]?\\s*([^\\n,.]+)/i),
      productDescription: extractSection(/(?:description|scope)\\s*[:-]?\\s*([^\\n]+(?:\\n[^\\n]+)?)/i),
      technicalSpecifications: extractSection(/(?:technical specifications|specifications|tech specs)\\s*[:-]?\\s*([^]+?)(?:\\n\\n|[A-Z][a-z]+:)/i),
      material: extractSection(/(?:material|made of)\\s*[:-]?\\s*([^\\n,.]+)/i),
      dimensions: extractSection(/(?:dimensions|size)\\s*[:-]?\\s*([^\\n,.]+)/i),
      capacity: extractSection(/(?:capacity)\\s*[:-]?\\s*([^\\n,.]+)/i),
      voltage: extractSection(/(?:voltage|power)\\s*[:-]?\\s*([^\\n,.]+)/i),
      application: extractSection(/(?:application|used for)\\s*[:-]?\\s*([^\\n,.]+)/i),
      requiredStandards: extractSection(/(?:standards|is code|is number|comply with)\\s*[:-]?\\s*([^\\n,.]+)/i),
      tenderRequirements: extractSection(/(?:tender requirements|eligibility)\\s*[:-]?\\s*([^]+?)(?:\\n\\n|[A-Z][a-z]+:)/i),
      rawText: text.substring(0, 5000) // Pass back raw text for fallback matching
    };

    // Fallbacks if regex fails
    if (extracted.productName === "Not detected") {
      const firstLine = text.split('.')[0].substring(0, 100);
      extracted.productName = firstLine;
    }

    return NextResponse.json({ success: true, extracted });

  } catch (err: any) {
    return NextResponse.json({ error: "Failed to process document: " + err.message }, { status: 500 });
  }
}
