import { FriendPosts } from "@/components/FriendPosts";
import { LeftMenu } from "@/components/LeftMenu";
import { RightMenu } from "@/components/RightMenu";
import { UserMessages } from "@/components/UserMessages";

import prisma from "@/lib/client";
import { auth, User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";


const MessagesPage = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null

  const messages = await prisma.message.findMany({
    where: {
      userId: currentUserId
    },
    include: {
      sender: true
    },
    orderBy: {
      senderId: "desc"
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

  if(messages.length === 0) return null;

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
            <div className="w-full h-32 md:h-64 relative">
              <Image 
                src={user.cover || "/noCover.png"}
                alt=""
                fill
                className=" bg-white rounded-md object-fill"
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
          <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-2">
            <div className="flex justify-between items-center font-medium">
              <span className="text-gray-500">Messages</span>
            </div>
            {messages.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-slate-100 rounded-md shadow-md text-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between" >
                  <div className="flex items-center gap-4 mb-1">
                    <Image
                      src={request.sender.avatar || "/noAvatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-fill"
                    />
                    <span className="text-xs xl:text-sm">
                      {request.sender.name && request.sender.surname
                        ? request.sender.surname + " " + request.sender.name
                        : request.sender.username}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end items-center text-xs xl:text-sm">
                      {request.read ? (
                        <span className="text-green-500 text-xs p-1 xl:p-2">read</span>
                      ) : (
                        <span className="text-red-500 text-xs p-1 xl:p-2">new</span>
                      )}
                      <Link href={`/messages/create/${request.sender.username}`}>
                        <button className="text-green-500 text-xs p-1 xl:p-2 hover:underline">
                          reply
                        </button>
                      </Link>                    
                      <Link href={`/profile/${request.sender.username}`}>
                        <button className="text-green-500 text-xs p-1 xl:p-2 hover:underline">
                          {request.sender.username}
                        </button>
                      </Link>
                  </div>
                </div>
                <div className="" >
                  <UserMessages user={request.sender} id={request.id}/>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(request.createdAt).toLocaleDateString()}                  
                </span>
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

export default MessagesPage