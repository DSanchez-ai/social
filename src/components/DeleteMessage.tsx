"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { Message } from "@prisma/client";
import { deleteMessage, setMessageRead } from "@/lib/actions";
import Link from "next/link";

export const DeleteMessage = ({
  message,
}: {
  message: Message,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);  
  const router = useRouter();

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