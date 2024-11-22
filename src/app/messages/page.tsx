import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import { LeftMenu } from "@/components/LeftMenu";
import { MessageStatus } from "@/components/MessageStatus";
import { RightMenu } from "@/components/RightMenu";
import { UserMessages } from "@/components/UserMessages";
import { UserCard } from "@/components/UserCard";



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
          <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-2">
            <div className="flex justify-between items-center font-medium">
              <span className="text-gray-500">Incoming Messages</span>
              <Link href="/messages/sent">
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs p-1 xl:p-2 rounded-md">
                  Sent Messages
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
                      <MessageStatus message={request} username={request.sender.username}/>
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