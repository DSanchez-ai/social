import Image from "next/image"

export const Stories = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll scrollbar-hide text-xs">
      <div className="flex gap-8 w-max">
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image 
            src="/mara.png"
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Mara</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image 
            src="/leon.png"
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Leon</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image 
            src="/Sarah.png"
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Sarah</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image 
            src="/thailandbeach.png"
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Thailand</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image 
            src="/sidi.png"
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Julia</span>
        </div>  
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image 
            src="/Brenda.png"
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">Brenda</span>
        </div>                           
      </div>
    </div>
  )
}