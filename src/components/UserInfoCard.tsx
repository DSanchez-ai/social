import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { UserInfoCardInteraction } from "./UserInfoCardInteraction";

export const UserInfoCard = async ({user}: {user:User}) => {
  const createdAtDate = new Date(user.createdAt);

  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const {userId: currentUserId} = auth();

  if(currentUserId) {
    const block = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.userId
      }
    });

    if(block) isUserBlocked = true;

    const follow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.userId
      }
    });

    if(follow) isFollowing = true;

    const followSent = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.userId
      }
    });

    if(followSent) isFollowingSent = true;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
        {currentUserId === user.userId ? (
          <Link href="/settings" className="text-blue-500 text-xs">Edit</Link>
        ) : (
          <Link href="/" className="text-blue-500 text-xs">See all</Link>
        )}
      </div>
      { /* BOTTOM */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-lg text-black">
            {(user.name && user.surname ? user.surname + " " + user.name : user.username)}
          </span>
          <span className="text-sm">@{user.username}</span>
        </div>
        {user.description && <p>{user.description}</p>}
        {user.city && (
          <div className="flex items-center gap-2">
            <Image src="/map.png" alt="" width={16} height={16} />
            <span>
              Living in <b>{user.city}</b>
            </span>
          </div>
        )}
        {user.school && (
          <div className="flex items-center gap-2">
            <Image src="/school.png" alt="" width={16} height={16} />
            <span>
              Went to <b>{user.school}</b>
            </span>
          </div>
        )}
        {user.work && (
          <div className="flex items-center gap-2">
            <Image src="/work.png" alt="" width={16} height={16} />
            <span>
              Works as <b>{user.work}</b>
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {user.website && (
            <div className="flex gap-1 items-center">
              <Image src="/link.png" alt="" width={16} height={16} />
              <Link href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-medium">
                @{user.username}
              </Link>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <Image 
              src="/date.png"
              alt=""
              width={16}
              height={16}
            />  
            <span>Joined {formattedDate}</span>
          </div>
        </div>
        {currentUserId && currentUserId !== user.userId && (
          <UserInfoCardInteraction 
            userId={user.userId} 
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}  
          />
        )}
      </div>
    </div>
  )
};