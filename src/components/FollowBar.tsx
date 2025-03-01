import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { getUserInfoRandom } from '@/actions/user_action'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import FollowButton from './FollowButton'


async function FollowBar() {
  // get some user info 
    const randomUserInfo = await getUserInfoRandom()
    if (randomUserInfo?.length === 0) return null
  // return 
  return (
    <div>
        <Card className='flex flex-col p-6 space-y-4'>
            <CardTitle >
                <p className='pb-4'>Who to Follow</p>
            </CardTitle>
            <CardContent className='p-0 space-y-4'>
                {randomUserInfo?.map((userInfo) =>{
                    return (
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center justify-start gap-3' >
                                <Link href={`/profile/${userInfo.username}`}>
                                    <Avatar>
                                        <AvatarImage src={userInfo?.image || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <div>{userInfo.displayName}</div>
                                    <div className='text-muted-foreground text-sm'>{userInfo.username}</div>
                                    <div className='text-muted-foreground text-sm'>{userInfo._count.followers} followers</div>
                                </div>
                            </div>
                            <FollowButton followId={userInfo.id} />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    </div>
  )
}

export default FollowBar