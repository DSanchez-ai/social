import Image from "next/image";
import Link from "next/link";

import { User } from "@prisma/client";
import prisma from "@/lib/client";

export const FriendPosts = async ({user}: {user:User}) => {

  const postsWithMedia = await prisma.post.findMany({
    where: {
      userId: user.userId,
      img: {
        not: null
      }
    },
    take: 8,
    orderBy: {
      createdAt: "desc"
    },
  });

  return (
    <div className="p-1 bg-white text-sm flex flex-col gap-4">
      { /* BOTTOM */}
      <div className="flex gap-4 justify-between flex-wrap">
        {postsWithMedia.length ? postsWithMedia.map((media) => (
          <div key={media.id} className="relative w-1/5 h-20 cursor-pointer">
            <Link href={`/post/${media.id}`}>
              <Image 
                src={media.img!}
                alt=""
                fill
                className="object-fill rounded-md"
              />
            </Link>
          </div>
        ))
        : <span className="text-gray-500 text-xs">No Posts</span>}
      </div>
    </div>
  )
};