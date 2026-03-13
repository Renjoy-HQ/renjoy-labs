import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: {
    default: "Renjoy Labs — AI for Vacation Rental Operators",
    template: "%s | Renjoy Labs",
  },
  description:
    "Essays, tools, and honest conversations about AI in vacation rental management. By Jacob Mueller, CEO of Renjoy.",
  metadataBase: new URL("https://labs.renjoy.com"),
  openGraph: {
    title: "Renjoy Labs",
    description:
      "The VRM industry is in a gold rush. Here's what we're learning.",
    url: "https://labs.renjoy.com",
    siteName: "Renjoy Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renjoy Labs",
    description:
      "Essays, tools, and honest conversations about AI in vacation rental management.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-2J5FYNEMPB"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2J5FYNEMPB', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </html>
  );
}
