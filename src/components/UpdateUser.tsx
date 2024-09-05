"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useActionState, useState } from "react";
import Image from "next/image";
import { User } from "@prisma/client";

import { updateProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";

export const UpdateUser = ({user}: {user: User}) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(false);
  
  const [state, formAction] = useActionState(updateProfile, {success:false, error:false});

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    state.success && router.refresh();
  };

  return (
    <div>
      <span 
        className="text-blue-500 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Edit
      </span>
      {open && (
        <div className="absolute h-[90vh] w-screen md:h-screen top-0 left-0 bg-slate-800 bg-opacity-65 flex items-center justify-center z-50">
          <form 
            action={(formData) => 
              formAction({formData, cover: cover?.secure_url || ""})
            }
            className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full lg:w-2/3 xl:w-1/2 relative"
          >
            { /* TITLE */}
            <h1 className="text-normal md:text-xl">Update Profile</h1>
            <div className="mt-1 text-xs text-slate-600">
              Use the navbar profile to change the avatar or username.
            </div>
            <CldUploadWidget uploadPreset="slsocial" onSuccess={(result) => setCover(result.info)}>
              {({ open }) => {
                return (
                  <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
                    <label htmlFor="">Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image 
                        src={user.cover || "/noCover.png"}
                        alt=""
                        width={48}
                        height={32}
                        className="w-12 h-8 rounded-md object-cover"
                      />
                      <span className="text-xs underline text-gray-600">Change</span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>            
            { /* WRAPPER */}
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              { /* INPUTS */}
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">First Name</label>
                <input 
                  type="text" 
                  defaultValue={user.surname ?? "John"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="surname" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">Last Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name || "Spencer"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">Description</label>
                <textarea 
                  defaultValue={user.description || "Life is a journey..."}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm" 
                  rows={4}
                  name="description"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">City</label>
                <input 
                  type="text" 
                  defaultValue={user.city || "New York"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm" 
                  name="city"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">School</label>
                <input 
                  type="text" 
                  defaultValue={user.school || "Harvard University"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="school"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">Work</label>
                <input 
                  type="text" 
                  defaultValue={user.work || "Software Engineer"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="work"
                />
              </div>
            </div>  
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-xs text-gray-600">Website</label>
                <input 
                  type="text" 
                  defaultValue={user.website || "https://www.example.com"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm" 
                  name="website"
                />
              </div>
            </div>  
            <button className="bg-blue-500 p-2 mt-2 rounded-md text-white">
              Update
            </button> 
            {state.success && (
              <div className="text-green-500 text-sm">
                Profile updated successfully.
              </div>
            )}  
            {state.error && (
              <div className="text-red-500 text-sm">
                Profile update failed.
              </div>
            )} 
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