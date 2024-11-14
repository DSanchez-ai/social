"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { Message } from "@prisma/client";
import { deleteMessage, setMessageRead } from "@/lib/actions";
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
      await setMessageRead(message.id, message.reply? false : true);
      router.refresh();
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await deleteMessage(id);
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
      {!message.reply && (
        <Link href={`/messages/reply/${message.id}`}>
          <button 
            className="text-slate-500 text-xs p-1 xl:p-2 hover:underline"
            onClick={() => setMessageRead(message.id, true)}
          >
            reply
          </button>
        </Link>
      )}
      <div className="flex justify-center items-center text-red-500 hover:text-red-800">
        <Trash2 
        size={16}
        className={`cursor-pointer ${loadingId === message.id ? 'animate-spin' : ''}`}
        onClick={() => handleDelete(message.id)}           
        />
      </div>              
    </div>
  )
};