import { auth } from "@clerk/nextjs/server";
import { User as PrismaUser } from "@prisma/client";

interface User extends PrismaUser {
  _count: {
    posts: number;
    followings: number;
    followers: number;
  };
}
import Image from "next/image";
import Link from "next/link";

export const UserCard = ({ user }: { user: User }) => {
  const { userId: currentUserId } = auth();
 
  return (
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
    <div className="flex items-center justify-center mt-20 mb-4 gap-2">
      <h1 className="text-xl md:text-2xl font-medium">
        {(user.name && user.surname ? user.surname + " " + user.name : user.username)}
      </h1>
      {user.userId !== currentUserId && (
        <Link href={`/messages/create/${user.username}`}>
          <Image 
            src="/messages.png"
            alt="Messages"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </Link>
      )}
    </div>
    <div className="flex items-center justify-center gap-12 mb-4">
      <div className="flex flex-col items-center">
        <span className="font-medium">{user._count.posts}</span>
        <span className="text-sm">Posts</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-medium">{user._count.followings}</span>
        <span className="text-sm">Followers</span>
      </div>              
      <div className="flex flex-col items-center">
        <span className="font-medium">{user._count.followers}</span>
        <span className="text-sm">Following</span>
      </div>              
    </div>
  </div>    
  )
};