"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Trash2, X } from "lucide-react";

import { deleteList } from "@/lib/actions";

export const ListInteraction = ({listId}:{listId: string}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isDelete) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isDelete]);
    
  
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
      <button onClick={() => {setIsDelete(true)}}>
        <Trash2 
          size={16}
          className={`cursor-pointer text-red-500 ${loadingId === listId ? 'animate-spin' : ''}`}
        />
      </button>
      {isDelete && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <p>Are you sure?</p>
            <button onClick={() => {handleDelete(listId)}}>
              <Check 
                size={16}
                className={`cursor-pointer text-green-500 ${loadingId === listId ? 'animate-spin' : ''}`}
              />
            </button>
            <button onClick={() => {setIsDelete(false)}}>
              <X 
                size={16}
                className={`cursor-pointer text-red-500 ${loadingId === listId ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      )}
  </div>
  )
}