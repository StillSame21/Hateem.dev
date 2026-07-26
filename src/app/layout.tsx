import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Archivo is loaded as a variable font across both its weight and width axes,
   so the hero name can use genuine expanded width (wdth 125) at weight 600.
   Display and body type. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/* IBM Plex Mono is not a variable font on Google Fonts, so the two weights
   actually used are requested explicitly. Structural and data text only. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hateem.dev"),
  title: {
    default: "Mohamad Hateem — Final-year computer science student, UiTM",
    template: "%s — hateem.dev",
  },
  description:
    "Final-year computer science student at UiTM Shah Alam, available for a 14-week industrial training internship from September to December 2026. Full-stack systems: real-time dashboards, distributed simulation, and the plumbing in between.",
  keywords: [
    "industrial training",
    "internship",
    "Malaysia",
    "UiTM",
    "computer science",
    "full-stack developer",
    "Klang Valley",
  ],
  authors: [{ name: "Mohamad Hateem bin Nazamid" }],
  openGraph: {
    title: "Mohamad Hateem — Final-year computer science student, UiTM",
    description:
      "Available for a 14-week industrial training internship, September to December 2026. Klang Valley or remote.",
    url: "https://hateem.dev",
    siteName: "hateem.dev",
    locale: "en_MY",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f6f4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <a
          href="#main"
          className="mono sr-only rounded-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-surface focus:px-4 focus:py-3 focus:text-[13px] focus:text-ink focus:shadow-[0_1px_2px_rgba(21,25,28,0.08)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
