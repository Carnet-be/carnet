import { type Session } from "next-auth";
import { prisma } from "../server/db/client";

export class ProcessUser {
  session: Session | null;
  constructor(session: Session | null) {
    this.session = session;
  }

  async getId() {
    return await prisma.user.findUnique({
      where: { email: this.session?.user?.email||"", },select:{id:true}
    }).then((user)=>user?.id);
  }
}
