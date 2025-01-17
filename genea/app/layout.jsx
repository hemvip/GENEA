import "./globals.css"
import "./index.css"
import "../styles/custom.css"
import "katex/dist/katex.min.css"

import { ThemeProvider } from "next-themes"
import Body from "@/components/body"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Twitter from "@/components/twitter"
import AuthProvider from "@/components/auth/AuthProvider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
// import { useThemeConfig } from "@/contexts/theme";

export const metadata = {
  title: "GENEA",
  description: "Generated by create next app",
}

export default function RootLayout({ children }) {
  // const themeConfig = useThemeConfig()
  // <html lang="en" className="js-focus-visible light" suppressHydrationWarning={true} dir="ltr" style={{ colorScheme: "light" }} >

  return (
    <html lang="en" suppressHydrationWarning dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico"></link>
        <meta
          name="description"
          content="GENEA (Generation and Evaluation of Non-verbal Behaviour for Embodied Agents) Leaderboard is a leaderboard for benchmarking gesture generation models with human evaluation.
The GENEA Leaderboard is the evolution of the GENEA challenge, which was held at the GENEA Workshop at ICMI 2020, 2021, 2022, 2023, and 2024. We standardize the input, output and evaluation process of gesture generation models with human evaluation."
        />
        <meta name="author" content="GENEA Leaderboard" />
        <title>GENEA Leaderboard Submission Page</title>
      </head>
      <body className="nextra-banner-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div dir="ltr">
              <Header />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
