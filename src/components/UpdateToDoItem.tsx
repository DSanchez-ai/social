"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3Icon } from "lucide-react";

import { updateToDoItem } from "@/lib/actions";
import { UpdateButton } from "./UpdateButton";
import { ToDoItem } from "@prisma/client";

export const UpdateToDoItem = ({item}: {item: ToDoItem}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.refresh();
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("id", item.id);
    formData.append("title", item.title);
    formData.append("desc", item.desc || "");
    formData.append("days", item.days.toString());

    try {
      await updateToDoItem(formData);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
      }
  }

  return (
    <div>
      <span 
        className="text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <button>
          <Edit3Icon
            size={16}
            className="w-5 h-5 cursor-pointer text-slate-500"
          />
        </button>        
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-slate-800 bg-opacity-65 flex flex-nowrap items-center justify-center z-50">
          <form 
            onSubmit={handleUpdate}
            className="p-12 bg-white rounded-lg shadow-md mt-44 flex flex-col gap-2 w-[90%] lg:w-[50%] xl:w-[30%] relative"
          >
            { /* TITLE */}
            <h1 className="text-normal md:text-xl">Update ToDo-Item</h1>
            { /* WRAPPER */}
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              {!item.done ? (
                  <span className="text-xs bg-blue-300 text-gray-800 p-1 rounded-md">
                    {new Date(new Date(item.createdAt).getTime() + item.days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
              ) : (
                <span className="text-xs text-white bg-green-600 rounded-md p-1">Done</span>
              )}              
              { /* INPUTS */}
              <div className="flex flex-col gap-2 w-full">
                <input 
                  type="hidden" 
                  defaultValue={item.id}
                  name="id"
                />
                <label htmlFor="" className="text-xs text-gray-600">Title</label>
                <input 
                  type="text" 
                  defaultValue={item.title || ""}
                  className="ring-1 ring-blue-400 p-[13px] rounded-md text-xs md:text-sm text-slate-800"
                  name="title" 
                />
                <label htmlFor="" className="text-xs text-gray-600">Description</label>
                <textarea 
                  defaultValue={item.desc || ""}
                  className="ring-1 ring-blue-400 p-[13px] rounded-md text-xs md:text-sm text-slate-800" 
                  rows={3}
                  name="desc"
                />
                { !item.done && (
                  <label htmlFor="" className="text-xs text-gray-600">Due in days after {new Date(item.createdAt).toLocaleDateString()}</label>
                )}
                { !item.done && (
                  <input 
                    defaultValue={item.days}
                    type="number"
                    className="ring-1 ring-blue-400 p-[13px] rounded-md text-xs md:text-sm text-slate-800"
                    name="days"
                    min={1}
                  />
                )}
              </div>
            </div>  
            <UpdateButton />  
            { /* CLOSE */}                                                              
            <div 
              className="absolute top-3 right-2 text-lg cursor-pointer"
              onClick={handleClose}
            >
              X
            </div>
          </form>
        </div>
      )}
    </div>
  )
};