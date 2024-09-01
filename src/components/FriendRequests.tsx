import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image"
import Link from "next/link"

export const FriendRequests = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: currentUserId
    },
    include: {
      sender: true
    }
  });

  if(requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href="/" className="text-blue-500 text-xs">See all</Link>
      </div>
      { /* USER */}
      {requests.map((request) => (
        <div 
          key={request.id}
          className="flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
              <Image 
                src={request.sender.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-fill"
              />
              <span className="text-sm">
                {request.sender.surname && request.sender.name ? request.sender.surname + " " + request.sender.name : request.sender.username}
              </span>
            </div>
            <div className="flex gap-3 justify-end">
              <Image src="/accept.png" alt="" width={20} height={20} className="cursor-pointer"/>
              <Image src="/reject.png" alt="" width={20} height={20} className="cursor-pointer"/>
            </div>
        </div>
      ))}
      { /* BOTTOM */}
      <div className="">

      </div>
    </div>
  )
}