"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Edit3Icon, Trash2 } from "lucide-react";

import { deleteToDoItem, toggleDone } from "@/lib/actions";

export const ToDoItemInteraction = ({itemId}:{itemId: string}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingToggleId, setLoadingToggleId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setLoadingId(id);

    try {
      await deleteToDoItem(id);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDone = async (id: string) => {
    setLoadingToggleId(id);

    try {
      await toggleDone(id);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingToggleId(null);
    }
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => handleDone(itemId)}>
        <Check size={16} className={`w-5 h-5 cursor-pointer text-green-600 ${loadingToggleId === itemId ? 'animate-spin' : ''}`} />
      </button>
      <button>
        <Edit3Icon
          size={16}
          className="w-5 h-5 cursor-pointer text-slate-500"
        />
      </button>
      <button onClick={() => handleDelete(itemId)}>
        <Trash2 
          size={16}
          className={`cursor-pointer text-red-500 ${loadingId === itemId ? 'animate-spin' : ''}`}
        />
      </button>
  </div>
  )
}