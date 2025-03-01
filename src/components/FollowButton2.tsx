"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import prisma from '@/lib/prisma'
import { getUserDbId } from '@/actions/user_action'
import { LoaderIcon } from 'lucide-react'
import { toggleFollow } from '@/actions/user_action'
import { revalidatePath } from 'next/cache'

function FollowButton2({followId, followState}:{followId:string, followState:boolean}) {
  const [isFollowing, setIsFollowing] = useState(false)
  //const [followState, setFollowState] = useState(false)
  const followPeople = async (followId:string) =>{
    setIsFollowing(true)
    try{
        const toggleFollowResult = await toggleFollow(followId)
        alert("operation successfully!")
    } catch(error){
        console.log("Failed to follow")
        alert("operation failed")
    } finally{
        setIsFollowing(false)
    }
  }

  return (
    <Button 
        onClick={() => followPeople(followId)}
        className="w-full py-6 mb-3"
        disabled={isFollowing}
    >
        {isFollowing? <LoaderIcon className='size-4 animate-spin'/>:
        followState? "Followed":"To follow"}
    </Button>
  )
}

export default FollowButton2