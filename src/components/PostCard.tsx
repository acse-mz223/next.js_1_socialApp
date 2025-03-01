"use client"
import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button'
import { DeleteIcon, HeartIcon, Loader2Icon, MessageCircleIcon, SendIcon, X } from 'lucide-react'
import { createComment, deletePost, getPosts, toggleLike } from '@/actions/post_action'
import { useUser } from '@clerk/nextjs'
import { Separator } from '@radix-ui/react-separator'
import Link from 'next/link'
import Image from "next/image";
import DeleteButton from './DeleteButton'
import { formatDistanceToNow } from "date-fns";
import { Textarea } from './ui/textarea'

type Posts = Awaited<ReturnType<typeof getPosts>>["postdInfos"]
type Post = Posts[number];

function PostCard({postInfo, userId}: {postInfo:Post, userId:string}) {
    // basic user info
    const {isSignedIn, user} = useUser()
    if (!user) return null
    // get commets
    // state
    const [commentContent, setCommentContent] = useState("")
    const [isCommenting, setIscommenting] = useState(false)
    const [hasLiked, setHasLiked] = useState(postInfo.likes.some(like => like.authorId === userId))
    const [isLiking, setIsLiking] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showComments, setShowComments] = useState(false)
    // like handle
    const likeHandle = async (postId: string, authorId: string) =>{
        try{
            console.log("like button clicked")
            setHasLiked(pre => !pre)
            setIsLiking(true)
            // update to db
            const result = await toggleLike(userId, postId, authorId)
            console.log("like/unlike feedback:", result)
        } catch(error){
            console.log("fail to like/unlike")
        } finally{
            setIsLiking(false)
        }
    }

    // add comment handle: this function add comment to db when user hit the button
    const commentHandle = async(postId: string, authorId: string) =>{
        try{
            setIscommenting(true)
            const result = await createComment(postId, commentContent, userId, authorId)
            if (result.success) {alert("comment successfully!") }
            setCommentContent("")
        } catch(error){
            console.error("Failed to comment:", error)
            alert("Failed to comment") 
        } finally{
            setIscommenting(false)

        }
    }

    // delete post: delete post when author hit the button (only author has the delete button)
    const deleteHandle = async(postId: string) =>{
        // need to diable the button when updating
        try{
            setIsDeleting(true)
            const result = await deletePost(postId, userId)
            if (result.success) {alert("post deleted successfully!") }
        } catch(error){
            console.error("Failed to delete:", error)
            alert("Failed to delete") 
        } finally{
            setIsDeleting(false)
        }
    }

    return (
        <Card>
            <CardContent>
                <div className='flex flex-col gap-4'>
                    {/* post info + content */}
                    <div className='pt-4 flex items-start justify-between'>
                        <div className='flex gap-4 items-start justify-start'>
                            <Link href={`/profile/${postInfo.author.username}`}>
                                <Avatar >
                                    <AvatarImage className='w-10 h-10' src={postInfo.author.image || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar> 
                            </Link>
                            <div className='flex flex-col gap-1 justify-start items-start'>
                                <div className='flex items-center justify-start gap-4'>
                                    <p className='text-md font-semibold'>{postInfo.author.displayName}</p>
                                    <p className='text-muted-foreground text-md truncate'>{postInfo.author.username}</p>
                                    <p className='text-muted-foreground text-md truncate'>{formatDistanceToNow(new Date(postInfo.createdAt))}</p>
                                </div>
                                <div className='text-sm break-words'>{postInfo.content}</div>
                            </div>
                        </div>
                        {userId === postInfo.authorId? <DeleteButton postId={postInfo.id} userId={userId} isDeleting={isDeleting} deleteHandle={() => deleteHandle(postInfo.id)}/>: null}
                    </div>

                    {/* post image */}
                    {postInfo.image? <img src={postInfo.image} alt="Image failed to load" className='w-full h-auto'/> : null}

                    {/* like button + comment button */}
                    <div className='flex items-center justify-start gap-10 text-muted-foreground'>
                        <Button variant="ghost" className='flex gap-2 items-center'  onClick={() => likeHandle(postInfo.id, postInfo.authorId)}>
                                <HeartIcon className={`size-5 ${hasLiked? "fill-pink-500 text-pink-500": null}`} />
                            <p>{postInfo._count.likes}</p>
                        </Button>
                        <Button variant="ghost" className='flex gap-2 items-center' onClick={() => setShowComments(pre => !pre)}>
                            <MessageCircleIcon  className={`size-5 ${showComments? "fill-blue-500 text-blue-500": null}`} />
                            <p>{postInfo._count.comment}</p>
                        </Button>
                    </div>

                    {showComments? <>
                    {/* comment write  */}
                    <div className='flex flex-col w-full gap-2'>
                        <div className='flex w-full justify-between items-start gap-2'>
                            <Link href={`/profile/${postInfo.author.username}`}>
                                <Avatar >
                                    <AvatarImage className='w-10 h-10' src={user.imageUrl || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar> 
                            </Link>
                            <Textarea 
                                placeholder="Write a comment" 
                                className='min-h-[100px] border-none resize-none focus-visible:ring-0'
                                value={commentContent}
                                disabled={isCommenting}
                                onChange={(event) => setCommentContent(event.target.value)}/>
                        </div>
                        <Button 
                            onClick={() => commentHandle(postInfo.id, postInfo.authorId)}
                            disabled={isCommenting || !commentContent.trim()}
                            className='flex items-center ml-auto'
                        >
                            {isCommenting? <Loader2Icon className='animate-spin'/>: <SendIcon />}
                            <p>Comment</p>
                        </Button>
                    </div>

                    {/* show comments */}
                    {postInfo.comment.map((comment) => {
                        return(
                            <div className='pt-4 flex items-start justify-between'>
                            <div className='flex gap-4 items-start justify-start'>
                                <Link href={`/profile/${comment.author.username}`}>
                                    <Avatar >
                                        <AvatarImage className='w-10 h-10' src={comment.author.image || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar> 
                                </Link>
                                <div className='flex flex-col gap-1 justify-start items-start'>
                                    <div className='flex items-center justify-start gap-4'>
                                        <p className='text-md font-semibold'>{comment.author.displayName}</p>
                                        <p className='text-muted-foreground text-md truncate'>{comment.author.username}</p>
                                        <p className='text-muted-foreground text-md truncate'>{formatDistanceToNow(new Date(comment.createdAt))}</p>
                                    </div>
                                    <div className='text-sm break-words'>{comment.content}</div>
                                </div>
                            </div>
                        </div>                            
                        )
                    })} 
                    </>: null}
                </div>
            </CardContent>
        </Card>
    )
}

export default PostCard