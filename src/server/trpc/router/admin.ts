import { Brand, type User } from "@prisma/client";
import { Transporter } from "@utils/nodemailer";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { router, publicProcedure } from "../trpc";

export const ZStaff = z.object({
  username: z.string(),
  email: z.string().email(),
});

const ZBrand=z.object({
    id:z.number().optional(),
    name: z.string(),
    country: z.string().optional(),
    description: z.string().optional(),
  })
  const ZModel=z.object({
    id:z.number().optional(),
    name: z.string(),
    year: z.number(),
    description: z.string().optional(),
  })
export const adminRouter = router({
  getBrand: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.brand.findMany({
      include: { models: { select: { id: true } } },
      orderBy:{
        id:'desc'
      }
    });
  }),
  removeBrand: publicProcedure.input(z.array(z.number())).mutation(async ({ input,ctx }) => {
    return await ctx.prisma.brand.deleteMany({
      where: {
        id: {
          in: input,
          },
      }}
    )
  }),
  removeModel: publicProcedure.input(z.array(z.number())).mutation(async ({ input,ctx }) => {
    return await ctx.prisma.model.deleteMany({
      where: {
        id: {
          in: input,
          },
      }}
    )
  }),
  addBrand: publicProcedure
    .input(
     z.object(
      {
        init:z.array(ZBrand),
        brands:z.array(ZBrand)
      }
     )
    )
    .mutation(async ({ input, ctx }) => {
      const brands: any = input.init;
      for (const b of input.brands) {
        if (!brands.map((b:Brand) => b.name).includes(b.name)) {
          brands.push(b);
        }
      }
      console.log(brands)
      return await ctx.prisma.brand.createMany({
        data:brands,skipDuplicates:false
      })
    }),
    updateBrand: publicProcedure
    .input(
     z.object(
     {
      data:ZBrand,
      id:z.number()
     }
     )
    )
    .mutation(async ({ input, ctx }) => {
      
      return await ctx.prisma.brand.update({
        where:{
          id:input.id
        },
        data:input.data
      })
    }),
  getModel: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.model.findMany({
      include: { brand: true, },   orderBy:{
        id:'desc'
      }
    });
  }),
  addModel: publicProcedure
    .input(
     z.object(
      {
        brandId:z.number(),
        models:z.array(ZModel)
      }
     )
    )
    .mutation(async ({ input, ctx }) => {
      
      return await ctx.prisma.model.createMany({
        data:input.models.map((m)=>({...m,brand_id:input.brandId}))
      })
    }),
 
  getStaff: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const [staffs, demandes] = await prisma.$transaction([
      ctx.prisma.user.findMany({ where: { type: "STAFF" } }),
      ctx.prisma.demandeStaff.findMany(),
    ]);
    return { staffs, demandes };
  }),
  getUsers: publicProcedure
    .input(z.object({ type: z.enum(["ADMIN", "BID", "AUC", "STAFF"]) }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findMany({
        where: { type: input.type },
        include: {
          auctions: {
            include: { bids: true },
          },
          bids: { include: { bidder: true } },
        },
      });
    }),
  demandeStaff: publicProcedure
    .input(ZStaff)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.demandeStaff
        .create({
          data: input,
        })
        .then((staff) => {
          sendDemandeStaff(staff);
        });
    }),
  updateStaff: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          username: z.string(),
          tel: z.string().nullable(),

          email: z.string().email(),
          isActive: z.boolean(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: input.data,
      });
    }),
  deleteStaff: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.delete({ where: { id: input } });
    }),
  deleteDemande: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.demandeStaff.delete({ where: { id: input } });
    }),
});

const sendDemandeStaff = async (user: User | { email: string; id: string }) => {
  await Transporter.sendMail({
    to: user.email,
    from: process.env.ADMINS_EMAIL,
    subject: `Compte staff chez CARNET`,
    html: `<div><h3>Vous venez d'avoir un compte staff sur CARNET, veuillez compléter votre compte : </h3> <a href="${getBaseUrl()}/pages/newStaff?id=${
      user.id
    }">compléter ici</a></div>`,
  });
};
