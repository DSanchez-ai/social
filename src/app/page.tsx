import { AddPost } from "@/components/AddPost"
import { Followers } from "@/components/Followers"
import { Following } from "@/components/Following"
import { FriendRequests } from "@/components/FriendRequests"
import { LeftMenu } from "@/components/LeftMenu"
import Pagination from "@/components/Pagination"
import { Post } from "@/components/Post"
import { ProfileCard } from "@/components/ProfileCard"
import { RightMenu } from "@/components/RightMenu"
import { Stories } from "@/components/Stories"
import { UserCard } from "@/components/UserCard"
import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import { User } from "lucide-react"

const numberOfPosts = 5;

async function getData(searchParams: string) {
  const [count, data] = await prisma.$transaction([
  prisma.post.count(),
  prisma.post.findMany({
    take: numberOfPosts,
    skip: searchParams ? (Number(searchParams) -1) * numberOfPosts : 0,
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
  }) 
  ])
  return {count, data}
}

export default async function Homepage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { userId: currentUserId } = auth(); 

  if(!currentUserId) {
    return null;
  }
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
        <LeftMenu type="home" />
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
          <Stories />
          <AddPost />
          <ShowItems searchParams={searchParams} />
          </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>          
    </div>
  )
}

async function ShowItems({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const {count, data} = await getData(searchParams.page);

  return (
    <>
      {data.length ? (data.map(post=>(
        // @ts-ignore
        <Post key={post.id} post={post}/>
      ))) : <span className="text-sm">No posts found!</span>}
      <Pagination totalPages={Math.ceil(count / numberOfPosts)}/>  
    </>
  )
}

