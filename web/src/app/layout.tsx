import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "../components/ReactQueryProvider";

export const metadata: Metadata = {
  title: "VisiCore AI",
  description: "Unlock the Intelligence Within Every Frame",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#000000] text-white antialiased">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
