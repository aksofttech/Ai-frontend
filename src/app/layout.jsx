import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "YugSoft — Enterprise Educational AI SaaS",
  description: "Next-gen AI orchestration canvas and gamified learning platform for modern educators.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            localStorage.removeItem('dashboard-theme');
            document.documentElement.classList.remove('dark');
          } catch (_) {}
        `}} />
      </head>
      <body className="h-full flex flex-col text-cs-dark">
        {children}
      </body>
    </html>
  );
}
