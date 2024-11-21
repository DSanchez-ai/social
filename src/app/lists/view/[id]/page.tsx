import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"
import { AddToDoItem } from "@/components/AddToDoItem"
import { ToDoItemInteraction } from "@/components/ToDoItemInteraction"


const ListViewPage = async ({params}:{params:{id:string}}) => {
  const {userId: currentUser} = auth();
  if(!currentUser) return null

  const listId = params.id;

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
    },
  });

  if(!list) return null;

  const user = await prisma.user.findFirst({
    where: {
      userId: list.userId
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

  const items = await prisma.toDoItem.findMany({
    where: {
      listId: listId
    }
  });

  return (
    <div 
      className='flex gap-6 pt-6'
      >
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="home"/>
      </div>
      {/* CENTER */}
      <div 
        className="w-full lg:w-[70%] xl:w-[50%]"
        >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-32 md:h-64 relative">
              <Image 
                src={user.cover || "/noCover.png"}
                alt=""
                fill
                className=" bg-white rounded-md object-fill"
                />
              <Image 
                src={user.avatar || "/noAvatar.png"}
                alt=""
                width={128}
                height={128}
                className="w-32 h-32 rounded-full absolute left-0 right-0 mx-auto -bottom-16 object-fill ring-4 bg-slate-300 ring-white"
                />              
            </div>
            <h1 className="mt-20 mb-4 text-xl md:text-2xl font-medium">
              {(user.name && user.surname ? user.surname + " " + user.name : user.username)}
            </h1>
            <div className="flex items-center justify-center gap-12 mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followings}</span>
                <span className="text-sm">Followers</span>
              </div>              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followers}</span>
                <span className="text-sm">Following</span>
              </div>              
            </div>
          </div>
          <AddToDoItem listId={listId}/>
          <div 
            className="flex flex-col gap-2 bg-no-repeat bg-cover bg-center h-screen"
            style={{backgroundImage: `url(${list.img || "/noCover.png"})`}}
          >
            <div className="flex flex-col items-center w-full">
              <span 
                className="w-full text-center font-semibold text-sm text-gray-800 bg-blue-200 p-2 border border-blue-600 mb-5"
                >
                {list.title}
              </span>
              {list.desc && (
                <span className="w-full text-center text-sm text-white p-2 mb-5">
                  {list.desc}
                </span>
              )}
              {items && items.map((item) => (
                <div 
                  key={item.id}
                  className={`flex flex-col text-sm gap-1 w-[90%] lg:w-[70%] p-2 rounded-md m-1 shadow-md ${item.done ? ' bg-green-300' : ' bg-slate-200'}`}
                  >
                  <div className="w-[90%] lg:w-[70%] flex justify-start">
                    {!item.done ? (
                        <span className="text-xs bg-slate-400 text-white p-1 rounded-md">
                          {new Date(new Date(item.createdAt).getTime() + item.days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                    ) : (
                      <span className="text-xs text-white bg-green-600 rounded-md p-1">Done</span>
                    )}
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span>{item.title}</span>
                    <div className="flex flex-row ml-auto">
                      <ToDoItemInteraction itemId={item.id}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        {/*  <ShowProject project={list} user={user}/> */}
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  )
}

export default ListViewPage