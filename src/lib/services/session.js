"use server";

import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export async function createSession(userId) {
  const session = await prisma.session.create({
    data: {
      userId,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24), // 1 day expiration
    },
  });
  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value || "";
  if (!sessionId) return null;
  const session = await prisma.session.findUnique({
    where: { id: sessionId, expires: { gt: new Date() } },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          avatarUrl: true,
        },
      },
    },
  });
  if (!session) return null;
  return session;
}
