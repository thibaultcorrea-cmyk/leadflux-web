import type { Metadata } from "next";
import { Inter, League_Gothic, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ModalProvider } from "@/components/shared/Modals/ModalProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league-gothic",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leadflux",
  description: "Agent de prospection commercialisable d'OxIAgen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "font-sans",
        inter.variable,
        playfair.variable,
        leagueGothic.variable
      )}
    >
      <body>
        {/* nuqs : les filtres d'écran (statut des emails…) vivent dans l'URL,
            donc une vue filtrée se partage et se recharge à l'identique. */}
        <NuqsAdapter>
          <ModalProvider>
            {children}
          </ModalProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
