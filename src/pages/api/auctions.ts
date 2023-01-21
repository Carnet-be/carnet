import { type NextApiRequest, type NextApiResponse } from "next";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
const auctions= await prisma?.auction.findMany({
    include:{
        address:true,
        bids:true,
        images:true,
        options:true,
        rating:true,
        specs:true,
        auctionnaire:true,

    }
});

return res.json(auctions);
};

export default restricted;
