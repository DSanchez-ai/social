import { Ad } from "./Ad"
import { Birthdays } from "./Birthdays"
import { FriendRequests } from "./FriendRequests"

export const RightMenu = ({ userId }:{ userId?:string }) => {
  return (
    <div className="flex flex-col gap-6">
      <FriendRequests />
      <Birthdays />
      <Ad size="lg"/>
    </div>
  )
}