import { DeleteMessage } from "@/components/DeleteMessage";
import { LeftMenu } from "@/components/LeftMenu";
import { MessageStatus } from "@/components/MessageStatus";
import { RightMenu } from "@/components/RightMenu";
import { SentMessages } from "@/components/SentMessages";
import { UserMessages } from "@/components/UserMessages";

import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { Check, CheckCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const SentMessagesPage = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null

  const messages = await prisma.message.findMany({
    where: {
      senderId: currentUserId
    },
    include: {
      user: true
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
              <span className="text-gray-500">Sent Messages</span>
              <Link href="/messages">
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs p-1 xl:p-2 rounded-md">
                  Inbox
                </button>
              </Link>              
            </div>
            {messages.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-slate-100 rounded-md shadow-md text-sm flex flex-col gap-2"
                  style={{ flexGrow: 1, flexShrink: 1, minHeight: 'auto', maxHeight: 'none', overflow: 'auto' }}
                >
                  <span className="text-xs text-gray-600 flex justify-end">
                    {new Date(request.createdAt).toLocaleDateString()}                  
                  </span>                      
                  <div className="flex items-center justify-between" >
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src={request.user.avatar || "/noAvatar.png"}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-fill"
                      />
                      <span className="text-xs xl:text-sm">
                        {request.user.name && request.user.surname
                        ? request.user.surname + " " + request.user.name
                        : request.user.username}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end items-center text-xs xl:text-sm">
                      {request.read ? (
                        <span className="text-xs text-blue-600">
                          <CheckCheck size={16} />
                        </span>
                      ): (
                        <span className="text-xs text-slate-500">
                          <Check size={16} />
                        </span>
                      )}  
                      <DeleteMessage  message={request}/>  
                      <Link href={`/profile/${request.user.username}`}>
                        <button className="text-green-500 text-xs p-1 xl:p-2 hover:underline">
                          {request.user.username}
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="" >
                    <SentMessages user={request.user} id={request.id}/>
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

export default SentMessagesPage