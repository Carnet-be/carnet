/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { db } from "@utils/firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";

import { toast } from 'react-toastify';

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { messaging, msgKey } from "@utils/firebase";
import { getToken } from "firebase/messaging";
import OneSignal from "react-onesignal";
import { ToastContainer } from 'react-toastify';
import {  useNotifyMe } from "./hooks";

import 'react-toastify/dist/ReactToastify.css';
const MyApp = ({ Component, pageProps: { session, ...pageProps } }:any) => {
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
      <ToastContainer position="bottom-right" autoClose={8000}/>
      <audio
         
        id="audio"
        controls
        src="/audio/notification_v2.mp3"
        className="absolute top-0 left-0 z-[-10000]"
      ></audio>
    </SessionProvider>
  );
};

const App = ({ children }:{children:ReactNode}) => {
  const router = useRouter();
   useNotifyMe({uid:"123456"})
  return <>{children}
  
  </>;
};

export default trpc.withTRPC(MyApp);

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
