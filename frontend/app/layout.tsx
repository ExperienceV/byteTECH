import type React from "react"
import type { Metadata } from "next"
import { Raleway, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "byteTECH - Plataforma de Cursos Online",
  description: "Aprende tecnología con nuestros cursos especializados",
  generator: "A1_DevHub",
  keywords: [
    "cursos online",
    "tecnología",
    "byteTECH",
    "programación",
    "educación",
    "desarrollo web",
    "python",
    "react",
    "full stack",
  ],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "byteTECH - Plataforma de Cursos Online",
    description: "Aprende tecnología con nuestros cursos especializados",
    url: "https://bytetechedu.com",
    siteName: "byteTECH",
    images: [
      {
        url: "/byteTECH_banner.jpg",
        width: 1200,
        height: 630,
        alt: "byteTECH - Desarrollo de Software & Formación en Programación",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "byteTECH - Plataforma de Cursos Online",
    description: "Aprende tecnología con nuestros cursos especializados",
    site: "@bytetechedu",
    images: ["/byteTECH_banner.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${raleway.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link rel="icon" href="/act.ico" sizes="any" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
