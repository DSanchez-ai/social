import { FollowersList } from "@/components/FollowersList";
import { FriendPosts } from "@/components/FriendPosts";
import { LeftMenu } from "@/components/LeftMenu";
import { ProfileCard } from "@/components/ProfileCard";
import { RightMenu } from "@/components/RightMenu";
import { UserCard } from "@/components/UserCard";
import { UserMediaCard } from "@/components/UserMediaCard";
import prisma from "@/lib/client";
import { auth, User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";


const FriendsPage = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null

  const friends = await prisma.follower.findMany({
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

  const user = await prisma.user.findFirst({
    where: {
      userId: currentUserId
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true
        }
      }
    },
  });

  if(!user) return null;

  if(friends.length === 0) return null;

  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="profile"/>
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="hidden xl:block">
            <UserCard user={user} />
          </div>
          <div className="xl:hidden">
            <ProfileCard />
          </div>          
          <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-2">
          <div className="flex justify-between items-center font-medium">
            <span className="text-gray-500">Friends</span>
          </div>
          {friends.map((request) => (
            <div
              key={request.id}
            >
              <div className="flex items-center justify-between" >
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
                      <button className="text-blue-500 text-xs p-1 xl:p-2 hover:underline">
                        View Profile
                      </button>
                    </Link>
                </div>
              </div>
              <div className="" >
                <FriendPosts user={request.follower}/>
              </div>
            </div>
          ))}      
        </div>
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default FriendsPage