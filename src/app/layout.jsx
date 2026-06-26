import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "YugSoft AI — Enterprise Educational AI SaaS",
  description: "Next-gen AI orchestration canvas and gamified learning platform for modern educators.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col text-cs-dark" style={{ background: 'linear-gradient(105deg, #FFF5F0 0%, #EDE8F5 100%)' }}>
        {children}
      </body>
    </html>
  );
}
