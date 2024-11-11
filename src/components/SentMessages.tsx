import { User } from "@prisma/client";
import prisma from "@/lib/client";

export const SentMessages = async ({
  user,
  id
}: {user:User, id:string}) => {

  const messages = await prisma.message.findMany({
    where: {
      id,
      userId: user.userId
    },
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-1 text-sm flex flex-col gap-4">
      { /* BOTTOM */}
      <div className="flex gap-4 justify-between flex-wrap">
        {messages.length ? messages.map((message) => (
          <div key={message.id} className="relative w-full h-20 cursor-pointer">
            <div className="flex flex-col gap-2">
              <span className="text-bold text-sm xl:text-base">
                {message.title}
              </span>
              <span className="text-xs md:text-sm">
                {message.desc}
              </span>
            </div>
          </div>
        ))
        : <span className="text-gray-500 text-xs">No Messages</span>}
      </div>
    </div>
  )
};