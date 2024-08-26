import Image from "next/image";
import Link from "next/link";

export const ProfileCard = ({userId}: {userId:string}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
      <div className="h-20 relative">
        <Image 
          src="/background.jpg"
          alt=""
          fill
          className="object-cover rounded-md"
        />
        <Image 
          src="/profile.png"
          alt=""
          width={48}
          height={48}
          className="rounded-full object-contain bg-blue-700 w-16 h-16 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
        />
      </div>
      <div className="h-20 flex flex-col gap-2 items-center mt-3">
        <span className="font-semibold">
          Leon Katczinski
        </span>
        <div className="flex items-center gap-4">
          <div className="flex">
            <Image 
              src="/Sarah.png"
              alt=""
              width={14}
              height={14}
              className="rounded-full object-cover w-4 h-4 mr-1"
            />
            <Image 
              src="/sidi.png"
              alt=""
              width={14}
              height={14}
              className="rounded-full object-cover w-4 h-4 mr-1"
            />
            <Image 
              src="/mara.png"
              alt=""
              width={14}
              height={14}
              className="rounded-full object-cover w-4 h-4"
            />                        
          </div>
          <span className="text-xs text-gray-500">500 Followers</span>
        </div>
        <Link href="/profile/123">
          <button className="bg-blue-500 text-white text-xs p-2 rounded-md">My Profile</button>
        </Link>
      </div>
    </div>
  )
};