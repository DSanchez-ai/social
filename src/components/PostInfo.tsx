"use client";

import Image from "next/image";
import { useState } from "react";
import { deletePost } from "@/lib/actions";
import Link from "next/link";


export const PostInfo = ({ postId }: { postId: string }) => {
  const [open, setOpen] = useState(false);

  const deletePostWithId = deletePost.bind(null, postId);

  return (
    <div className="relative">
        <Image
          src="/more.png"
          alt=""
          width={16}
          height={16}
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
        />
        {open && (
          <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
            <Link href={`/post/${postId}`}>
              <span className="cursor-pointer">Edit</span>
            </Link>
            <span className="cursor-pointer">Re-post</span>
            <form action={deletePostWithId}>
              <button className="text-red-500">Delete</button>
            </form>
          </div>
        )}
    </div>
  )
};