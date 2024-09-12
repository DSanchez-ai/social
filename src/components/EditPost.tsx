"use client";

import { updatePost } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { Post } from "@prisma/client";
import { useState } from "react";
import { AddPostButton } from "./AddPostButton";
import { EditPostButton } from "./EditPostButton";

export const EditPost = ({post}:{post: Post}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [ desc, setDesc ] = useState("");  
  const { userId: currentUserId } = useAuth();

  if (!currentUserId) return null;
  return (
    <div>
      { /* USER */}
      {currentUserId === post.userId ? (
        <form 
          action={(formData) => updatePost(formData, post)}
        >
          <p className="text-sm lg:text-normal xl:text-lg">
            <textarea
              name="desc"
              defaultValue={post.desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={10}
              className="w-full p-2 border rounded-md"
            />
          </p>
          <EditPostButton />
        </form>
      ) : (
        <p className="text-sm lg:text-normal xl:text-lg">
          {post.desc}
        </p>
      )}
    </div>
  )
};