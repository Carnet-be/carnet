import Dashboard from "@ui/dashboard";
import  { InDevelopmentMini } from "@ui/inDevelopment";
import { type NextPage } from "next";

const Home: NextPage = () => {
    return   <Dashboard type="BID">
    <InDevelopmentMini section="My biddes"/>
    </Dashboard>
    };


    export default Home