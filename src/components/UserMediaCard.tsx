import Image from "next/image";
import Link from "next/link";

import { UserMedia } from "../lib/Data";
import { User } from "@prisma/client";
import prisma from "@/lib/client";

export const UserMediaCard = async ({user}: {user:User}) => {

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
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href="/" className="text-blue-500 text-xs">See all</Link>
      </div>
      { /* BOTTOM */}
      <div className="flex gap-4 justify-between flex-wrap">
        {postsWithMedia.length ? postsWithMedia.map((media) => (
          <div key={media.id} className="relative w-1/5 h-20 cursor-pointer">
            <Image 
              src={media.img!}
              alt=""
              fill
              className="object-cover rounded-md"
            />
          </div>
        ))
        : <span className="text-gray-500">No media found</span>}
      </div>
    </div>
  )
};