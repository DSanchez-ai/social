import prisma from "@/lib/client";

import { LeftMenu } from "@/components/LeftMenu";
import Pagination from "@/components/Pagination";
import { RightMenu } from "@/components/RightMenu";
import { AddItem } from "@/components/AddItem";
import { MarketItem } from "@/components/MarketItem";
import { Cart } from "@/components/Cart";

const numberOfItems = 5;

async function getData(searchParams: string) {
  const [count, data] = await prisma.$transaction([
    prisma.item.count(),
    prisma.item.findMany({
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

export default function MarketPage({
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
        <div className="lg:hidden mb-2">
          <Cart />
        </div>        
        <div className="flex flex-col gap-6">
          <AddItem />
          <ShowItems searchParams={searchParams} />          
          </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <div className="mb-2">
          <Cart />
        </div>
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
      {data.length ? (data.map(item=>(
        <MarketItem key={item.id} item={item}/>
      ))) : <span className="text-sm">No Marketitems found!</span>}
      <Pagination totalPages={Math.ceil(count / numberOfItems)}/>  
    </>
  )
}