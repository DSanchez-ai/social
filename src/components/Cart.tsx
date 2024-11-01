import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

import { CartItems } from "./CartItems";

export const Cart = async () => {
  const {userId: currentUserId} = auth();

  if(!currentUserId) return null;

  const items = await prisma.cart.findMany({
    where: {
      userId: currentUserId
    },
    include: {
      item: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if(items.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* CartItems */}
      <CartItems items={items} />
    </div>
  )
}