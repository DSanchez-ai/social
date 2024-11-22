import { Suspense } from "react"
import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"
import { UserInfoCard } from "@/components/UserInfoCard"
import { ShowEvent } from "@/components/ShowEvent"
import { ShowProject } from "@/components/ShowProject"
import { UserCard } from "@/components/UserCard"
import { ProfileCard } from "@/components/ProfileCard"

const ProjectIdPage = async ({params}:{params:{id:string}}) => {
  const {userId: currentUser} = auth();
  if(!currentUser) return null

  const projectId = params.id;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if(!project) return null;

  const user = await prisma.user.findFirst({
    where: {
      userId: project.userId
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          events: true,
          posts: true
        }
      }
    },
  });

  if(!user) return null;

  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="home"/>
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="hidden xl:block">
            <UserCard user={user} />
          </div>
          <div className="xl:hidden">
            <ProfileCard />
          </div>
          <ShowProject project={project} user={user}/>
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default ProjectIdPage