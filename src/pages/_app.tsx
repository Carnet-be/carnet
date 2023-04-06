/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { db } from "@utils/firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";

import { toast } from "react-toastify";
import { appWithTranslation } from "next-i18next";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { messaging, msgKey } from "@utils/firebase";
import { getToken } from "firebase/messaging";
import OneSignal from "react-onesignal";
import { ToastContainer } from "react-toastify";
import { useNotifyMe } from "./hooks";
import { IntlProvider } from "react-intl";
import "@utils/i18n";

import frFR from "antd/locale/fr_FR";
import enUS from "antd/locale/en_US";

// import en from "../lang/en.json";
// import fr from "../lang/fr.json";
// const messages = {

//   en,
//   fr,
// };
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { ConfigProvider } from "antd";
const MyApp = ({ Component, pageProps: { session, ...pageProps } }: any) => {
  const { locale } = useRouter();
  //i18next.reloadResources();
  //init moment locale
  useEffect(() => {
    if (locale) {
      if (locale == "en") {
        moment.locale("en");
      } else {
        import(`moment/locale/${locale}`).then(() => {
          moment.locale(locale);
        });
      }
    }
  }, [locale]);
  const getAntdLocale = () => {
    switch (locale) {
      case "en":
        return enUS;
      case "fr":
        return frFR;
      default:
        return enUS;
    }
  };
  return (
    // <IntlProvider locale={locale||"fr"}  messages={messages[locale as Locale||"fr"]}>
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

      <ConfigProvider locale={getAntdLocale()}>
        <App>
          <Component {...pageProps} />
        </App>
      </ConfigProvider>
      <Toaster />
      <ToastContainer position="bottom-right" autoClose={8000} />
      <audio
        id="audio"
        controls
        src="/audio/notification_v2.mp3"
        className="absolute top-0 left-0 z-[-10000]"
      ></audio>
    </SessionProvider>
    // </IntlProvider>
  );
};

const App = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useNotifyMe({ uid: "123456" });
  return <>{children}</>;
};

export default trpc.withTRPC(appWithTranslation(MyApp));

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
