import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property='og:title' content='SuperNate Generator' key='title' />
        <meta
          property='og:description'
          content='What would Nate look like if he was a superhero depicted in various artistic styles?'
          key='description'
        />
        <meta name='twitter:card' content='summary_large_image'></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
