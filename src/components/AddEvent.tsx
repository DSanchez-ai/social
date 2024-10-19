"use client";

import Image from "next/image"
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import { AddPostButton } from "./AddPostButton";
import { addEvent } from "@/lib/actions";
import Link from "next/link";


const Options = [
  {
    title: "Post",
    img: "/posts.png",
    url: "/",
  },
  {
    title: "Project",
    img: "/news.png",
    url: "/projects",
  },
]

export const AddEvent = () => {
  const { user, isLoaded } = useUser();
  const [ title, setTitle ] = useState("");
  const [ img, setImg ] = useState<any>();

  if(!isLoaded) {
    return "Loading...";
  }

  return (
    <div className="p-2 md:p-4 bg-white shadow-md rounded-lg flex gap-1 md:gap-4 justify-between text-sm">
      { /* AVATAR */}
      <Image 
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-fill rounded-full "
      />
      { /* POST */}
      <div className="flex-1">
        { /* TEXT INPUT */}
        <form 
          action={(formData) => addEvent(formData, img?.secure_url || "")}
          className="flex gap-4"
        >
          <textarea 
            name="title"
            id=""
            placeholder="Enter a title for your event"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            onChange={(e) => setTitle(e.target.value)}
          >
          </textarea>
          <div>
            <Image 
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end ml-2"
            />  
            { title.length > 0 && (
              <AddPostButton /> 
            )} 
          </div>
        </form>
        { /* Event OPTIONS */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-500">
        <CldUploadWidget 
          uploadPreset="slsocial" 
          onSuccess={(result, {widget}) => {setImg(result.info); widget.close();}}
        >
            {({ open }) => {
              return (
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <Image 
                  src="/addimage.png"
                  alt=""
                  width={20}
                  height={20}
                />
                Photo/Video
              </div>
              );
            }}
          </CldUploadWidget>  
          {Options.map((option, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image 
                src={option.img}
                alt=""
                width={20}
                height={20}
              />
              <Link href={option.url}>
                {option.title}
              </Link>
            </div>
          ))}
        </div>        
      </div>      
    </div>
  )
}; 