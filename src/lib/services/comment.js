import { prisma } from "@/utils/prisma";

export async function getCommentsByPostId(postId) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        include: {
          votes: {
            where: { postId },
            select: { type: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return comments;
}

export async function createComment({ userId, postId, comment }) {
  const newComment = await prisma.comment.create({
    data: {
      comment,
      user: {
        connect: { id: userId },
      },
      post: {
        connect: { id: postId },
      },
    },
    include: {
      user: {
        include: {
          votes: {
            where: { postId },
            select: { type: true },
          },
        },
      },
    },
  });

  return newComment;
}
