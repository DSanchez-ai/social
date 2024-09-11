import Image from "next/image";
import { Post as PostType, User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { PostInfo } from "./PostInfo";
import prisma from "@/lib/client";

export const ViewPost = async ({ post }: { post: PostType }) => {
  const { userId: currentUserId } = auth();

  if(!currentUserId) return null;

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
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
          {user.name && user.surname
              ? user.surname + " " + user.name
              : user.username}
          </span>
        </div>
        {currentUserId === post.userId && <PostInfo postId={post.id} />}
      </div>
      { /* DESC */}
      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          <Image 
            src={post.img || ""}
            alt=""
            width={650}
            height={650}
            className="object-contain rounded-md"
          />
        </div>
        <p className="text-sm lg:text-normal xl:text-lg">
          {post.desc}
        </p>
      </div> 
    </div>
  )
};