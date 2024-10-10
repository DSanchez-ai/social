"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Event, User } from "@prisma/client";
import { formatDateTime } from "@/lib/utils";
import { PostDesc } from "./PostDesc";

export const ShowEvent = ({
  event, 
  user}:{
    event: Event
    user: User
  }) => {
  const { userId: currentUserId } = useAuth();

  if (!currentUserId) return null;

  return (
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
          {user.name && user.surname
              ? user.surname + " " + user.name
              : user.username}
          </span>
        </div>
      </div>  
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
      { /* DESC */}
      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          {event.desc && (
            <p>
              {event.desc}
            </p>
          )}
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
          <a 
            href={`/events/${event.id}`}
            className="text-sm text-blue-500 hover:underline self-end mt-1"
          >
            {currentUserId === event.userId && "Edit"}
          </a>
      </div>       
    </div>
  )
};