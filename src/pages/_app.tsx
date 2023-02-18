import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
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

const App=({children}:{children:ReactNode})=>{
  const router=useRouter()
//   const {data:init,refetch,isLoading}=trpc.admin.init.useQuery(undefined,{enabled:false,
//   onError:(err)=>{
//     if(err.message.includes("401")){
//       router.push("/login")
//     }
//     console.log(err)
//   },
//   onSuccess:(data)=>{
//     console.log(data)
//     if(data.error){
//       if(data.error=="user not found"){
//         router.push("/auth/login")
//       }
//       if(data.error=="user not verified"){
//         router.push("/pages/email-verification")
//       }
//       if(data.error=="user not active"){
//         router.push("/pages/inactive") 
//     }


//   }else{
//     console.log(data.user)
//   }
// }

//   })
//   useEffect(() => {
//     console.log(router.pathname)
//     if(router.pathname.includes("/dashboard")){
//       refetch()
//     }
//   }, [router.pathname])

return <>{children}</>
}

export default trpc.withTRPC(MyApp);

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
