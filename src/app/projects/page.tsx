import prisma from "@/lib/client";
import { Project } from "@/components/Project";

import { AddProject } from "@/components/AddProject";
import { Followers } from "@/components/Followers";
import { Following } from "@/components/Following";
import { FriendRequests } from "@/components/FriendRequests";
import { LeftMenu } from "@/components/LeftMenu";
import Pagination from "@/components/Pagination";
import { ProfileCard } from "@/components/ProfileCard";
import { RightMenu } from "@/components/RightMenu";
import { Stories } from "@/components/Stories";

const numberOfItems = 5;

async function getData(searchParams: string) {
  const [count, data] = await prisma.$transaction([
    prisma.project.count(),
    prisma.project.findMany({
      take: numberOfItems,
      skip: searchParams ? (Number(searchParams) -1) * numberOfItems : 0,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc"
      },      
    })
  ])
  return {count, data}
}

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {

  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="home" />
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="xl:hidden">
            <ProfileCard />
          </div>
          <div className="lg:hidden">
            <div className="mt-2">
              <FriendRequests />
            </div>
            <div className="mt-2">
              <Followers />
            </div>
            <div className="mt-2">
              <Following />
            </div>    
          </div>
          <Stories />
          <AddProject />
          <ShowItems searchParams={searchParams} />          
          </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>          
    </div>
  )
};

async function ShowItems({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const {count, data} = await getData(searchParams.page);

  return (
    <>
      {data.length ? (data.map(project=>(
        <Project key={project.id} project={project}/>
      ))) : <span className="text-sm">No projects found!</span>}
      <Pagination totalPages={Math.ceil(count / numberOfItems)}/>  
    </>
  )
}