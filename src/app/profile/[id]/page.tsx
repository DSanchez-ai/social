import { Feed } from "@/components/Feed"
import { LeftMenu } from "@/components/LeftMenu"
import { RightMenu } from "@/components/RightMenu"

const ProfilePage = () => {
  return (
    <div className='flex gap-6 pt-6'>
      {/* LEFT SIDE */}
      <div className="hidden xl:block xl:w-[20%]">
        <LeftMenu type="profile"/>
      </div>
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <Feed />
        </div>
      </div>  
      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu userId="test"/>
      </div>          
    </div>
  )
}

export default ProfilePage