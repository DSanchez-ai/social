"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Post, Story, Event, Project } from "@prisma/client";

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId} = auth();

  if(!currentUserId) {
    throw new Error("User is not authenticated");
  }

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId
      }
    });

    if(existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id
        }
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId
        }
      });

      if(existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id
          }
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to switch follow status");
  }
};

export const deleteComment = async (commentId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
        userId,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if(!currentUserId) {
    throw new Error("User is not authenticated");
  }

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId
      }
    });

    if(existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id
        }
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId
        }
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to switch block status");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (
  prevState:{success:boolean, error:boolean}, 
  payload: {formData: FormData, cover:string}
) => {

/*   const name = formData.get("name") as string;
  const surname = formData.get("surname") as string;
  const city = formData.get("city") as string;
  const description = formData.get("description") as string;
  const school = formData.get("school") as string;
  const work = formData.get("work") as string;
  const website = formData.get("website") as string; */

  const { formData, cover } = payload;
  const fields = Object.fromEntries(formData);

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== "")
  );

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = cover !== '' ? Profile.safeParse({ cover, ...filteredFields }) : Profile.safeParse(filteredFields);

  if(!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true}
  }

  const { userId } = auth();

  if (!userId) {
    return { success: false, error: true };
  }

  try {
    await prisma.user.update({
      where: {
        userId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addComment = async (desc: string, postId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });

    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const desc = formData.get("desc") as string;
  const Desc = z.string().min(1).max(255);

  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log(validatedDesc.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  try {
    const isVideoUrl = (url: string) => {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg'];
      return videoExtensions.some(extension => url.endsWith(extension));
    };

    const isImageUrl = (url: string) => {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return imageExtensions.some(extension => url.endsWith(extension));
    };

    const createdPost = await prisma.post.create({
      data: {
        desc: validatedDesc.data,
        userId,
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });
    revalidatePath("/")
    
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updatePost = async (formData: FormData, img: string, post: Post) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const desc = formData.get("desc") as string;
  const Desc = z.string().min(1).max(1024);

  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log(validatedDesc.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(extension => url.endsWith(extension));
  };

  const isImageUrl = (url: string) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(extension => url.endsWith(extension));
  };

  try {

    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        desc: validatedDesc.data,
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });
    revalidatePath(`/post/${post.id}`)
    
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }

    // Delete all expired stories
    await prisma.story.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    const isVideoUrl = (url: string) => {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg'];
      return videoExtensions.some(extension => url.endsWith(extension));
    };
  
    const isImageUrl = (url: string) => {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return imageExtensions.some(extension => url.endsWith(extension));
    };

    const createdStory = await prisma.story.create({
      data: {
        userId,
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
        desc: "",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });
    revalidatePath("/")
    return createdStory;
  } catch (err) {
    console.log(err);
  }
};

export const UpdateStory = async (formData: FormData, img: string, story: Story) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const desc = formData.get("desc") as string;
  const Desc = z.string().max(1024);

  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log(validatedDesc.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(extension => url.endsWith(extension));
  };

  const isImageUrl = (url: string) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(extension => url.endsWith(extension));
  };

  try {
    const updatedStory = await prisma.story.update({
      where: {
        id: story.id,
      },
      data: {
        desc: validatedDesc.data,
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });

    // Delete all expired stories
    await prisma.story.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
        
    revalidatePath("/")
    return updatedStory;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const deletePost = async (postId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath("/")
  } catch (err) {
    console.log(err);
  }
};

export const addEvent = async (formData: FormData, img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const title = formData.get("title") as string;
  const Title = z.string().min(1).max(255);

  const validatedTitle = Title.safeParse(title);

  if (!validatedTitle.success) {
    console.log(validatedTitle.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  try {
    // Check if the URL is a video or image
    const isVideoUrl = (url: string) => {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg'];
      return videoExtensions.some(extension => url.endsWith(extension));
    };

    const isImageUrl = (url: string) => {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return imageExtensions.some(extension => url.endsWith(extension));
    };

    // Delete all events with endDates in the past
    await prisma.event.deleteMany({
      where: {
        endDate: {
          lt: new Date(),
        },
      },
    });

    const createdEvent = await prisma.event.create({
      data: {
        title: validatedTitle.data,
        userId,
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });
    revalidatePath("/")
    
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateEvent = async (formData: FormData, img: string, event: Event) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const title = formData.get("title") as string;
  const Title = z.string().min(1).max(255);

  const validatedTitle = Title.safeParse(title);

  if (!validatedTitle.success) {
    console.log(validatedTitle.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  const location = formData.get("location") as string;
  const Location = z.string().max(30);
  const validatedLocation = Location.safeParse(location);

  const url = formData.get("url") as string;
  const Url = z.string().max(100);
  const validatedUrl = Url.safeParse(url);

  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  
  const desc = formData.get("desc") as string;
  const Desc = z.string().max(1024);

  const validatedDesc = Desc.safeParse(desc);

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(extension => url.endsWith(extension));
  };

  const isImageUrl = (url: string) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(extension => url.endsWith(extension));
  };

  try {
    // Delete all events with endDates in the past
    await prisma.event.deleteMany({
      where: {
        endDate: {
          lt: new Date(),
        },
      },
    });    

    const updatedEvent = await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        title: validatedTitle.data,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        desc: validatedDesc.data || "",
        location: validatedLocation.data || "",
        url: validatedUrl.data || "",
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });
    revalidatePath(`/events/${event.id}`)
    
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addProject = async (formData: FormData, img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const title = formData.get("title") as string;
  const Title = z.string().min(1).max(255);

  const validatedTitle = Title.safeParse(title);

  if (!validatedTitle.success) {
    console.log(validatedTitle.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  try {
    // Check if the URL is a video or image
    const isVideoUrl = (url: string) => {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.webm', '.ogg'];
      return videoExtensions.some(extension => url.endsWith(extension));
    };

    const isImageUrl = (url: string) => {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      return imageExtensions.some(extension => url.endsWith(extension));
    };

    const createdProject = await prisma.project.create({
      data: {
        title: validatedTitle.data,
        userId,
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });
    revalidatePath("/")
    
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProject = async (formData: FormData, img: string, project: Project) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  const title = formData.get("title") as string;
  const Title = z.string().min(1).max(255);

  const validatedTitle = Title.safeParse(title);

  if (!validatedTitle.success) {
    console.log(validatedTitle.error.flatten().fieldErrors);
    throw new Error("Invalid description");
  }

  const url = formData.get("url") as string;
  const Url = z.string().max(100);
  const validatedUrl = Url.safeParse(url);
 
  const desc = formData.get("desc") as string;
  const Desc = z.string().max(1024);

  const validatedDesc = Desc.safeParse(desc);

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(extension => url.endsWith(extension));
  };

  const isImageUrl = (url: string) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(extension => url.endsWith(extension));
  };

  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        title: validatedTitle.data,
        desc: validatedDesc.data || "",
        url: validatedUrl.data || "",
        img: isImageUrl(img) ? img : null,
        video: isVideoUrl(img) ? img : null,
      },
    });
    revalidatePath(`/projects/${project.id}`)
    
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};