import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export const ProfileCard = async () => {
  const {userId} = auth();

  if(!userId) return null

  const user = await prisma.user.findFirst({
    where: {
      userId: userId
    },
    include: {
      _count: {
        select: {
          followings: true,
        }
      }
    },
  });  

  if(!user) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
      <div className="h-20 relative">
        <Image 
          src={user.cover || "/noCover.png"}
          alt=""
          fill
          className="object-cover rounded-md"
        />
        <Image 
          src={user.avatar || "/noAvatar.png"}
          alt=""
          width={48}
          height={48}
          className="rounded-full object-fill bg-slate-400 w-16 h-16 absolute left-0 right-0 m-auto -bottom-6 ring-2 ring-white z-10"
        />
      </div>
      <div className="h-20 flex flex-col gap-2 items-center mt-3">
        <span className="font-semibold">
          {(user.name && user.surname ? user.surname + " " + user.name : user.username)}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex">
            <Image 
              src="/Sarah.png"
              alt=""
              width={14}
              height={14}
              className="rounded-full object-cover w-4 h-4 mr-1"
            />
            <Image 
              src="/sidi.png"
              alt=""
              width={14}
              height={14}
              className="rounded-full object-cover w-4 h-4 mr-1"
            />
            <Image 
              src="/mara.png"
              alt=""
              width={14}
              height={14}
              className="rounded-full object-cover w-4 h-4"
            />                        
          </div>
          <span className="text-xs text-gray-500">{user._count.followings} Followers</span>
        </div>
        <Link href={`/profile/${user.username}`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs p-2 rounded-md">My Profile</button>
        </Link>
      </div>
    </div>
  )
};