import { AddEvent } from "@/components/AddEvent";
import { Event } from "@/components/Event";
import { Followers } from "@/components/Followers";
import { Following } from "@/components/Following";
import { FriendRequests } from "@/components/FriendRequests";
import { LeftMenu } from "@/components/LeftMenu";
import Pagination from "@/components/Pagination";
import { ProfileCard } from "@/components/ProfileCard";
import { RightMenu } from "@/components/RightMenu";
import { Stories } from "@/components/Stories";
import prisma from "@/lib/client";

const numberOfItems = 5;

async function getData(searchParams: string) {
  const [count, data] = await prisma.$transaction([
    prisma.event.count(),
    prisma.event.findMany({
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

export default function EventsPage({
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
          <AddEvent />
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
      {data.length ? (data.map(event=>(
        <Event key={event.id} event={event}/>
      ))) : <span className="text-sm">No events found!</span>}
      <Pagination totalPages={Math.ceil(count / numberOfItems)}/>  
    </>
  )
}