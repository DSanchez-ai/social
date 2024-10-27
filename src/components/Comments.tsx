import prisma from "@/lib/client";
import { CommentList } from "./CommentList";

export async function Comments({
  postId,
  projectId,
}: {
  postId?: string;
  projectId?: string;
}) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId || undefined,
      projectId: projectId || undefined,
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="">
      {/* WRITE */}
      <CommentList comments={comments} postId={postId} projectId={projectId}/>
    </div>
  );
};