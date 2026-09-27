import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — AI-Powered Recommendation Engine for Indian Standards",
  description:
    "Procurement Official Login portal for the AI-Powered Recommendation Engine for Indian Standards (BIS). Authorized access only.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
