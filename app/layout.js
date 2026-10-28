
import "./globals.css";
import { AssessmentProvider } from "@/context/AssessmentContext";
import { Suspense } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/home/ChatWidget";

export const metadata = {
  title: "SYCLE — Lingkungan, tubuh, dan cerita harianmu",
  description: "Catatan kesehatan perempuan dan konteks lingkungan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AssessmentProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>

          <main>{children}</main>

          <Footer />

          <ChatWidget />
        </AssessmentProvider>
      </body>
    </html>
  );
}