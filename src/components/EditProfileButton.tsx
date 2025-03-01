"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Edit2Icon, Loader2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLikedPostByUserId, getProfileByUsername, updateUserInfo } from '@/actions/profile_action'

// userInfo: Awaited<ReturnType<typeof getProfileByUsername>>,
// likedPosts: Awaited<ReturnType<typeof getLikedPostByUserId>>,
// followState: boolean

function EditProfileButton({userInfo}:{userInfo: Awaited<ReturnType<typeof getProfileByUsername>>}) {
  const [editForm, setEditForm] = useState({
    name: userInfo?.displayName || "",
    location: userInfo?.location || "",
    website: userInfo?.webLink || ""
  })
  const [isUpdating, setIsUpdating] = useState(false)

  // submit form func
  async function submitForm(){
    // FormDate
    const formDate = new FormData()
    Object.entries(editForm).forEach(([key,value])=>{
      formDate.append(key,value)
    })
    // update to db
    try{
      setIsUpdating(true)
      const result = await updateUserInfo(formDate)
      console.log("info update successfully")
    } catch(error){
      console.log("fail to info update ")
    } finally{
      setIsUpdating(false)
    } 
  }

  // return
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full py-6 mb-3">
          <Edit2Icon></Edit2Icon>
          <p className="text-sm">Edit Profile</p>
          </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
          <div className='flex flex-col gap-4 w-full pt-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor="name" className='text-md font-semibold'>Name</Label>
              <input placeholder="Your current location" id="name" className='p-2 text-md w-full border-2 rounded-md' value={editForm.name} onChange={(e) => setEditForm((pre) => {return {...pre,name:e.target.value}})}></input>
            </div>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor="location" className='text-md font-semibold'>Location</Label>
              <input placeholder="Your current location" id="location" className='p-2 text-md w-full border-2 rounded-md' value={editForm.location} onChange={(e) => setEditForm((pre) => {return {...pre,location:e.target.value}})}></input>
            </div>
            <div className='grid w-full items-center gap-1.5 pb-4'>
              <Label htmlFor="email" className='text-md font-semibold'>Website</Label>
              <input placeholder="Your personal website" id="website" className='p-2 text-md w-full border-2 rounded-md' value={editForm.website} onChange={(e) => setEditForm((pre) => {return {...pre,website:e.target.value}})}></input>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={submitForm} disabled={isUpdating}>
            {isUpdating? <Loader2Icon className='animate-spin'></Loader2Icon>:<p>Save</p>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
  }

export default EditProfileButton