import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getRecommendations } from '../../../services/recommendationEngine';

export async function POST() {
  try {
    const rootPath = path.join(process.cwd(), '..');
    const goldSetPath = path.join(rootPath, 'eval', 'gold_set.csv');
    
    // Validate File Exists
    if (!fs.existsSync(goldSetPath)) {
      return NextResponse.json({ error: "gold_set.csv not found in eval/" }, { status: 404 });
    }

    const csvData = fs.readFileSync(goldSetPath, 'utf-8');
    const rows = csvData.split('\n').filter(r => r.trim().length > 0);
    
    const headers = rows[0].split(',');
    
    let totalQueries = 0;
    let correctStandard = 0;
    let correctCategory = 0;
    let top1Correct = 0;
    let top3Correct = 0;
    let noMatchCount = 0;
    let verificationCount = 0;
    
    let engTotal = 0, engCorrect = 0;
    let hinTotal = 0, hinCorrect = 0;

    const errors = [];
    let resultsCsv = "query,expected_is_number,predicted_is_number,expected_category,predicted_category,standard_correct,category_correct,confidence,status\n";

    for (let i = 1; i < rows.length; i++) {
      const rowStr = rows[i].trim();
      if (!rowStr) continue;
      
      const cols = rowStr.split(',');
      const query = cols[0];
      const expectedIS = cols[1];
      const expectedCat = cols[2];
      const lang = cols[3];
      
      totalQueries++;
      if (expectedIS === "REQUIRES_VERIFICATION") verificationCount++;
      if (lang === "English") engTotal++;
      if (lang === "Hindi") hinTotal++;

      // Run through actual production recommendation engine!
      const recs = getRecommendations(query);
      
      let predictedIS = "NONE";
      let predictedCat = "NONE";
      let conf = 0;
      let stdMatch = false;
      let catMatch = false;
      let statusStr = "Incorrect";
      let reason = "Engine returned no match.";

      if (!recs || recs.standards.length === 0) {
        noMatchCount++;
      } else {
        predictedCat = recs.detectedProduct;
        predictedIS = recs.standards[0].isNumber || "NONE";
        conf = recs.confidence;
        
        // Strict IS comparison
        if (expectedIS === "REQUIRES_VERIFICATION") {
           // Skip strict scoring for verification required
           statusStr = "Verification Required";
           reason = "Ground truth missing.";
        } else {
           // Is expected IS anywhere in top results?
           const top3Is = recs.standards.slice(0, 3).map(s => s.isNumber);
           if (top3Is.includes(expectedIS)) top3Correct++;
           
           if (predictedIS === expectedIS) {
             top1Correct++;
             correctStandard++;
             stdMatch = true;
             statusStr = "Correct";
             reason = "Exact match.";
             
             if (lang === "English") engCorrect++;
             if (lang === "Hindi") hinCorrect++;
           } else {
             reason = `Predicted ${predictedIS} but expected ${expectedIS}`;
           }
        }
        
        if (predictedCat.toLowerCase() === expectedCat.toLowerCase()) {
           correctCategory++;
           catMatch = true;
        }
      }

      if (!stdMatch && expectedIS !== "REQUIRES_VERIFICATION") {
        errors.push({
          query,
          expected_is: expectedIS,
          predicted_is: predictedIS,
          expected_cat: expectedCat,
          predicted_cat: predictedCat,
          status: statusStr,
          reason
        });
      }

      resultsCsv += `${query},${expectedIS},${predictedIS},${expectedCat},${predictedCat},${stdMatch},${catMatch},${conf},${statusStr}\n`;
    }

    const resultsPath = path.join(rootPath, 'eval', 'evaluation_results.csv');
    fs.writeFileSync(resultsPath, resultsCsv);

    const metrics = {
      total: totalQueries,
      standardAccuracy: totalQueries > 0 ? ((correctStandard / (totalQueries - verificationCount)) * 100).toFixed(1) : "0.0",
      categoryAccuracy: totalQueries > 0 ? ((correctCategory / totalQueries) * 100).toFixed(1) : "0.0",
      top1Accuracy: totalQueries > 0 ? ((top1Correct / (totalQueries - verificationCount)) * 100).toFixed(1) : "0.0",
      top3Accuracy: totalQueries > 0 ? ((top3Correct / (totalQueries - verificationCount)) * 100).toFixed(1) : "0.0",
      noMatchRate: totalQueries > 0 ? ((noMatchCount / totalQueries) * 100).toFixed(1) : "0.0",
      verificationRequired: verificationCount,
      englishAccuracy: engTotal > 0 ? ((engCorrect / engTotal) * 100).toFixed(1) : "0.0",
      hindiAccuracy: hinTotal > 0 ? ((hinCorrect / hinTotal) * 100).toFixed(1) : "0.0",
      errors
    };

    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
