import "@/styles/globals.css";
import "@/styles/popover-styles.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import Head from "next/head";

const poppins = Poppins({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${poppins.className}`}>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💌</text></svg>"
        />
      </Head>
      <Component {...pageProps} />
    </main>
  );
}
