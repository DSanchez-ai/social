"use client";
import { useOptimistic, useState } from "react";

import { switchBlock, switchFollow } from "@/lib/actions";


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
      switchOptimisticState("follow");
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

    const block = async () => {
      switchOptimisticState("block");
      try {
        await switchBlock(userId);
        setUserState((prevState) => ({
          ...prevState,
          blocked: !prevState.blocked,
        }));        
      } catch (error) {
        console.log(error);
      }
    };

    const [optimisticState, switchOptimisticState] = useOptimistic(
      userState,(state, value: "follow" | "block")=> 
        value === "follow" 
       ? {
          ...state,
          following: state.following && false,
          followingRequestSent: !state.following && !state.followingRequestSent ? true : false,
        }
      : {...state, blocked: !state.blocked},
    )
  return (
    <>
      <form action={follow}>
        <button className="w-full bg-blue-500 text-white text-sm rounded-md p-2">
          {optimisticState.following
           ? "Following"
           : optimisticState.followingRequestSent
           ? "Friend Request Sent"
           : "Follow"
          }
        </button>
      </form>
      <form action={block} className="self-end">
        <button>
          <span className="text-red-500 text-xs cursor-pointer">
            {optimisticState.blocked ? "Unblock User" : "Block User"}
          </span>
        </button>
      </form>
    </>
  )
};