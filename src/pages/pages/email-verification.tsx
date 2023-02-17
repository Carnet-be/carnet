import Lottie from "@ui/components/lottie";
import { type NextPage } from "next";
import animation from "@animations/email.json";
import { trpc } from "@utils/trpc";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/router";
import cx  from 'classnames';

const EmailVerification: NextPage = () => {
    const router=useRouter()
const {mutate:resend,isLoading:resending}=trpc.auth.resendVerif.useMutation({
    onError:(err) =>{
        console.log('err', err)
        toast.error("Problème rencontré")
    },
    onSuccess:()=>{
            console.log('email resent')
            toast.success("L'email vous a été renvoyé !")
    }
})
  const { data: user,isLoading} = trpc.user.get.useQuery(undefined,{
    onError:(err) =>{
        console.log('err', err)
        toast.error("Problème rencontré")
    },
    onSuccess:(user)=>{
        if(user?.emailVerified){
            console.log('email verified')
            toast.success("Activation réussie 🎉")
            router.replace('/dashboard')   
        }
    }
  });
  return (
    <div className="relative flex h-screen w-screen flex-row items-stretch">
      <div className="flex-grow bg-primary"></div>
      <div className="flex-grow bg-[#BBC3D7]"></div>
      <div className="fixed z-20 flex h-screen w-screen flex-row items-center justify-center p-4">
        {isLoading ? (
          <button className="btn-xl loading btn-ghost btn"></button>
        ) : (
          <>
            <div className="flex h-[500px] w-full max-w-4xl flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl ">Vérification de {"l'email"}</h2>
              <p className="opacity-50">
                Vous devez vérifier votre email pour compléter votre compte
              </p>
              <div className="max-w-[250px]">
                <Lottie animationData={animation} />
              </div>
              <p className="max-w-2xl text-center opacity-50">
                Un email a été envoyé à{" "}
                <span className="text-primary">{user?.email}</span> avec un lien
                pour vérifier votre compte. Si vous ne recevez pas au bout de
                quelques minutes, veuillez vérifier votre boîte de spam.
                <span className="text-green-500">{user?.username}</span>
              </p>
              <div className="flex w-full flex-row justify-evenly">
                <button onClick={()=>router.reload()} className="btn btn-outlined btn-sm">
                  refresh
                </button>
                <button onClick={()=>resend({email:user?.email||"",id:user?.id||""})} className={cx("btn-primary btn-sm btn",{
                    loading:resending
                })}>
                  {"Renvoyer l'email"}
                </button>
                <button  className={cx("loading btn-ghost btn-sm btn")}>
                  {"en attente de vérification"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
