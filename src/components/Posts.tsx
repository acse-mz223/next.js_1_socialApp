import { getPosts } from '@/actions/post_action'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { DeleteIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import PostCard from './PostCard'
import { getUserDbId } from '@/actions/user_action'

async function Posts() {
  // userId
  const userId = await getUserDbId()
  // get posts from db
  const result = await getPosts()
  if (!result.success) return null
  return (
    <div className='flex flex-col gap-3'>
        {result.postdInfos?.map((postInfo) =>{
        return <PostCard postInfo={postInfo} userId={userId} />
        })}
    </div>
  )
}

export default Posts