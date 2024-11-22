import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

import { List } from "@/components/List";
import { AddList } from "@/components/AddList";

import { LeftMenu } from "@/components/LeftMenu";
import Pagination from "@/components/Pagination";
import { RightMenu } from "@/components/RightMenu";
import { UserCard } from "@/components/UserCard";
import { ProfileCard } from "@/components/ProfileCard";

const numberOfItems = 6;
async function getData(searchParams: string) {
  const { userId: currentUserId } = auth();
  
  const [count, data] = await prisma.$transaction([
    prisma.list.count({
      where: {
        userId: currentUserId!
      }
    }),
    prisma.list.findMany({
      where: {
        userId: currentUserId!
      },
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

export default function ListsPage({
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
      <div className="w-full lg:w-[70%] xl:w-[50%] flex flex-col gap-6">
        <div className="xl:hidden">
          <ProfileCard />
        </div>
        <AddList />
        <div className="w-full">
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {data.length ? (data.map(list=>(
          <List key={list.id} list={list}/>
        ))) : <span className="text-sm">No lists found!</span>}
      </div>
      <div className="flex flex-col w-full col-span-2 mt-10">
        <Pagination totalPages={Math.ceil(count / numberOfItems)}/>
      </div>
    </>
  )
}