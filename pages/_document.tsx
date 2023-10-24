/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
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
