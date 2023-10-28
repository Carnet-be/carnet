
import {  SignUp} from "@clerk/nextjs";
 
export default function Example() {

 
  return <SignUp  redirectUrl={"/auth/organisation"} appearance={{
    elements:{
      card:'shadow-xl border'
    }
  }}/>
}