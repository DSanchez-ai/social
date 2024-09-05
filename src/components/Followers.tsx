import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link"
import { FriendRequestList } from "./FriendRequestList";
import Image from "next/image";

export const Followers = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null;

  const requests = await prisma.follower.findMany({
    where: {
      followingId: currentUserId
    },
    include: {
      follower: true
    }
  });

  if(requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Followers</span>
        <Link href="/" className="text-blue-500 text-xs">See all</Link>
      </div>
      { /* USER */}
      {requests.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4 mb-1">
            <Image
              src={request.follower.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-fill"
            />
            <span className="text-xs xl:text-sm">
              {request.follower.name && request.follower.surname
                ? request.follower.surname + " " + request.follower.name
                : request.follower.username}
            </span>
          </div>
        <div className="flex gap-2 justify-end text-xs xl:text-sm">
          <Link href={`/profile/${request.follower.username}`}>
            <button className="bg-blue-500 text-white text-xs p-1 xl:p-2 rounded-md">
              View Profile
            </button>
          </Link>
        </div>
        </div>
      ))}
      { /* BOTTOM */}
    </div>
  )
}