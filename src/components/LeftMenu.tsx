import Image from "next/image";
import Link from "next/link";

import { MenuItems } from "../lib/Data";
import { ProfileCard } from "./ProfileCard"
import { Ad } from "./Ad";

export const LeftMenu = ({type}:{type: "home" | "profile"}) => {
  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}
      <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
        {MenuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-cventer gap-4 p-2 rounded-lg hover:bg-slate-100"
          >
            <Image 
              src={item.img}
              alt={item.name}
              width={20}
              height={20}
            />
            <span>{item.name}</span>
            <hr className="border-t-1 border-gray-50 w-36 self-center"/>
          </Link>
        ))}
      </div>
      <Ad size="sm" />
    </div>
  )
}