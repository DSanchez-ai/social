import { Suspense } from "react"
import { User } from "@prisma/client"
import { Ad } from "./Ad"
import { Birthdays } from "./Birthdays"
import { FriendRequests } from "./FriendRequests"
import { UserInfoCard } from "./UserInfoCard"
import { UserMediaCard } from "./UserMediaCard"
import { Followers } from "./Followers"
import { Following } from "./Following"
import { auth } from "@clerk/nextjs/server"

export const RightMenu = ({ user }:{ user?:User }) => {
  const {userId: currentUser} = auth();
  return (
    <div className="flex flex-col gap-4">
      {user ? (
      <>
        <Suspense fallback={<div>Loading...</div>} >
          <UserInfoCard user={user} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>} >
          <UserMediaCard user={user} />
        </Suspense>
      </>
      ) : (
        <>
          <FriendRequests />
          <Followers />
          <Following />
        </>        
      )}
      {currentUser === user?.userId ? (
        <>
          <FriendRequests />
          <Followers />
          <Following />
        </>
      ) : null}
      <Birthdays />
      <Ad size="lg"/>
    </div>
  )
}