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
import Script from "next/script"
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
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>GENEA 2024</title>
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
      </body>
      <Script
        async
        src="https://platform.twitter.com/widgets.js"
        charset="utf-8"
      ></Script>
    </html>
  )
}
