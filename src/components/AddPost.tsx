import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image"

const Options = [
  {
    title: "Photo",
    img: "/addimage.png",
  },
  {
    title: "Video",
    img: "/addVideo.png",
  },
  {
    title: "Event",
    img: "/addevent.png",
  },
  {
    title: "Poll",
    img: "/poll.png",
  },
]

export const AddPost = () => {

  const { userId } = auth();

  const testAction = async (formData:FormData) => {
    "use server";
    if(!userId) return;
    const desc = formData.get("desc") as string;
    try {
      const res = await prisma.post.create({
        data: {
          userId: userId,
          desc: desc,
        }
      })
      console.log(res);
    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <div className="p-2 md:p-4 bg-white shadow-md rounded-lg flex gap-2 md:gap-4 justify-between text-sm">
      { /* AVATAR */}
      <Image 
        src="/mara.png"
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full ring-2"
      />
      <div className=""></div>
      { /* POST */}
      <div className="flex-1">
        { /* TEXT INPUT */}
        <form 
          action={testAction}
          className="flex flex-1 items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
        >
          <textarea 
            name="desc"
            id=""
            placeholder="What's on your mind?"
            className="flex-1 bg-transparent outline-none rounded-lg"
          >

          </textarea>
          <Image 
            src="/emoji.png"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 cursor-pointer self-end ml-2"
          />   
          <button className="ml-3 w-20 bg-blue-500 text-white p-2 rounded-md">Send</button>       
        </form>
        { /* POST OPTIONS */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-500">
          {Options.map((option, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 cursor-pointer">
              <Image 
                src={option.img}
                alt=""
                width={20}
                height={20}
              />
              {option.title}
            </div>
          ))}
        </div>        
      </div>      
    </div>
  )
}; 