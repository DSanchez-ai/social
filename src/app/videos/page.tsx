import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { Suspense } from "react";
import { LeftMenu } from "@/components/LeftMenu";
import { Post } from "@/components/Post";
import { RightMenu } from "@/components/RightMenu";
import { UserInfoCard } from "@/components/UserInfoCard";
import { UserCard } from "@/components/UserCard";
import { ProfileCard } from "@/components/ProfileCard";

const VideosPage = async () => {
  const { userId: currentUserId } = auth();

  if(!currentUserId) {
    return null;
  }

  let posts: any[] = [];

  posts = await prisma.post.findMany({
    where: {
      video: {
        not: null
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      },
    },
  );

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
          <div className="flex flex-col gap-4">
          {posts.length ? (posts.map(post=>(
             <Post key={post.id} post={post}/>
            ))) : <span className="text-sm">No Videos found!</span>}
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

export default VideosPage;