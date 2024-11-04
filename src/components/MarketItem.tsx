import { auth } from "@clerk/nextjs/server";
import { Item as ItemType, User } from "@prisma/client";
import Image from "next/image";
import { PostDesc } from "./PostDesc";
import { ItemInfo } from "./ItemInfo";

type FeedItemType = ItemType & { user: User }

export const MarketItem = ({
  item
}: {
  item: FeedItemType
}) => {
  const { userId: currentUserId } = auth();
  return (
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={item.user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
          {item.user.name && item.user.surname
              ? item.user.surname + " " + item.user.name
              : item.user.username}
          </span>
        </div>
        {currentUserId === item.userId && <ItemInfo itemId={item.id} />}        
      </div>  
      <div className="flex flex-col gap-4">
          <h2 className="text-sm md:text-lg xl:text-xl">{item.title}</h2>
          {item.url && (
            <a 
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {item.url}
            </a>
          )}
      </div>    
      { /* DESC */}
      <div className="flex flex-col gap-4">
        <div className="w-full relative">
          {item.desc && <PostDesc desc={item.desc} />}
        </div>
        { item.prize && (
          <a
            href={`/market/${item.id}`} 
            className="text-sm text-green-800 font-semibold bg-green-200 p-2 rounded-xl shadow-md w-[120px] cursor-pointer hover:bg-green-300 flex items-center justify-center"
          >
            Prize: ${item.prize.toFixed(2)}
          </a>
        )}
        <span></span>
        <div className="shadow-md rounded-md">
        { /* IMAGE / VIDEO */}        
          {item.video ? (
            <video
              controls
              loop
              preload="auto"
              playsInline
            >
              <source src={item.video} type="video/mp4" />
            </video>          
          ) : (
            <>
              {item.img && (
                <Image 
                  src={item.img || ""}
                  alt=""
                  width={670}
                  height={670}
                  className="object-contain rounded-md"
                />
              )}
            </>
          )}
        </div>
        <a 
          href={`/market/${item.id}`}
          className="text-sm text-blue-500 hover:underline self-end mt-1"
        >
          {currentUserId === item.userId ? "Edit" : "View"}
        </a>
      </div> 
      </div>
  )
};