"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";
import { Post } from "@prisma/client";

import { updatePost } from "@/lib/actions";
import { EditPostButton } from "./EditPostButton";



export const EditPost = ({post}:{post: Post}) => {
  const [ img, setImg ] = useState<any>();
  const [ desc, setDesc ] = useState("");  
  const { userId: currentUserId } = useAuth();
  const router = useRouter();

  if (!currentUserId) return null;


  const handleUpdatePost = (formData: FormData) => {
    updatePost(formData, img?.secure_url, post);
    router.refresh();
  };

  return (
    <div>
      { /* USER */}
      {currentUserId === post.userId ? (
        <form 
          action={handleUpdatePost}
        >
        <CldUploadWidget 
          uploadPreset="slsocial" 
          onSuccess={(result, {widget}) => {
            if (result.info) {
              setImg(result.info);
            }
            widget.close();
          }}
          >      
          {({ open }) => { 
            return (  
              <div className="w-full relative">
                <Image 
                  onClick={() => open()}
                  src={post.img || img?.secure_url || "/noAvatar.png"}
                  alt=""
                  width={670}
                  height={670}
                  className="object-contain rounded-md cursor-pointer mb-2 hover:opacity-80"
                />
              </div> 
            )}}
          </CldUploadWidget>   
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
        <>
          <div className="w-full relative">
            <Image 
              onClick={() => open()}
              src={post.img || "/noAvatar.png"}
              alt=""
              width={650}
              height={650}
              className="object-contain rounded-md mb-2"
          />
         </div>           
          <p className="text-sm lg:text-normal xl:text-lg">
            {post.desc}
          </p>
      </>
      )}
    </div>
  )
};