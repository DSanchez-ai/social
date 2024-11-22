import { EditStory } from "@/components/EditStory";
import { LeftMenu } from "@/components/LeftMenu";
import { ProfileCard } from "@/components/ProfileCard";
import { RightMenu } from "@/components/RightMenu";
import { UserCard } from "@/components/UserCard";
import { UserInfoCard } from "@/components/UserInfoCard";
import { ViewStory } from "@/components/ViewStory";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { Story } from "@prisma/client";
import Image from "next/image";
import { Suspense } from "react";

const StoriesIdPage = async ({params}:{params: {id:string}}) => {
  const {userId: currentUser} = auth();
  if(!currentUser) return null

  const id = params.id;

  const story = await prisma.story.findFirst({
    where: {
      id,
    },
  });

  if(!story) return null;

  const user = await prisma.user.findFirst({
    where: {
      userId: story.userId
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true
        }
      }
    },
  });

  if(!user) return null;

  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="home"/>
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="hidden xl:block">
            <UserCard user={user} />
          </div>
          <div className="xl:hidden">
            <ProfileCard />
          </div>
          <div className="flex flex-col gap-4">
            <ViewStory story={story} user={user}/>
            { /* DESC */}
            <div className="flex flex-col gap-4">
              <EditStory story={story} user={user}/>
            </div> 
          </div>
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user}/>
      </div>          
    </div>
  );
};

export default StoriesIdPage;