import type { Metadata, Viewport } from "next";
import { Chakra_Petch, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Chakra_Petch({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-display" });
const body = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "RATH-A-MOLE | RATLOVE",
  description: "Rathbone goes underground in a 90-second chicken-slinging arcade game. Play RATH-A-MOLE at RATLOVE.ME.",
  openGraph: { title: "RATH-A-MOLE | RATLOVE", description: "The city has rats. Rathbone has chickens." },
};
export const viewport: Viewport = { themeColor: "#080f11", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={`${display.variable} ${body.variable} font-sans`}>{children}</body></html>;
}
