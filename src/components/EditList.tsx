"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";

import { updateList } from "@/lib/actions";
import { EditPostButton } from "./EditPostButton";

export const EditList: React.FC<{ list: any }> = ({ list }) => {
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const [ img, setImg ] = useState<any>();  
  const [formData, setFormData] = useState({
    title: list.title || '',
    desc: list.desc || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  let url = "";
  if(!img?.secure_url) {
    url = list.img || "";
  } else {
    url = img.secure_url;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);

    updateList(formDataToSend, url, list.id);
    router.refresh();
  };

  return (
    <div>
      { /* USER */ }
      {currentUserId === list.userId ? (
        <form onSubmit={handleSubmit}>
        <CldUploadWidget 
          uploadPreset="slsocial" 
          onSuccess={(result, {widget}) => {
            if (result.info) {
              setImg(result.info);
            }
            widget.close();
          }}
          >      
          {({ open }) => { 
            return (  
              <div className="w-full relative">
                  <>
                    {url ? (
                      <Image 
                        onClick={() => open()}
                        src={url || ""}
                        alt=""
                        width={670}
                        height={670}
                        className="object-contain rounded-md cursor-pointer mb-2 hover:opacity-80"
                      />
                    ) : (
                      <span 
                        onClick={() => open()}
                        className="text-blue-500 text-xs hover:underline cursor-pointer"
                      >
                        Add Photo
                      </span>                      
                    )}
                  </>
              </div> 
            )}}
          </CldUploadWidget>             
          <p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-sm lg:text-base p-2 ring-1 ring-blue-400 rounded-md mb-1"
            />
          </p>

          <p className="text-sm lg:text-base">
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Enter the description"
              rows={10}
              className="w-full p-2 ring-1 ring-blue-400 rounded-md"
            />
          </p>
          { formData.title.length > 0 && (
            <EditPostButton />
          )}
        </form>
      ) : (
        <>
          <div className="w-full relative">
            {list.img && (
              <Image 
                src={list.img || ""}
                alt=""
                width={670}
                height={670}
                className="object-contain rounded-md cursor-pointer mb-2 hover:opacity-80"
              />
            )}
          </div>
          <p className="text-sm lg:text-base">{list.title}</p>
          <p className="text-sm lg:text-base">{list.desc}</p>
        </>
      )}
    </div>
  );
};

