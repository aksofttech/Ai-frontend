import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yugsoft Tech - Enterprise Educational AI SaaS",
  description: "Next-gen AI orchestration canvas and gamified learning platform.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="h-full flex flex-col text-white bg-obsidian custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
