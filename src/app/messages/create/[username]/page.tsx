import { Suspense } from "react"
import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { Feed } from "@/components/Feed"
import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"
import { UserInfoCard } from "@/components/UserInfoCard"
import { FriendRequests } from "@/components/FriendRequests"
import { Followers } from "@/components/Followers"
import { Following } from "@/components/Following"
import { UserMediaCard } from "@/components/UserMediaCard"
import { CreateMessage } from "@/components/CreateMessage"
import { UserCard } from "@/components/UserCard"

const CreateMessagePage = async ({params}:{params:{username:string}}) => {
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
          <div className="">
            <UserCard user={user} />
          </div>
          <div className="lg:hidden">
            <Suspense fallback={<div>Loading...</div>} >
              <UserMediaCard user={user}/>
            </Suspense>                
            {currentUser === user.userId && (
              <>
                <div className="mt-2">
                  <FriendRequests />
                </div>
                <div className="mt-2">
                  <Followers />
                </div>
                <div className="mt-2">
                  <Following />
                </div>
              </>
            )}
          </div>
          <CreateMessage user={user}/>
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default CreateMessagePage