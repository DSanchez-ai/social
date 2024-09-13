import Image from "next/image";
import { Post as PostType, User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { Comments } from "./Comments";
import { Suspense } from "react";
import { PostInteraction } from "./PostInteraction";
import { PostInfo } from "./PostInfo";


type FeedPostType = PostType & { user: User } & {
  likes: [{ userId: string }];
} & {
  _count: { comments: number };
};

export const Post = ({ post }: { post: FeedPostType }) => {
  const { userId: currentUserId } = auth();
  return (
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={post.user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
          {post.user.name && post.user.surname
              ? post.user.surname + " " + post.user.name
              : post.user.username}
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
        <p className="text-sm lg:text-normal xl:text-lg line-clamp-2">
          {post.desc}
        </p>
        <a 
          href={`/post/${post.id}`}
          className="text-sm text-blue-500 hover:underline self-end"
        >
          {currentUserId === post.userId ? "Edit" : "View"}
        </a>
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