"use client";

import { useEffect, useOptimistic, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";

import { addComment, deleteComment } from "@/lib/actions";
import { Trash } from "lucide-react";


type CommentWithUser = Comment & { user: User };

export const CommentList = ({ 
  comments,
  postId,
 }: { 
  comments: CommentWithUser[];
  postId: string;
}) => {
  
  const { user } = useUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");
  
  const [isMounted, setIsMounted] = useState(false);

  const add = async () => {
    if (!user || !desc) return;
    
    addOptimisticComment({
      id: "",
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId,
      user: {
        id: user.id,
        userId: user.id,
        username: "Sending Please Wait...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      }
    });

    try {
      const createdComment = await addComment(desc, postId);
      setCommentState((prev) => [createdComment, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  )

  const handleDelete = async (id: string) => {
    setCommentState((prev) => prev.filter((comment) => comment.id !== id));
    try {
      await deleteComment(id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if(!isMounted) return null;
  
  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image 
            src={user.imageUrl || "/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form 
            action={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"  
          >
            <input 
              type="text" 
              placeholder="Write a comment..."
              onChange={(e) => setDesc(e.target.value)}
              className="bg-transparent outline-none flex-1"
            />
            <Image 
              src="/emoji.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer self-end"
            />
          </form>
        </div>
      )}
      <div>
        {optimisticComments.map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            <Image 
              src={comment.user.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-sm font-medium">
                {comment.user.name && comment.user.surname
                    ? comment.user.surname + " " + comment.user.name
                    : comment.user.username}
              </span>
              <p className="text-sm text-slate-700">
                {comment.desc}
              </p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-1">
                <div className="flex items-center gap-4">
                  <Image 
                    src="/like.png"
                    alt=""
                    width={16}
                    height={16}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{Math.floor(Math.random() * 100)} Likes</span>
                </div>
                <div>Reply</div>
                <div>
                  {user && user.id === comment.userId && (
                    <Trash 
                      size={16}
                      className="cursor-pointer"
                      onClick={() => handleDelete(comment.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}