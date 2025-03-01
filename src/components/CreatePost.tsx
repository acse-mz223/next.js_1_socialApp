"use client"
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@radix-ui/react-separator'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useUser } from '@clerk/nextjs'
import { Button } from './ui/button'
import {ImageIcon, LoaderIcon, SendIcon, XIcon } from 'lucide-react'
import { createPost } from '@/actions/post_action'
import { error } from 'console'
import { UploadButton } from '@/lib/uploadthing'
import Image from "next/image";


  

function CreatePost() {
  // useState
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageUpLoading, setImageUpLoading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  // useInfo
  const {isSignedIn, user} = useUser()
  // handle post func: update post data to db + clean the content
  async function postFun(){
    // no content or url to post
    if (!content.trim() && !imageUrl) return 
    // post: state change + trans info into db
    setIsPosting(true)
    try {
        const result = await createPost(content,imageUrl)
        if (result.success) {
            setContent("")
            setImageUrl("")
            alert("Post created successfully!")
        }
        else {
            alert("Post created unsuccessfully")
        }
    } catch(error) {
        console.error("Failed to create post:", error)
        alert("Post created unsuccessfully")
    } finally{
        setIsPosting(false)

    }
    
  } 

  // return 
  return (
    <div>
        <Card className='mb-6'>
        <CardContent className='pt-4'>
            <div className='flex space-x-2'>
                <Avatar>
                    <AvatarImage className='w-10 h-10' src={user?.imageUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Textarea 
                    className='min-h-[100px] border-none resize-none focus-visible:ring-0 '
                    placeholder = "Write some things here"
                    disabled = {isPosting}
                    onChange = {(event) =>{ setContent(event.target.value)}}
                    value={content}
                />
            </div>
            <Separator/>
            <div className='flex items-end justify-between pt-4'>
                {/* <Button 
                    variant="ghost" 
                    disabled={isPosting || imageUpLoading}
                    className='flex items-center text-muted-foreground hover:text-primary'
                    onClick={() => setImageUpLoading(true)}
                >
                    <ImageIcon></ImageIcon>
                    <p>Photo</p>
                </Button> */}
                {imageUrl?
                    <div className='w-1/3 border-2 border-gray-400 border-dashed rounded-md relative p-1 items-center justify-center'>
                        <XIcon 
                            className='absolute h-4 w-4 right-1 top-1 bg-red-600 text-white rounded-full hover:bg-red-400'
                            onClick={() => setImageUrl("")}
                        />
                        <img src={imageUrl} alt="Image failed to load" className='object-contain'/>
                    </div>:
                    <UploadButton
                        endpoint="imageUploader"
                        disabled={isPosting || imageUpLoading}
                        className='flex items-center text-muted-foreground hover:text-primary'
                        onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Upload Completed");
                        console.log("res:",res[0].ufsUrl)
                        setImageUrl(res[0].ufsUrl)
                        }}
                        onUploadError={(error: Error) => {
                        // Do something with the error.
                        console.log(`ERROR! ${error.message}`);
                        }}
                    />
                }
                <Button
                    className='flex items-center'
                    onClick={postFun}
                    disabled={isPosting || imageUpLoading || (!content.trim() && !imageUrl) }
                >

                    {isPosting? <LoaderIcon className='h-4 w-4 mr-2 animate-spin'></LoaderIcon>:<SendIcon className='h-4 w-4 mr-2'></SendIcon>}
                    <p>Post</p>
                </Button>
            </div>

        </CardContent>
        </Card>
    </div>
  )
}

export default CreatePost