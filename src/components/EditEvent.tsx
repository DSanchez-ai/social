"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";
import { TuiDatePicker } from 'nextjs-tui-date-picker';

import { updateEvent } from "@/lib/actions";
import { EditPostButton } from "./EditPostButton";
import { formatDateTime } from "@/lib/utils";

const isValidDate = (date: any) => {
  return !isNaN(Date.parse(date));
};

export const EditEvent: React.FC<{ event: any }> = ({ event }) => {
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const [ img, setImg ] = useState<any>();  
  const [formData, setFormData] = useState({
    title: event.title || '',
    startDate: isValidDate(event.startDate) ? new Date(event.startDate) : new Date(),
    endDate: isValidDate(event.endDate) ? new Date(event.endDate) : new Date(),
    desc: event.desc || '',
    url: event.url || '',
    location: event.location || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeStartDate = (date: Date) => {
    setFormData((prevData) => ({
      ...prevData,
      startDate: date,
      endDate: prevData.endDate < date ? date : prevData.endDate, // Ensure end date is not earlier than start date
    }));
  };

  const handleChangeEndDate = (date: Date) => {
    setFormData((prevData) => ({
      ...prevData,
      endDate: date,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    let url = "";
    if(!img?.secure_url) {
      url = event.video || event.img || "";
    } else {
      url = img.secure_url;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    
    // Ensure startDate is a valid Date object before formatting
    const startDate = new Date(formData.startDate);
    formDataToSend.append('startDate', isNaN(startDate.getTime()) ? '' : startDate.toISOString().split('T')[0]);

    // Ensure endDate is a valid Date object before formatting
    const endDate = new Date(formData.endDate);
    formDataToSend.append('endDate', isNaN(endDate.getTime()) ? '' : endDate.toISOString().split('T')[0]);

    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('url', formData.url);
    formDataToSend.append('location', formData.location);

    updateEvent(formDataToSend, url, event);
    router.refresh();
  };

  return (
    <div>
      { /* USER */ }
      {currentUserId === event.userId ? (
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
                {event.video ? (
                  <div
                    className="w-full relative"
                  >
                    <video
                      controls
                      loop
                      preload="auto"
                      playsInline
                    >
                      <source src={event.video} type="video/mp4" />
                    </video>
                    <span 
                      onClick={() => open()}
                      className="text-blue-500 text-xs hover:underline cursor-pointer">Change</span>
                  </div>
                ) : (
                  <>
                    {event.img ? (
                      <Image 
                        onClick={() => open()}
                        src={event.img || ""}
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
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the location"
              className="w-full p-2 border rounded-md mb-1"
            />
          </p>          
          <div className="flex flex-col lg:flex-row text-sm lg:text-base mb-1">
            <input
              type="hidden"
              name="startDate"
              value={formData.startDate instanceof Date ? formData.startDate.toISOString() : ''} // Format the date as YYYY-MM-DD
            />
            <div className="custom-datepicker flex flex-row items-center">
              <Image 
                src="/calendar.svg"
                alt="Calendar"
                width={20}
                height={20}
                className="ml-2"
              />
              <TuiDatePicker
                date={formData.startDate}
                handleChange={handleChangeStartDate}
                inputWidth={120}
                fontSize={14}
              />
            </div>
            <span className="hidden lg:flex mx-2 items-center justify-center">-</span>
            <input
              type="hidden"
              name="endDate"
              value={formData.endDate instanceof Date ? formData.endDate.toISOString() : ''} // Format the date as YYYY-MM-DD
            />
            <div className="custom-datepicker flex flex-row items-center">
            <Image 
                src="/calendar.svg"
                alt="Calendar"
                width={20}
                height={20}
                className="ml-2"
              />              
              <TuiDatePicker
                date={formData.endDate}
                handleChange={handleChangeEndDate}
                inputWidth={120}
                fontSize={14}
              />
            </div>
          </div>
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
          <p className="text-sm lg:text-base">
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://"
              className="w-full p-2 border rounded-md mb-1 text-blue-500"
            />
          </p>
          <EditPostButton />
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm md:text-lg xl:text-xl">{event.title}</h2>
              {event.location && (
                <div className="flex flex-row items-center gap-1">
                  <Image 
                    src="/location.svg"
                    alt="Location"
                    width={20}
                    height={20}
                  />
                  <span className="font-light">{event.location}</span>
                </div>
              )}
              {event.startDate && (
                <div className="font-light flex items-center flex-row text-sm md:text-lg">
                  <Image 
                    src="/calendar.svg"
                    alt="Calendar"
                    width={20}
                    height={20}
                    className="mr-1"
                  />            
                  <p className="mr-1">
                    {event.startDate && formatDateTime(event.startDate).dateOnly} - 
                  </p>
                  <p>
                    {event.endDate && formatDateTime(event.endDate).dateOnly}
                  </p>
                </div>
              )} 
              {event.url && (
                <a 
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {event.url}
                </a>
              )}                                           
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full relative">
                {event.desc && (
                  <p>
                    {event.desc}
                  </p>
                ) }
              </div>  
              { /* IMAGE / VIDEO */}        
              {event.video ? (
                <video
                  controls
                  loop
                  preload="auto"
                  playsInline
                >
                  <source src={event.video} type="video/mp4" />
                </video>          
              ) : (
                <>
                  {event.img && (
                    <Image 
                      src={event.img || ""}
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

