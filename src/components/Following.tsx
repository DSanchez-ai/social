import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { FollowingList } from "./FollowingList";

export const Following = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null;

  const requests = await prisma.follower.findMany({
    where: {
      followerId: currentUserId
    },
    include: {
      following: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if(requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* FOLLOWING */}
      <FollowingList requests={requests} />
    </div>
  )
}