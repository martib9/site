import '../styles/globals.css';
import '../styles/recipes.css';
import Head from 'next/head';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>LxD Budget</title>
        <link rel="icon" href="/meal-favicon.png" type="image/png" />
      </Head>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}