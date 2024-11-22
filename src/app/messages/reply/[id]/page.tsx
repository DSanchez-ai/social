import { Suspense } from "react"
import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"
import { UserInfoCard } from "@/components/UserInfoCard"
import { FriendRequests } from "@/components/FriendRequests"
import { Followers } from "@/components/Followers"
import { Following } from "@/components/Following"
import { UserMediaCard } from "@/components/UserMediaCard"
import { CreateMessage } from "@/components/CreateMessage"
import { UserCard } from "@/components/UserCard"

const ReplyMessagePage = async ({params}:{params:{id:string}}) => {
  const {userId: currentUser} = auth();
  if(!currentUser) return null

  const messageId = params.id;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId
    }
  });

  if(!message) return null;

  const user = await prisma.user.findFirst({
    where: {
      userId: message.senderId
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
          </div>
          <CreateMessage user={user} reply={true} title={message.title}/>
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default ReplyMessagePage