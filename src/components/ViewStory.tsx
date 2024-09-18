import { Story, User } from "@prisma/client";
import Image from "next/image";
import { ShowStory } from "./ShowStory";

type StoryType = {
  story: Story;
  user: User;
};

export const ViewStory = ({
  story,
  user,
}: StoryType) => {
   return (
    <div className="flex flex-col gap-4">
      { /* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image 
            src={user.avatar || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
          {user.name && user.surname
              ? user.surname + " " + user.name
              : user.username}
          </span>
        </div>
      </div>
      { /* DESC */}
      <div className="flex flex-col gap-4">
        <ShowStory story={story} />
      </div> 
    </div>
  )
};