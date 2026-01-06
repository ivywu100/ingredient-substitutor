import { lightTheme } from "@/src/theme/mui-theme";
import { ThemeProvider } from "@mui/material";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Baking Ingredient Substitution Engine",
    template: "%s | Baking Ingredient Substitution Engine",
  },
  description: "Find ingredient substitutions and baking effects.",
  openGraph: {
    title: "Baking Ingredient Substitution Engine",
    description: "Smart ingredient substitutions for baking recipes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Baking Ingredient Substitution Engine",
            url: "https://your-domain.com",
            description:
              "Find smart ingredient substitutions and baking effects.",
          }),
        }}
      />
      <head>
        <meta name="google-site-verification" content="SfPj_WTSxLXjEqapUeg8vCbrsf663k4ISSuuEkhru2E" />
        <script type="application/ld+json" src="/schema/website.json" />
      </head>
      <body>
        <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
