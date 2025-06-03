import Head from "next/head";
import { LandingPage } from "../components/landing-page/landing-page";

export default function Home() {
  return (
    <>
      <Head>
        <title>WFF</title>
      </Head>
      <div className="text-black">
        <LandingPage />
      </div>
    </>
  );
}
