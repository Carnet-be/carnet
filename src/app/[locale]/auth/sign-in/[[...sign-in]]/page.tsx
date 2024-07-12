
import { SignIn} from "@clerk/nextjs";
 
export default function Example() {

 
  return <SignIn appearance={{
    elements:{
      card:'shadow-xl border'
    }
  }}/>
}