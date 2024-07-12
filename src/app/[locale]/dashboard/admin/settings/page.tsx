
import { UserProfile, } from "@clerk/nextjs";


const LayoutSettings = () => {


  return <div>
    <UserProfile
      path="settings"
      appearance={{
        elements: {
          card: "shadow-none"
        }
      }} >

    </UserProfile>





  </div>
}

export default LayoutSettings;
