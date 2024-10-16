import { auth } from "@clerk/nextjs/server";
import { Project as ProjectType, User } from "@prisma/client";
import Image from "next/image";
import { PostDesc } from "./PostDesc";

type FeedProjectType = ProjectType & { user: User }

export const Project = ({
  project
}: {
  project: FeedProjectType
}) => {
  const { userId: currentUserId } = auth();
  return (
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={project.user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
          {project.user.name && project.user.surname
              ? project.user.surname + " " + project.user.name
              : project.user.username}
          </span>
        </div>
      </div>  
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
      { /* DESC */}
      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          {project.desc && <PostDesc desc={project.desc} />}
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
                  width={670}
                  height={670}
                  className="object-contain rounded-md"
                />
              )}
            </>
          )}
          <a 
            href={`/projects/${project.id}`}
            className="text-sm text-blue-500 hover:underline self-end mt-1"
          >
            {currentUserId === project.userId ? "Edit" : "View"}
          </a>
      </div>       
    </div>
  )
};