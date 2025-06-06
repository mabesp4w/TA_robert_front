/** @format */

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Fuzzy Mamdani System",
  description:
    "Advanced Fuzzy Logic Inference System for Cattle Disease Diagnosis",
  keywords: "fuzzy logic, mamdani, inference system, cattle diagnosis, AI",
  authors: [{ name: "SmartSpartacuS" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-quicksand`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
