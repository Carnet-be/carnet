import {Button} from "@nextui-org/react";
import {auth, SignInButton} from "@clerk/nextjs";
import Link from "next/link"

export default function Home(){
    const {userId} = auth()
    return <div className="w-screen h-screen center gap-2">
        {userId?  <Link href={"/dashboard"}>
            <Button>
                Workspace
            </Button>
        </Link> : <SignInButton/>}
    </div>
}
