import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from '../../server/db/client';

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
   console.log('req', req.query)
    const id=req.query.id as string

    if(id){
      prisma.user.update({where:{
        id
     },
     data:{
        emailVerified:true
     }
    }).then((user)=>{
        res.status(200).send({message:"L'email : "+user.email+" est vérifié avec succès 🎉"})
    }).catch((err)=>{
        console.log('err', err)
        res.status(400).send({message:"Erreur rencontré lors de la vérification de l'email"})
    })
    }else{
    res.status(400).send({message:"Le code de vérification invalide"})
    } 
     
  };
  
  export default restricted;
  