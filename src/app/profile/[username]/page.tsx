import { Suspense } from "react"
import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { Feed } from "@/components/Feed"
import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"
import { UserInfoCard } from "@/components/UserInfoCard"
import { FriendRequests } from "@/components/FriendRequests"

const ProfilePage = async ({params}:{params:{username:string}}) => {
  const {userId: currentUser} = auth();
  if(!currentUser) return null

  const username = params.username;

  const user = await prisma.user.findFirst({
    where: {
      username: username
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

  let isBlocked = false;
  const block = await prisma.block.findFirst({
    where: {
      blockerId: user.userId,
      blockedId: currentUser
    }
  });

  if(block) isBlocked = true;

  if(isBlocked) return null;

  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="profile"/>
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <Image 
                src={user.cover || "/noCover.png"}
                alt=""
                fill
                className="object-cover bg-white rounded-md"
              />
              <Image 
                src={user.avatar || "/noAvatar.png"}
                alt=""
                width={128}
                height={128}
                className="w-32 h-32 rounded-full absolute left-0 right-0 mx-auto -bottom-16 object-fill ring-4 bg-slate-300 ring-white"
              />              
            </div>
            <h1 className="mt-20 mb-4 text-xl md:text-2xl font-medium">
              {(user.name && user.surname ? user.surname + " " + user.name : user.username)}
            </h1>
            <div className="flex items-center justify-center gap-12 mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followings}</span>
                <span className="text-sm">Followers</span>
              </div>              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followers}</span>
                <span className="text-sm">Following</span>
              </div>              
            </div>
          </div>
          <div className="xl:hidden">
            <Suspense fallback={<div>Loading...</div>} >
              <UserInfoCard user={user} />
            </Suspense>
            <FriendRequests />
          </div>
          <Feed />
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default ProfilePage