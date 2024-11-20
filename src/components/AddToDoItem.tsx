"use client";

import Image from "next/image"
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AddPostButton } from "./AddPostButton";
import { addToDoItem} from "@/lib/actions";


export const AddToDoItem = ({listId}: {listId: string}) => {
  const { user, isLoaded } = useUser();
  const [ title, setTitle ] = useState("");

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
          action={(formData) => addToDoItem(formData, listId)}
          className="flex gap-4"
        >
          <textarea 
            name="title"
            id=""
            placeholder="Enter a title for your ToDo item"
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
      </div>      
    </div>
  )
}; 