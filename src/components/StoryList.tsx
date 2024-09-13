"use client";

import { use, useEffect, useOptimistic, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { addStory } from "@/lib/actions";
import { set } from "zod";

type StoryWithUser = Story & {
  user: User;
};

export const StoryList = ({stories, userId}:{stories: StoryWithUser[], userId: string}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();

  const add = async () => {
    if(!img?.secure_url) return;

    addOptimisticStory({
      id: "",
      img: img.secure_url,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        userId: userId,
        username: "Sending...",
        avatar: user?.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },      
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory!, ...prev]);
      setImg(null);
    } catch (error) {
      
    }
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    stories,
    (state, value: StoryWithUser) => [value, ...state]
  )

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if(!isMounted) return null;

  return (
    <>
      <CldUploadWidget 
        uploadPreset="slsocial" 
        onSuccess={(result, {widget}) => {setImg(result.info); widget.close();}}
      >
        {({ open }) => {
          return (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer relative"
            >
              <Image 
                onClick={() => open()}
                src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
                alt=""
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2 object-fill"
              />
              {img ? (
                <form action={add}>
                  <button className="text-xs bg-blue-500 rounded-md text-white p-1">Send</button>
                </form>
              ) : (
                <span className="font-medium" onClick={() => open()}>Add a Story</span>
              )}
              <div className="absolute text-3xl text-gray-200 top-5" onClick={() => open()}>+</div>
            </div>    
          );
        }}
      </CldUploadWidget>     
      {optimisticStories.map((story) => (
        <div 
          key={story.id}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Image 
            src={story.img || story.user.avatar || "/noAvatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">{story.user.surname || story.user.username}</span>
        </div>      
      ))}
    </>
  )
};