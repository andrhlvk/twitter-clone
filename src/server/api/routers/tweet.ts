import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "y/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor && { createdAt_id: cursor },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          createdAt: true,
          content: true,
          _count: { select: { likes: true } },
          likes: currentUserId ? { where: { userId: currentUserId } } : false,
          user: { select: { name: true, image: true, id: true } },
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        nextCursor,
        tweets: data.map((tweet) => {
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            user: tweet.user,
            likedByMe: tweet.likes?.length > 0,
          };
        }),
      };
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      return await ctx.prisma.tweet.create({
        data: { content, userId: ctx.session.user.id },
      });
    }),
});
