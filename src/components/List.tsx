import { auth } from "@clerk/nextjs/server";
import { List as ListType, User } from "@prisma/client";
import  Link from "next/link";
import Image from "next/image";
import { ListInteraction } from "./ListInteraction";

type FeedListType = ListType & { user: User }

export const List = ({
  list
}: {
  list: FeedListType
}) => {
  const { userId: currentUserId } = auth();
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-40">
        <div className="flex flex-row justify-between items-center text-xs md:text-sm text-gray-800 bg-blue-200 p-2 rounded-t-md border border-blue-600">
          <span>{list.title}</span>
          <div className="flex flex-row">
            <ListInteraction listId={list.id} />
          </div>
        </div>
        {list.img && (
          <Link href={`/lists/view/${list.id}`} className="cursor-pointer hover:opacity-80">
            <Image 
              src={list.img || ""}
              alt=""
              width={200}
              height={200}
              className="object-cover w-full h-36 rounded-b-md border border-blue-600 shadow-md"
            />
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-2 w-40">
        <a 
          href={`/lists/edit/${list.id}`}
          className="text-sm text-blue-500 hover:underline mt-1"
        >
          {currentUserId === list.userId ? "Edit" : "View"}
        </a>
      </div> 
    </div>
  )
};