"use client"
import React from 'react'
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
import { LoaderIcon, Trash2Icon, TrashIcon, X } from 'lucide-react'
import { Button } from './ui/button'
  
function DeleteButton({postId, userId, isDeleting, deleteHandle}:{postId:string, userId: string, isDeleting: boolean, deleteHandle: (postId: string) => Promise<void>}) {
  return (
    <AlertDialog>
        <AlertDialogTrigger>
            <Button variant="ghost" disabled={isDeleting}>
                {isDeleting? <LoaderIcon className='animate-spin'/>: <Trash2Icon/>}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Do yon want to delete the post?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your Post.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={() => deleteHandle(postId)}
                disabled={isDeleting}
            >
                {isDeleting? "Deleting": "Delete"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteButton