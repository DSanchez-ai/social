import Link from "next/link"
import MobileMenu from "./MobileMenu"
import Image from "next/image"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/client"

const Links = [
  {
    name: "Homepage",
    img: "/home.png",
    href: "/",
  },
  {
    name: "Friends",
    img: "/friends.png",
    href: "/friends",
  },
  {
    name: "Stories",
    img: "/stories.png",
    href: "/stories",
  },
  {
    name: "Videos",
    img: "/videos.png",
    href: "/videos",
  },
  {
    name: "Events",
    img: "/events.png",
    href: "/events",
  },
  {
    name: "Projects",
    img: "/news.png",
    href: "/projects",
  },
]

const Navbar = async () => {

  return (
    <div className="h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="md:hidden lg:block w-[20%]">
        <Link href="/" className="font-bold text-xl text-blue-600">
          SLSOCIAL
        </Link>
      </div>
      {/* CENTER */}
      <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
        {/* LINKS */}    
        <div className="flex gap-6 text-gray-600">
          {Links.map((link, index) => (
            <Link href={link.href} key={index} className="flex pt-1 pb-1 gap-2 items-center hover:bg-slate-100">
              <Image 
                src={link.img}
                alt={link.name}
                width={16}
                height={16}
                className="cursor-pointer w-4 h-4"
              />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />          
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <div className="hidden md:flex gap-4">
              <div className="cursor-pointer">
                <Image 
                  src="/people.png"
                  alt="People"
                  width={24}
                  height={24}
                />
              </div>
              <div className="cursor-pointer">
                <Image 
                  src="/messages.png"
                  alt="Messages"
                  width={20}
                  height={20}
                />
              </div>
              <div className="cursor-pointer">
                <Image 
                  src="/notifications.png"
                  alt="Notifications"
                  width={20}
                  height={20}
                />
              </div>  
            </div>
            <UserButton />                      
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image 
                  src="/login.png"
                  alt="Login"
                  width={20}
                  height={20}
                />  
              <Link href="/sign-in" className="text-xs md:text-sm">
                Login
              </Link>            
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>      
    </div>
  )
}

export default Navbar