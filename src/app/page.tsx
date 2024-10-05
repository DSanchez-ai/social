import { AddPost } from "@/components/AddPost"
import { Feed } from "@/components/Feed"
import { Followers } from "@/components/Followers"
import { Following } from "@/components/Following"
import { FriendRequests } from "@/components/FriendRequests"
import { LeftMenu } from "@/components/LeftMenu"
import Pagination from "@/components/Pagination"
import { Post } from "@/components/Post"
import { ProfileCard } from "@/components/ProfileCard"
import { RightMenu } from "@/components/RightMenu"
import { Stories } from "@/components/Stories"
import prisma from "@/lib/client"

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

export default function Homepage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="home" />
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="xl:hidden">
            <ProfileCard />
          </div>
          <div className="lg:hidden">
            <div className="mt-2">
              <FriendRequests />
            </div>
            <div className="mt-2">
              <Followers />
            </div>
            <div className="mt-2">
              <Following />
            </div>    
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

