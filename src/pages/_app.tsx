import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from '@vercel/analytics/react';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PrimeReactProvider>
        <Component {...pageProps} />
        <Analytics />
      </PrimeReactProvider>
    </>
  );
}
