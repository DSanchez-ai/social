"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Message } from "@prisma/client";
import { setMessageRead } from "@/lib/actions";

export const MessageStatus = ({message}: {message: Message}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);  
  const router = useRouter();

  const handleClick = async () => {
    setLoadingId(message.id);
    try {
      await setMessageRead(message.id);
      router.refresh();
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {message.read ? (
      <span className="text-blue-600 text-xs p-1 xl:p-2">read</span>
      ) : (
      <span 
        className={`text-green-600 bg-green-200 cursor-pointer rounded-md text-xs p-1 xl:p-2 ${loadingId === message.id ? "animate-pulse" : ""}`}
        onClick={handleClick}
        >
          new
        </span>
      )}      
    </div>
  )
};