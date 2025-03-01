"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import prisma from '@/lib/prisma'
import { getUserDbId } from '@/actions/user_action'
import { LoaderIcon } from 'lucide-react'
import { toggleFollow } from '@/actions/user_action'

function FollowButton({followId}:{followId:string}) {
  const [isFollowing, setIsFollowing] = useState(false)
//   const [followState, setFollowState] = useState(false)
  const followPeople = async (followId:string) =>{
    setIsFollowing(true)
    try{
        const toggleFollowResult = await toggleFollow(followId)
        // if (toggleFollowResult.success) {
        //     setFollowState((preValue) => !preValue)
        // }
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
        variant="secondary"
        onClick={() => followPeople(followId)}
        className='w-20'
        disabled={isFollowing}
    >
        {isFollowing? <LoaderIcon className='size-4 animate-spin'/>:"Follow"}
    </Button>
  )
}

export default FollowButton