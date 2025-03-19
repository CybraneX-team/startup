import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload CSS files to avoid 404 errors */}
        <link
          rel="preload"
          href="/_next/static/css/app/globals.css"
          as="style"
        />
        {/* Add any other global CSS files that need to be preloaded */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 