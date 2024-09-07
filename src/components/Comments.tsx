import prisma from "@/lib/client";
import { CommentList } from "./CommentList";

export const Comments = async ({postId}:{postId:string}) => {

  const comments = await prisma.comment.findMany({
    where:{
      postId,
    },
    include:{
      user:true
    }
  })

  return (
    <div className="">
      {/* WRITE */}
      <CommentList comments={comments} postId={postId}/>
    </div>
  );
};