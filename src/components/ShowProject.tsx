"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Project, User } from "@prisma/client";
import { EditProject } from "./EditProject";

export const ShowProject = ({
  project, 
  user}:{
    project: Project
    user: User
  }) => {
  const { userId: currentUserId } = useAuth();

  if (!currentUserId) return null;

  if(!project) return null;

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
      <EditProject project={project} />
    </div>
  )
};