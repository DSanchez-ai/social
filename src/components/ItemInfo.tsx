"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { deleteItem } from "@/lib/actions";


export const ItemInfo = ({ itemId }: { itemId: string }) => {
  const [open, setOpen] = useState(false);

  const deleteItemtWithId = deleteItem.bind(null, itemId);

  return (
    <div className="relative">
        <Image
          src="/more.png"
          alt=""
          width={16}
          height={16}
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
        />
        {open && (
          <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
            <Link href={`/post/${itemId}`}>
              <span className="cursor-pointer">Edit</span>
            </Link>
            <form action={deleteItemtWithId}>
              <button className="text-red-500">Delete</button>
            </form>
          </div>
        )}
    </div>
  )
};