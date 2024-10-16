"use client";

import Link from "next/link";
import { useState } from "react";


const MobileMenu = () => {

  const NavbarItems = [
    { title: "Home", url: "/" },
    { title: "Friends", url: "/friends" },
    { title: "Stories", url: "/stories" },
    { title: "Videos", url: "/videos" },
    { title: "Events", url: "/events" },
    { title: "Projects", url: "/projects" },
  ]
  
  const [isOpen, setIsOpen] = useState(false)
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  return (
    <div className="md:hidden">
      <div 
        className="flex flex-col gap-[4.5px] cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={`w-6 h-1 bg-blue-500 rounded-sm ${isOpen ? "rotate-45" : ""} origin-left ease-in-out duration-500`} />
        <div className={`w-6 h-1 bg-blue-500 rounded-sm ${isOpen ? "opacity-0" : ""} ease-in-out duration-500`} />
        <div className={`w-6 h-1 bg-blue-500 rounded-sm ${isOpen ? "-rotate-45" : ""} origin-left ease-in-out duration-500`} />    
      </div>
      {isOpen && (
        <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10">
          {NavbarItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.url}
              onClick={handleLinkClick}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MobileMenu