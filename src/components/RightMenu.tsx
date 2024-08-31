import { Suspense } from "react"
import { User } from "@prisma/client"
import { Ad } from "./Ad"
import { Birthdays } from "./Birthdays"
import { FriendRequests } from "./FriendRequests"
import { UserInfoCard } from "./UserInfoCard"
import { UserMediaCard } from "./UserMediaCard"

export const RightMenu = ({ user }:{ user?:User }) => {
  return (
    <div className="flex flex-col gap-6">
      {user ? (
      <>
        <Suspense fallback={<div>Loading...</div>} >
          <UserInfoCard user={user} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>} >
          <UserMediaCard user={user} />
        </Suspense>
      </>
      ) : null}
      <FriendRequests />
      <Birthdays />
      <Ad size="lg"/>
    </div>
  )
}