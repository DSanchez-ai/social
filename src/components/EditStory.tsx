"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";
import { Story } from "@prisma/client";

import { UpdateStory } from "@/lib/actions";
import { EditPostButton } from "./EditPostButton";

export const EditStory = ({story}:{story: Story}) => {
  const [ img, setImg ] = useState<any>();
  const [ desc, setDesc ] = useState("");  
  const { userId: currentUserId } = useAuth();
  const router = useRouter();

  if (!currentUserId) return null;


  const handleUpdatePost = (formData: FormData) => {
    UpdateStory(formData, img?.secure_url, story);
    router.refresh();
  };

  return (
    <div>
      { /* USER */}
      {currentUserId === story.userId ? (
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
                  src={story.img || img?.secure_url || "/noAvatar.png"}
                  alt=""
                  width={670}
                  height={670}
                  className="object-contain rounded-md cursor-pointer mb-2 hover:opacity-80"
                />
              </div> 
            )}}
          </CldUploadWidget>   
          <p className="text-sm text-pretty font-light lg:text-base">
            <textarea
              name="desc"
              defaultValue={story.desc!}
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
            <p className="text-sm text-pretty font-light lg:text-base mb-4">
              {story.desc}
            </p>
            <Image 
              onClick={() => open()}
              src={story.img || "/noAvatar.png"}
              alt=""
              width={670}
              height={670}
              className="object-contain rounded-md mb-2"
          />
         </div>           
      </>
      )}
    </div>
  )
};