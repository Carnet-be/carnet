import { publicProcedure, router } from "../trpc";
import z from "zod";

export const blogRouter = router({
  getBlogs: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.blog.findMany({
      orderBy: {
        createAt: "desc",
      },
      include: {
        image: true,
        author: {
          include: {
            image: true,
          },
        },
      },
    });
  }),
  getBlog: publicProcedure
    .input(
      z.object({
        id: z.number(),
        locale: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.blog.findFirst({
        where: {
          id: input.id,
        },
        include: {
          image: true,
          author: {
            include: {
              image: true,
            },
          },
        },
      });
    }),

  addBlog: publicProcedure
    .input(
      z.object({
        blog: z.object({
          title: z.string(),
          content: z.string(),
          locale: z.string().optional(),
        }),
        image: z.object({
          fileKey: z.string(),
          name: z.string(),
          url: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { blog, image } = input;
      return await ctx.prisma.blog.create({
        data: {
          ...blog,
          image: {
            create: image,
          },
          author: {
            connect: {
              email: ctx.session?.user?.email || "",
            },
          },
        },
      });
    }),
  updateBlog: publicProcedure
    .input(
      z.object({
        blog: z.object({
          id: z.number(),
          title: z.string(),
          content: z.string(),
          locale: z.string().optional(),
        }),
        image: z.object({
          fileKey: z.string(),
          name: z.string(),
          url: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { blog, image } = input;
      const { id, content, title, locale } = blog;
      return await ctx.prisma.blog.update({
        where: {
          id: id,
        },
        data: {
          title,
          content,
          locale,
          image: {
            create: image,
          },
        },
      });
    }),
  deleteBlog: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.blog.delete({
        where: {
          id,
        },
      });
    }),
});
