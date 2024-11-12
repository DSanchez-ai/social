"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { Message } from "@prisma/client";
import { setMessageRead } from "@/lib/actions";
import Link from "next/link";

export const MessageStatus = ({
  message,
  username,
}: {
  message: Message,
  username: string,
}) => {
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
    <div className="flex gap-2 justify-end items-center text-xs xl:text-sm">
      {message.read ? (
      <span className="text-blue-600 text-xs p-1 xl:p-2">
        <CheckCheck size={16} />
      </span>
      ) : (
      <span 
        className={`text-green-600 bg-green-200 cursor-pointer rounded-md text-xs p-1 xl:p-2 ${loadingId === message.id ? "animate-pulse" : ""}`}
        onClick={handleClick}
        >
          new
        </span>
      )}
      <Link href={`/messages/create/${username}`}>
        <button 
          className="text-slate-500 text-xs p-1 xl:p-2 hover:underline"
          onClick={handleClick}
        >
          reply
        </button>
      </Link>           
    </div>
  )
};