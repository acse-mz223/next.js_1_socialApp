import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from 'react'
import { Separator } from "@radix-ui/react-separator"
import { Edit2Icon, LinkIcon, MapPinIcon } from "lucide-react"
import { checkFollowState, getLikedPostByUserId, getProfileByUsername, getProfilePosts } from "@/actions/profile_action"
import EditProfileButton from "@/components/EditProfileButton"
import { notFound } from "next/navigation"
import { getUserDbId } from "@/actions/user_action"
import FollowButton2 from "@/components/FollowButton2"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostCard from "@/components/PostCard"



// owner: whose profile this is 
// user: whose authentication this is 

async function profile({params}:{params: {name: string}}) {
  // get profile info
  const profileReuslt = await getProfileByUsername(params.name)
  if (!profileReuslt) {
    return notFound()
  }
  // get profile posts info 
  const profilePosts = await  getProfilePosts(profileReuslt.id)
  // get profile liked post info 
  const likedPosts = await getLikedPostByUserId(profileReuslt.id)
  // get owner follow state 
  const followState = await checkFollowState(profileReuslt.id)
  // get user info 
  const userId = await getUserDbId()
  // return 
  return (
    <div className="flex flex-col gap-5 items-center w-full">
      {/* profile basic info */}
      <Card className='px-3 w-2/3'>
        <CardHeader className='flex flex-col items-center'>
                <Avatar className='w-16 h-16 border-2'>
                    <AvatarImage src={profileReuslt.image || "https://github.com/shadcn.png"} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle className='text-center text-xl pt-2 font-semibold'>{profileReuslt.displayName}</CardTitle>
                <div className='text-sm text-muted-foreground'> {profileReuslt.username}</div>
        </CardHeader>
        <CardContent className="flex flex-col items-center ">
            <Separator />
            <div className='flex justify-between items-center py-4 w-full mb-4'>
                <div className='flex flex-col items-center justify-between'>
                    <p className="text-xl">{profileReuslt._count.following}</p>
                    <p className="text-md text-muted-foreground">Following</p>
                </div>
                <div className='flex flex-col items-center justify-between'>
                    <p className="text-xl">{profileReuslt._count.followers}</p>
                    <p className="text-md text-muted-foreground">Followers</p>
                </div>
                <div className='flex flex-col items-center justify-between'>
                    <p className="text-xl">{profileReuslt._count.posts}</p>
                    <p className="text-md text-muted-foreground">Posts</p>
                </div>                
            </div>
            {userId === profileReuslt.id? 
              <EditProfileButton userInfo={profileReuslt}/>:
              <FollowButton2 followId={profileReuslt.id} followState={followState}/>}
            <div className='flex flex-col justify-center items-start gap-2 pt-4 w-full'>
                <div className='flex items-center'>
                    <MapPinIcon className='w-7 h-7 pr-2'></MapPinIcon>
                    <p className='text-muted-foreground'>{profileReuslt.location || "No location"}</p>
                </div>
                <div className='flex items-center'>
                    <LinkIcon className='w-7 h-7 pr-2'></LinkIcon>
                    <p className='text-muted-foreground'>{
                      profileReuslt.webLink?
                      <Link href={profileReuslt.webLink.startsWith("http") ? profileReuslt.webLink : `https://${profileReuslt.webLink}`}> {profileReuslt.webLink} </Link>: 
                      "No weblink"}</p>
                </div>
            </div>
        </CardContent>
      </Card>
      {/* tabs => profile owner posts + likes */}
      <Tabs defaultValue="posts" className="w-5/6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="space-y-4 mt-4 w-full">
            {profilePosts.postdInfos.length !== 0?
              profilePosts.postdInfos.map((post) => <PostCard postInfo={post} userId={userId}/>):
              <div className="mt-10 text-center text-muted-foreground">No posts yet</div>}
          </div>
        </TabsContent>
        <TabsContent value="likes">
        <div className="space-y-4 mt-4 w-full">
            {likedPosts.post.length !== 0?
              likedPosts.post.map((post) => <PostCard postInfo={post} userId={userId}/>):
              <div className="mt-10 text-center text-muted-foreground">No posts yet</div>}
          </div>          
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default profile