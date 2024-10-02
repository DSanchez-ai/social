"use client";

import Image from "next/image";
import { useState } from "react";

export const PostDesc = ({ desc }: { desc: string }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      {showAll ? (
        <p className="text-sm text-pretty font-light lg:text-base mb-4">
          {desc}
        </p>
      ) : (
        <p className="text-sm text-pretty font-light lg:text-base mb-4 line-clamp-2">
          {desc}
        </p>
      )}
      <Image 
        src="/more.png"
        alt=""
        width={16}
        height={16}
        onClick={() => setShowAll((prev) => !prev)}
        className="cursor-pointer"
      />
    </div>
  )
};