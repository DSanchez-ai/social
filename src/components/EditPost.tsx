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
  const [ desc, setDesc ] = useState(post.desc);  
  const { userId: currentUserId } = useAuth();
  const router = useRouter();

  if (!currentUserId) return null;


  const handleUpdatePost = (formData: FormData) => {
    let url = "";
    if(!img?.secure_url) {
      url = post.video || post.img || "";
    } else {
      url = img.secure_url;
    }
    updatePost(formData, url, post);
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
                {post.video ? (
                  <div
                    className="w-full relative"
                  >
                    <video
                      controls
                      loop
                      preload="auto"
                      playsInline
                    >
                      <source src={post.video} type="video/mp4" />
                    </video>
                    <span 
                      onClick={() => open()}
                      className="text-blue-500 text-xs hover:underline cursor-pointer">Change</span>
                  </div>
                ) : (
                  <>
                    {post.img ? (
                      <Image 
                        onClick={() => open()}
                        src={post.img || ""}
                        alt=""
                        width={650}
                        height={650}
                        className="object-contain rounded-md cursor-pointer mb-2 hover:opacity-80"
                      />
                    ) : (
                      <span 
                        onClick={() => open()}
                        className="text-blue-500 text-xs hover:underline cursor-pointer"
                      >
                        Add Photo/Video
                      </span>                      
                    )}
                  </>
                )}
              </div> 
            )}}
          </CldUploadWidget>   
          <p className="text-sm lg:text-normal">
            <textarea
              name="desc"
              defaultValue={post.desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={10}
              className="w-full p-2 border rounded-md"
            />
          </p>
          {desc.length > 0 && (
            <EditPostButton />
          )}
        </form>
      ) : (
        <>
          <div className="w-full relative">
            <p className="text-sm text-pretty font-light lg:text-base mb-4">
              {post.desc}
            </p>
            {post.video ? (
              <video
                controls
                loop
                preload="auto"
                playsInline
              >
                <source src={post.video} type="video/mp4" />
              </video>          
            ) : (
              <Image 
                src={post.img || ""}
                alt=""
                width={670}
                height={670}
                className="object-contain rounded-md"
              />
            )}
         </div>           
      </>
      )}
    </div>
  )
};