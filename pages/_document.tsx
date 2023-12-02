import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <link rel="icon" href="/favicon.jpg" />
        <meta name="description" content="read manga for free" />
        <meta name="keywords" content="manga clash, kkao4, manga free" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Content-Language" content="vi"></meta>
        <meta name="author" content="kkao4" />
      </Head>
      <body className="antialiased scroll-smooth">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
