"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Story } from "@prisma/client";

export const ShowStory = ({story}:{story: Story}) => {
  const { userId: currentUserId } = useAuth();

  if (!currentUserId) return null;

  return (
    <div>
      { /* STORIES */}
      <div className="flex flex-col gap-4">
      { /* DESC */}
        <div className="w-full relative">
          <p className="text-sm text-pretty italic font-light lg:text-base mb-4">
            {story.desc}
          </p>
        </div>        
        { /* IMAGE / VIDEO */}        
        <div className="w-full relative">
          {story.video ? (
            <video
              controls
              loop
              preload="auto"
              playsInline
            >
              <source src={story.video} type="video/mp4" />
            </video>          
          ) : (
            <>
              {story.img && (
                <Image 
                  src={story.img || ""}
                  alt=""
                  width={670}
                  height={670}
                  className="object-contain rounded-md mb-2"
                />
              )}
            </>
          )}          
        </div>           
        <a 
          href={`/stories/${story.id}`}
          className="text-sm text-blue-500 hover:underline self-end"  
        >
            {currentUserId === story.userId && "Edit"}
          </a>
      </div>
    </div>
  )
};