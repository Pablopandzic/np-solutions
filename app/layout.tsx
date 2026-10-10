import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NP Solutions | Mecanizado CNC y tecnología láser",
  description:
    "Manufactura avanzada: mecanizado CNC, grabado láser de fibra y soldadura de termoplásticos para la industria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-zinc-900 shadow-none">
        {children}
      </body>
    </html>
  );
}
