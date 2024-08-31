"use client";
import { useState } from "react";

import { switchFollow } from "@/lib/actions";


export const UserInfoCardInteraction = ({ 
  userId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
 }: { 
  userId: string,
  isUserBlocked: boolean,
  isFollowing: boolean,
  isFollowingSent: boolean,
  }) => {
    const [userState, setUserState] = useState({
      blocked: isUserBlocked,
      following: isFollowing,
      followingRequestSent: isFollowingSent,
    });

    const follow = async () => {
      try {
        await switchFollow(userId);
        setUserState((prevState) => ({
          ...prevState,
          following: prevState.following && false,
          followingRequestSent: !prevState.following && !prevState.followingRequestSent ? true : false,
        }));
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <>
      <form action={follow}>
        <button className="w-full bg-blue-500 text-white text-sm rounded-md p-2">
          {userState.following
           ? "Following"
           : userState.followingRequestSent
           ? "Friend Request Sent"
           : "Follow"
          }

        </button>
      </form>
      <form action="" className="self-end">
        <span className="text-red-500 text-xs cursor-pointer">
          {userState.blocked ? "Unblock User" : "Block User"}
        </span>
      </form>
    </>
  )
};