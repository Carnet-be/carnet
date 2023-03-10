/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { messaging, msgKey } from "@utils/firebase";
import { getToken } from "firebase/messaging";
import { useTokenStore } from "../state";
import OneSignal from 'react-onesignal';

const MyApp= ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  
  return (
    <SessionProvider session={session}>
      <Head>
        <title>CARNET</title>
        <link
          rel="shortcut icon"
          href="../public/assets/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
    
      <App>
      <Component {...pageProps} />
      </App>
      <Toaster />
    </SessionProvider>
  );
};

const App=({children})=>{
  const router=useRouter()

useEffect(() => {
  console.log(router.pathname)

}, [])



return <>{children}</>
}

export default trpc.withTRPC(MyApp);

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
