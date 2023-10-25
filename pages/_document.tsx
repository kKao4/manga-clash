/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content="read manga for free" />
        <meta name="keywords" content="manga clash, kkao4, manga free" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="author" content="kkao4" />
      </Head>
      <body className="antialiased scroll-smooth">
        <Main />
        <NextScript />
      </body>
      {/* <Script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" /> */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript">
      </script>
    </Html>
  )
}
