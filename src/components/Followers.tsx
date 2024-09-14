import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link"
import { FollowersList } from "./FollowersList";

export const Followers = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null;

  const requests = await prisma.follower.findMany({
    where: {
      followingId: currentUserId
    },
    include: {
      follower: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if(requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* FOLLOWERS */}
      <FollowersList requests={requests} />
    </div>
  )
}