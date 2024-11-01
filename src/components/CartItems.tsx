"use client";

import { useState } from "react";
import Image from "next/image";

import { Cart, Item } from "@prisma/client";
import { Trash } from "lucide-react";

import { deleteCartItem } from "@/lib/actions";
import { useRouter } from "next/navigation";


export type CartWithItems = Cart & {
  item: Item;
};

export const CartItems = ({items}: {items: CartWithItems[]}) => {
  const [showAll, setShowAll] = useState(false);
  const [itemsState, setItemsState] = useState(items);
  const router = useRouter();

  if(items.length === 0) return null;

  const displayedRequests = showAll ? items : items.slice(0, 3);

  const handleDelete = async (id: string) => {
    setItemsState((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteCartItem(id);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 bg-white text-sm flex flex-col gap-2">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Cart</span>
        <span 
          className="text-blue-500 text-xs cursor-pointer"
          onClick={() => setShowAll(!showAll)}
        >
          See all
        </span>
      </div>
      {displayedRequests.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4 mb-1">
            <Image
              src={request.item.img || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-fill"
            />
            <span className="text-xs xl:text-sm truncate">
              {request.item.title}
            </span>
          </div>
        <div className="flex gap-2 justify-end text-xs xl:text-sm">
          {request.prize && (
            <a
              className="text-green-600 font-semibold text-xs p-1 xl:p-2 rounded-md"
            >
              ${(request.prize * request.quantity).toFixed(2)}
            </a>
          )}
          <div className="flex justify-center items-center text-red-500">
           <Trash 
            size={16}
            className="cursor-pointer"
            onClick={() => handleDelete(request.id)}           
           />
          </div>
        </div>
        </div>
      ))}      
    </div>
  )
};