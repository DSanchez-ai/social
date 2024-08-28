import Image from "next/image";
import { Ads } from "../lib/Data";

const randomIndex = Math.floor(Math.random() * Ads.length);
const randomAd = Ads[randomIndex];

export const Ad = ({size}:{size: "sm" | "md" | "lg"}) => {
  return (
    <div 
      key={randomAd.id}
      className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* TOP */}
      <div className="flex justify-between items-center text-gray-500 font-medium">
        <span className="text-gray-500">Sponsered Ads</span>
        <Image 
          src="/more.png"
          alt=""
          width={16}
          height={16}
        />
      </div>
      { /* AD */}
      <div className={`flex flex-col mt-4 ${size === "sm" ? "gap-2" : "gap-4"}`}>
        <div className={`relative w-full ${size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"}`}>
          <Image 
            src={randomAd.img}
            alt=""
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-4">
          <Image 
              src={randomAd.img}
              alt=""
              width={24}
              height={24}
              className="rounded-full w-6 h-6 object-cover"
            />
            <span className="text-blue-500 font-medium">{randomAd.title}</span>
        </div>
        <p className={size === "sm" ? "text-xs" : "text-sm"}>
          {randomAd.desc}
        </p>
        <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">
          Learn more
        </button>
      </div>
    </div>
  )
};