import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
// import { SearchProvider } from "@/contexts/SearchContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#111",
};

export const metadata: Metadata = {
  title: "Brand Ambassador Dashboard | BA App",
  description:
    "Effortlessly manage brand ambassadors with the BA App — featuring HubSpot integration, lead status filters, zip code search, and real-time updates.",
  keywords: [
    "Brand Ambassador App",
    "HubSpot Dashboard",
    "Lead Management",
    "CRM Integration",
    "BA App",
    "Marketing CRM",
    "Sales Tracking",
    "Zip Code Filtering",
    "Ambassador Platform",
    "HubSpot Contacts",
  ],
  authors: [{ name: "BA App Team", url: "https://ba-app-branded.vercel.app" }],
  creator: "BA App Team",
  metadataBase: new URL("https://ba-app-branded.vercel.app"),
  openGraph: {
    title: "Brand Ambassador Dashboard | BA App",
    description:
      "A modern CRM dashboard to manage brand ambassadors, sync contacts from HubSpot, and streamline your field team operations.",
    url: "https://ba-app-branded.vercel.app",
    siteName: "BA App",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/ba-open-graph.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "BA App Dashboard Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Ambassador Dashboard | BA App",
    description:
      "Manage ambassadors, track visits, and filter leads with a custom HubSpot-integrated platform.",
    images: ["https://ba-app-branded.vercel.app/og-image.jpg"], // Replace if needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#111]`}
      >
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
