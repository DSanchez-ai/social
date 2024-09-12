import Image from "next/image";
import { Post as PostType, User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { PostInfo } from "./PostInfo";
import prisma from "@/lib/client";
import { Comments } from "./Comments";
import { Suspense } from "react";
import { PostInteraction } from "./PostInteraction";
import { EditPost } from "./EditPost";

type ViewPostType = PostType &  {
  likes: [{ userId: string }];
} & {
  _count: { comments: number };
};

export const ViewPost = async ({ post }: { post: ViewPostType }) => {
  const { userId: currentUserId } = auth();

  if(!currentUserId) return null;

  const user = await prisma.user.findFirst({
    where: {
      userId: post.userId
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
        <EditPost post={post} />
      </div> 
      { /* INTERACTION */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id} 
          likes={post.likes.map((like) => like.userId)} 
          commentNumber={post._count.comments}
        />
      </Suspense>      
      <Comments postId={post.id} />       
    </div>
  )
};