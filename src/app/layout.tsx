import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: {
    default: "Aegis Bank — Little Boy's Aegis | AI-Native Cyber Defense for Banking",
    template: "%s | Little Boy's Aegis — Aegis Bank",
  },
  description:
    "Aegis Bank is the secure digital banking platform built by Little Boy's Aegis — an AI-native cyber defense product by Little Boy's. Winner of 1st Place at AABW 2026 (Shinhan Bank Future Lab track). Features SOAR-powered SOC, MITRE ATT&CK correlation, and zero-trust architecture for modern financial services.",
  keywords: [
    "Little Boy's",
    "Little Boy's Aegis",
    "Aegis",
    "Aegis Bank",
    "AI cybersecurity",
    "SOAR platform",
    "banking security",
    "SOC dashboard",
    "MITRE ATT&CK",
    "zero trust banking",
    "AABW 2026",
    "Shinhan Bank Future Lab",
    "intrusion detection",
    "incident response",
    "policy as code",
    "agentic AI security",
    "sustainable finance",
    "Vietnam fintech",
  ],
  authors: [
    { name: "Little Boy's", url: "https://github.com/Little-Boy-s-Aegis" },
  ],
  creator: "Little Boy's",
  publisher: "Little Boy's Aegis",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/Little-Boy-s-Aegis",
    siteName: "Little Boy's Aegis — Aegis Bank",
    title: "Aegis Bank — Little Boy's Aegis | AI-Native Cyber Defense for Banking",
    description:
      "Aegis Bank by Little Boy's Aegis — an enterprise-grade AI-native SOC platform for banking cybersecurity. Built by Little Boy's. 1st Place Winner at AABW 2026.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegis Bank — Little Boy's Aegis | AI-Native Cyber Defense",
    description:
      "Little Boy's Aegis is an AI-native cyber defense platform for modern banking by Little Boy's. SOAR-powered SOC, MITRE ATT&CK, zero-trust architecture.",
    creator: "@littleboysaegis",
  },
  metadataBase: new URL("https://github.com/Little-Boy-s-Aegis"),
  alternates: {
    canonical: "https://github.com/Little-Boy-s-Aegis",
  },
  category: "Cybersecurity",
  other: {
    "application-name": "Aegis Bank by Little Boy's",
    "apple-mobile-web-app-title": "Little Boy's Aegis",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Little Boy's Aegis",
  alternateName: ["Aegis", "Aegis Bank", "Little Boy's"],
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description:
    "Aegis is an AI-native cyber defense platform developed and owned by Little Boy's. It provides enterprise-grade SOAR-powered SOC capabilities for modern banking, featuring MITRE ATT&CK correlation, zero-trust architecture, and agentic AI security agents.",
  author: {
    "@type": "Organization",
    name: "Little Boy's",
    url: "https://github.com/Little-Boy-s-Aegis",
  },
  award: "1st Place — Shinhan Bank Future Lab Track — Agentic AI Build Week 2026",
  keywords:
    "Little Boy's, Little Boy's Aegis, Aegis, cybersecurity, SOAR, SOC, banking security, MITRE ATT&CK, agentic AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
