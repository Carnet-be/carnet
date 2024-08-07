import { eq } from "drizzle-orm";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { profiles } from "~/server/db/schema";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      let [pro] = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.id, input));
      if (!pro) {
        pro = await ctx.db
          .insert(profiles)
          .values({
            id: input,
          })
          .returning()
          .then((res) => res[0]);
      }
      return pro;
    }),
  existProfile: protectedProcedure.query(async ({ ctx }) => {
    const { orgId, userId } = ctx.auth;
    const id = orgId ?? userId;
    if (!id) {
      return null;
    }
    const [pro] = await ctx.db
      .select()
      .from(profiles)
      .where(eq(profiles.id, orgId ?? userId ?? ""));

    if (pro) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return pro.email || pro.email2 || pro.phone || pro.phone2 ? true : false;
    } else {
      return false;
    }
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().optional().nullable(),
        email2: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        phone2: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(profiles)
        .set({
          email: input.email,
          email2: input.email2,
          phone: input.phone,
          phone2: input.phone2,
          address: input.address,
        })
        .where(eq(profiles.id, input.id));
    }),
});
