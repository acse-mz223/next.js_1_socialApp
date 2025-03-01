"use client"
import React from 'react'
import Modetoggle from './ModeToggle'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { BellIcon, HomeIcon, LogOutIcon, MenuIcon, UserIcon } from 'lucide-react'
import { Button } from './ui/button'
import { SignInButton, SignOutButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
  

function MobileNavbar() {
  const { isSignedIn } = useAuth();
  return (
    <div className='flex md:hidden items-center space-x-2'>
        <Modetoggle/>
        <Sheet>
            <SheetTrigger>
                <MenuIcon className='h-4 w-4'/>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <Button variant="ghost" className='w-full'>
                    <Link href="/" className='flex items-center justify-start gap-2 w-full'>
                        <HomeIcon className='h-4 w-4' />
                        <span className='inline'>Home</span>
                    </Link>
                </Button>
                {isSignedIn? (
                    <>
                        <Button variant="ghost" className='w-full'>
                            <Link href="/notifications" className='flex items-center justify-start gap-2 w-full'>
                                <BellIcon className='h-4 w-4'></BellIcon>
                                <span className='inline'>Notifications</span>
                            </Link>
                        </Button>

                        <Button variant="ghost" className='w-full'>
                            <Link href='/profile' className='flex items-center justify-start gap-2 w-full'>
                                <UserIcon className='h-4 w-4'></UserIcon>
                                <span className='inline'>Profiles</span>
                            </Link>
                        </Button>

                        <SignOutButton>
                            <Button variant="ghost" className="flex items-center gap-2 justify-start w-full">
                                <LogOutIcon className="w-4 h-4" />
                                Logout
                            </Button>
                        </SignOutButton>
                    </>
                ):(
                    <SignInButton mode="modal" >
                        <Button variant="default">Sign In</Button>
                    </SignInButton>
                )}
            </SheetContent>
            </Sheet>


    </div>
  )
}

export default MobileNavbar