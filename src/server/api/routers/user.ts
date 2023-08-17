/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import z from "zod";

export const name = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.name.findMany({
      take: 100,
    });
  }),

  save: publicProcedure
    .input(z.object({ firstname: z.string(), lastname: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.name.create({
        data: { ...input },
      });
    }),

  delete: publicProcedure
    .input(z.string().nonempty({ message: "ID must not be empty" }))
    .mutation(async ({ ctx, input }) => {
      const id = input;

      const deletedData = await ctx.prisma.name.delete({
        where: {
          id,
        },
      });

      return deletedData;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().nonempty({ message: "ID must not be empty" }),
        firstname: z.string(),
        lastname: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const updatedData = await ctx.prisma.name.update({
        where: { id },
        data,
      });

      return updatedData;
    }),
});

export const profile = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pupil.findMany({
      take: 100,
    });
  }),
});
