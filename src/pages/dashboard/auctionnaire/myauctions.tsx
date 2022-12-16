import Dashboard from "@ui/dashboard";
import  { InDevelopmentMini } from "@ui/inDevelopment";
import { type NextPage } from "next";

const Home: NextPage = () => {
    return   <Dashboard type="AUC">
    <InDevelopmentMini section="My auctions"/>
    </Dashboard>
    };


    export default Home