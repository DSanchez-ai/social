import { Suspense } from "react"
import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"
import { UserInfoCard } from "@/components/UserInfoCard"
import { ShowItem } from "@/components/ShowItem"
import { Cart } from "@/components/Cart"
import { User } from "lucide-react"
import { UserCard } from "@/components/UserCard"

const MarketIdPage = async ({params}:{params:{id:string}}) => {
  const {userId: currentUser} = auth();
  if(!currentUser) return null

  const itemId = params.id;

  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
    },
  });

  if(!item) return null;

  const user = await prisma.user.findFirst({
    where: {
      userId: item.userId
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
          <div className="">
            <UserCard user={user} />
          </div>
          <div className="lg:hidden mb-2">
            <Cart />
          </div>              
          <ShowItem item={item} user={user}/>
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <div className="mb-2">
          <Cart />
        </div>
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default MarketIdPage