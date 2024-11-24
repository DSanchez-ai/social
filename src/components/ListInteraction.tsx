"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";

import { deleteList } from "@/lib/actions";
import { List } from "@prisma/client";

export const ListInteraction = ({listId}:{listId: string}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();
    
  
  const handleDelete = async (id: string) => {
    setLoadingId(id);

    try {
      await deleteList(id);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => handleDelete(listId)}>
        <Trash2 
          size={16}
          className={`cursor-pointer text-red-500 ${loadingId === listId ? 'animate-spin' : ''}`}
        />
      </button>
  </div>
  )
}