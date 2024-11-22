import { EditStory } from "@/components/EditStory";
import { LeftMenu } from "@/components/LeftMenu";
import { ProfileCard } from "@/components/ProfileCard";
import { RightMenu } from "@/components/RightMenu";
import { Stories } from "@/components/Stories";
import { UserCard } from "@/components/UserCard";
import { UserInfoCard } from "@/components/UserInfoCard";
import { ViewStory } from "@/components/ViewStory";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { Story, User } from "@prisma/client";
import Image from "next/image";
import { Suspense } from "react";

const StoriesPage = async () => {
  const { userId: currentUserId } = auth();

  if(!currentUserId) {
    return null;
  }

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      userId: currentUserId 
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
          <div className="lg:hidden">
            <Suspense fallback={<div>Loading...</div>} >
              <UserInfoCard user={user} />
            </Suspense>      
          </div>
          <Stories />
          <div className="flex flex-col gap-4">
            {stories.map((story) => (
              <div key={story.id}>
                <ViewStory story={story as Story} user={story.user as User}/>
              </div>
            ))}
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

export default StoriesPage;