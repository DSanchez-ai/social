import { AddPost } from "@/components/AddPost"
import { Feed } from "@/components/Feed"
import { Followers } from "@/components/Followers"
import { Following } from "@/components/Following"
import { FriendRequests } from "@/components/FriendRequests"
import { LeftMenu } from "@/components/LeftMenu"
import { ProfileCard } from "@/components/ProfileCard"
import { RightMenu } from "@/components/RightMenu"
import { Stories } from "@/components/Stories"

const Homepage = () => {

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
          <Feed />
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>          
    </div>
  )
}

export default Homepage