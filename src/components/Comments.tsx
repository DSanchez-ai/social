import Image from "next/image";

export const Comments = () => {
  return (
    <div>
      { /* WRITE */}
      <div className="flex items-center gap-4">
        <Image 
          src="/Sarah.png"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full ring-2"
        />
        <div className="flex flex-1 items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
          <input 
            type="text"
            placeholder="Write a comment"
            className="bg-transparent outline-none flex-1"
          />
          <Image 
            src="/emoji.png"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 cursor-pointer self-end"
          />              
        </div>
      </div>
      { /* COMMENTS */}
      <div className="flex flex-row gap-4 mt-5">
        { /* COMMENT */}
        <div className=""></div>
          { /* AVATAR */}
          <Image 
            src="/leon.png"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full ring-2"
          />
          { /* DESC */}
          <div className="flex flex-col gap-2 flex-1 text-sm">
            <span className="font-medium">Leon</span>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid amet facere similique culpa provident illum sed aliquam, quisquam molestias ipsum.
            </p>
            <div className="flex gap-8 text-xs text-gray-500">
              <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
                <Image 
                  src="/like.png"
                  alt=""
                  width={16}
                  height={16}
                  className="cursor-pointer"
              />
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">68<span className="hidden md:inline">{' '}Likes</span></span>  
              </div>
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl cursor-pointer">
              <Image 
                src="/reply.png"
                alt=""
                width={16}
                height={16}
              />
              <span className="text-gray-500">reply</span>            
            </div>             
            </div>
          </div>
          { /* ICON */}
          <Image 
            src="/more.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer w-4 h-4"

          />                   
      </div>
    </div>
  )
};