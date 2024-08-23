import Image from "next/image"

const Options = [
  {
    title: "Photo",
    img: "/addImage.png",
  },
  {
    title: "Video",
    img: "/addVideo.png",
  },
  {
    title: "Event",
    img: "/addEvent.png",
  },
  {
    title: "Poll",
    img: "/poll.png",
  },
]

export const AddPost = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
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
        <div className="flex flex-1 items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
          <textarea 
            name=""
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
        </div>
        { /* POST OPTIONS */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-400">
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