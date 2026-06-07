import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BiciVentura | Alquiler de Bicicletas en Granada, Nicaragua",
  description:
    "Explorá Granada en bicicleta. Alquiler fácil de bicicletas con rutas recomendadas por la ciudad colonial, el lago Nicaragua y el Volcán Mombacho. Reservá en minutos.",
  keywords: [
    "bicicletas",
    "alquiler",
    "Granada",
    "Nicaragua",
    "tour",
    "ciclismo",
    "Mombacho",
    "Lago Nicaragua",
    "BiciVentura",
    "cathedral",
    "colonial",
    "adventure",
    "bike rental",
    "Granada Nicaragua",
  ],
  authors: [{ name: "BiciVentura" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "BiciVentura | Alquiler de Bicicletas en Granada, Nicaragua",
    description:
      "Explorá Granada en bicicleta. Alquiler fácil, recorridos inolvidables.",
    siteName: "BiciVentura",
    type: "website",
    locale: "es_NI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiciVentura | Alquiler de Bicicletas en Granada",
    description:
      "Explorá Granada en bicicleta. Alquiler fácil, recorridos inolvidables.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-03QFFS5JEG";

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            {/* Google Tag (gtag.js) */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

