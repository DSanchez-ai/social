import Image from "next/image";
import { Comments } from "./Comments";

export const Post = () => {
  return (
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src="/leon.png"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            Leon
          </span>
        </div>
        <Image 
          src="/more.png"
          alt=""
          width={16}
          height={16}
        />
      </div>
      { /* DESC */}
      <div className="flex flex-col gap-4">
        <div className="w-full min-h-96 relative">
          <Image 
            src="/nextconf.webp"
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-sm lg:text-normal xl:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt molestias tempore quod sequi ab laborum necessitatibus enim excepturi veritatis debitis. Asperiores quis et ratione pariatur voluptates magnam possimus, nesciunt error.
        </p>
      </div> 
      { /* INTERACTION */}
      <div className="flex items-center justify-between text-sm my-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
            <Image 
              src="/like.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">123<span className="hidden md:inline">{' '}Likes</span></span>            
          </div>
          <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
            <Image 
              src="/comment.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">44<span className="hidden md:inline">{' '}Comments</span></span>            
          </div>          
        </div>
        <div className="">
          <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
              <Image 
                src="/share.png"
                alt=""
                width={16}
                height={16}
                className="cursor-pointer"
              />
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">78<span className="hidden md:inline">{' '}Shares</span></span>            
            </div>          
        </div>        
      </div> 
      <Comments />          
    </div>
  )
};