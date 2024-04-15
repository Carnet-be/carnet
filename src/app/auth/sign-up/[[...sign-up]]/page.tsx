
import { SignUp } from "@clerk/nextjs";

export default function Example() {


  return <SignUp  redirectUrl={"/dashboard"} appearance={{
    elements:{
      card:'shadow-xl border'
    }
  }}/>
}
