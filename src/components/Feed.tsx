import { auth } from "@clerk/nextjs/server";
import { Post } from "./Post";
import prisma from "@/lib/client";
import { Span } from "next/dist/trace";

export const Feed = async ({username}:{username?: string}) => {
  const { userId: currentUserId } = auth();

  let posts: any[] = [];

  if(username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username
        }
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
      }
    });
  }

  if (!username && currentUserId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });
    const followingIds = following.map((f) => f.followingId);
    const ids = [currentUserId, ...followingIds];

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
      {posts.length ? (posts.map(post=>(
        <Post key={post.id} post={post}/>
      ))) : <span className="text-sm">No posts found!</span>}
    </div>
  )
};