"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";

import { updateProject } from "@/lib/actions";
import { EditPostButton } from "./EditPostButton";

export const EditProject: React.FC<{ project: any }> = ({ project }) => {
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const [ img, setImg ] = useState<any>();  
  const [formData, setFormData] = useState({
    title: project.title || '',
    desc: project.desc || '',
    url: project.url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    let url = "";
    if(!img?.secure_url) {
      url = project.video || project.img || "";
    } else {
      url = img.secure_url;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('url', formData.url);

    updateProject(formDataToSend, url, project);
    router.refresh();
  };

  return (
    <div>
      { /* USER */ }
      {currentUserId === project.userId ? (
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
                {project.video ? (
                  <div
                    className="w-full relative"
                  >
                    <video
                      controls
                      loop
                      preload="auto"
                      playsInline
                    >
                      <source src={project.video} type="video/mp4" />
                    </video>
                    <span 
                      onClick={() => open()}
                      className="text-blue-500 text-xs hover:underline cursor-pointer">Change</span>
                  </div>
                ) : (
                  <>
                    {project.img ? (
                      <Image 
                        onClick={() => open()}
                        src={project.img || ""}
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
                        Add Photo/Video
                      </span>                      
                    )}
                  </>
                )}
              </div> 
            )}}
          </CldUploadWidget>             
          <p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-sm lg:text-base p-2 border rounded-md mb-1"
            />
          </p>
          <p className="text-sm lg:text-base">
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://"
              className="w-full p-2 border text-blue-500 rounded-md mb-1"
            />
          </p>          
          <p className="text-sm lg:text-base">
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Enter the description"
              rows={10}
              className="w-full p-2 border rounded-md"
            />
          </p>
          { formData.title.length > 0 && (
            <EditPostButton />
          )}
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm md:text-lg xl:text-xl">{project.title}</h2>
              {project.url && (
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {project.url}
                </a>
              )}                                           
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full relative">
                {project.desc && (
                  <p>
                    {project.desc}
                  </p>
                ) }
              </div>  
              { /* IMAGE / VIDEO */}        
              {project.video ? (
                <video
                  controls
                  loop
                  preload="auto"
                  playsInline
                >
                  <source src={project.video} type="video/mp4" />
                </video>          
              ) : (
                <>
                  {project.img && (
                    <Image 
                      src={project.img || ""}
                      alt=""
                      width={650}
                      height={650}
                      className="object-contain rounded-md"
                    />
                  )}
                </>
              )}                          
            </div>
          </div>
        </>
      )}
    </div>
  );
};

