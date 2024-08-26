import Image from "next/image";
import Link from "next/link";

export const UserInfoCard = ({userId}: {userId:string}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      { /* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
        <Link href="/" className="text-blue-500 text-xs">See all</Link>
      </div>
      { /* BOTTOM */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-lg text-black">Leon Katczinski</span>
          <span className="text-sm">@leon</span>
        </div>
        <p>
          I am a web developer and designer. I love to build things that are both functional and beautiful.
        </p>
        <div className="flex items-center gap-2">
          <Image 
            src="/map.png"
            alt="city"
            width={16}
            height={16}
          />
          <span>Living in <b>New York</b></span>
        </div>
        <div className="flex items-center gap-2">
          <Image 
            src="/school.png"
            alt="school"
            width={16}
            height={16}
          />
          <span>Went to <b>Edgar High School</b></span>
        </div>
        <div className="flex items-center gap-2">
          <Image 
            src="/work.png"
            alt="work"
            width={16}
            height={16}
          />
          <span>Works as <b>Freelancer</b></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <Image 
              src="/link.png"
              alt=""
              width={16}
              height={16}
            />  
            <Link 
              href="https://leonsportfolio.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              leonkatczinski.com
            </Link>
          </div>
          <div className="flex gap-1 items-center">
            <Image 
              src="/date.png"
              alt=""
              width={16}
              height={16}
            />  
            <span>Joined in November <b>2023</b></span>
          </div>
        </div>
        <button className="bg-blue-500 text-white text-sm rounded-md p-2">Follow</button>
        <span className="text-red-400 self-end text-xs cursor-pointer">Block User</span>
      </div>
    </div>
  )
};