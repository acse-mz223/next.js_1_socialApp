import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './ui/button'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import prisma from '@/lib/prisma'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { LinkIcon, MapPinIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { getUserInfoByClerkId } from '@/actions/user_action'

  

async function SideBar() {
  // user info from clerk
  const user = await currentUser()
  if (user){
    // usder info from db
    const userInfo = await getUserInfoByClerkId(user.id)
    // console.log(userInfo)
    return (
        <Card className='px-3'>
        <CardHeader className='flex flex-col items-center'>
                <Avatar className='w-16 h-16 border-2'>
                    <AvatarImage src={userInfo?.image || "https://github.com/shadcn.png"} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle className='text-center text-xl pt-2 font-semibold'>{userInfo?.displayName}</CardTitle>
                <div className='text-sm text-muted-foreground'> {userInfo?.username}</div>
        </CardHeader>
        <CardContent >
            <Separator />
            <div className='flex justify-between items-center py-4'>
                <div className='flex flex-col items-center justify-between'>
                    <p className="text-xl">{userInfo?._count.following}</p>
                    <p className="text-md text-muted-foreground">Following</p>
                </div>
                <div className='flex flex-col items-center justify-between'>
                    <p className="text-xl">{userInfo?._count.followers}</p>
                    <p className="text-md text-muted-foreground">Followers</p>
                </div>
            </div>
            <Separator />
            <div className='flex flex-col justify-center items-start gap-2 pt-4'>
                <div className='flex items-center'>
                    <MapPinIcon className='w-7 h-7 pr-2'></MapPinIcon>
                    <p className='text-muted-foreground'>{userInfo?.location || "No location"}</p>
                </div>
                <div className='flex items-center'>
                    <LinkIcon className='w-7 h-7 pr-2'></LinkIcon>
                    <p className='text-muted-foreground'>{userInfo?.webLink || "No weblink"}</p>
                </div>
            </div>
        </CardContent>
    </Card>
    )
  } else {
    return (
        <Card >
            <CardHeader>
                <CardTitle className='text-center text-xl pb-3'>Welcome Back!</CardTitle>
                <CardDescription  className=' text-center'>Login to access your profile and connect with others.</CardDescription>
            </CardHeader>
            <CardContent >
                <SignInButton mode='modal'>
                    <Button className='w-full mb-2'>
                        Sign In
                    </Button>
                </SignInButton>
                <SignUpButton mode='modal'>
                    <Button className='w-full'>
                        Sign up
                    </Button>
                </SignUpButton>
            </CardContent>
        </Card>
    )
  }
  

  

}

export default SideBar