/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";
import NextNProgress from "nextjs-progressbar";
import { appWithTranslation } from "next-i18next";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import { useRouter } from "next/router";
import { useNotifyMe } from "./hooks";
import "@utils/i18n";
import frFR from "antd/locale/fr_FR";
import enUS from "antd/locale/en_US";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { CustomProvider } from "rsuite";
import enUSRS from "rsuite/locales/en_US";
import frFRRS from "rsuite/locales/fr_FR";

// import en from "../lang/en.json";
// import fr from "../lang/fr.json";
// const messages = {

//   en,
//   fr,
// };
//fix planet
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { ConfigProvider } from "antd";
import Cookies from "js-cookie";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LoadingSpinPage } from "@ui/loading";
import { useEffect, type ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";
const MyApp = ({ Component, pageProps: { session, ...pageProps } }: any) => {
  const { locale } = useRouter();
  const router = useRouter();
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
        return frFR;
    }
  };

  const getRsuiteLocale = () => {
    switch (locale) {
      case "en":
        return enUSRS;
      case "fr":
        return frFRRS;
      default:
        return frFRRS;
    }
  };

  useEffect(() => {
    const lang = Cookies.get("lang");
    console.log("lang", lang);
    if (lang && router.locale !== lang) {
      router.push(router.pathname, router.asPath, { locale: lang });
    }
  }, [router.locale]);
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
      <CustomProvider locale={getRsuiteLocale()}>
        <ThemeProvider
          theme={createTheme(
            {
              palette: {
                primary: { main: "#1976d2" },
              },
            },
            getAntdLocale()
          )}
        >
          <ConfigProvider locale={getAntdLocale()}>
            <App>
              {router.pathname.includes("/garages/") ? (
                <></>
              ) : (
                <NextNProgress color="#181BAA" height={5} />
              )}
              <Component {...pageProps} />
            </App>
          </ConfigProvider>
        </ThemeProvider>
      </CustomProvider>
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
  useNotifyMe({ uid: "123456" });
  const [isHydrated, setIsHydrated] = useState(false);

  //Wait till NextJS rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return <LoadingSpinPage />;
  return <>{children}</>;
};

export default trpc.withTRPC(appWithTranslation(MyApp));

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
