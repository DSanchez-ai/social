"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Story } from "@prisma/client";

export const ShowStory = ({story}:{story: Story}) => {
  const { userId: currentUserId } = useAuth();
  const router = useRouter();

  if (!currentUserId) return null;

  return (
    <div>
      { /* STORIES */}
      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          <Image 
            onClick={() => router.push(`/stories/${story.id}`)}
            src={story.img || ""}
            alt=""
            width={650}
            height={650}
            className="object-contain rounded-md mb-2 cursor-pointer hover:opacity-80"
        />
        </div>           
        <p className="text-sm lg:text-normal xl:text-lg line-clamp-2">
          {story.desc}
        </p>
        <a 
          href={`/stories/${story.id}`}
          className="text-sm text-blue-500 hover:underline self-end"  
        >
            {currentUserId === story.userId ? "Edit" : "View"}
          </a>
      </div>
    </div>
  )
};