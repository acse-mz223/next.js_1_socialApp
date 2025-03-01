import React from 'react'
import Modetoggle from './ModeToggle'
import Link from 'next/link'
import { BellIcon, HomeIcon, UserIcon } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'



async function DesktopNavbar() {
  let user = await currentUser()
  return (
    <div className='hidden md:flex items-center space-x-4'>
        <Modetoggle/>

        <Button variant="ghost" >
            <Link href="/" className='flex items-center justify-center gap-2'>
                <HomeIcon className='h-4 w-4'></HomeIcon>
                <span className='hidden lg:inline'>Home</span>
            </Link>
        </Button>

        {user? (
            <>
                <Button variant="ghost" >
                    <Link href="/notifications" className='flex items-center justify-center gap-2'>
                        <BellIcon className='h-4 w-4'></BellIcon>
                        <span className='hidden lg:inline'>Notifications</span>
                    </Link>
                </Button>

                <Button variant="ghost" >
                    <Link href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]}`} className='flex items-center justify-center gap-2'>
                        <UserIcon className='h-4 w-4'></UserIcon>
                        <span className='hidden lg:inline'>Profiles</span>
                    </Link>
                </Button>

                <UserButton/>
            </>
            ):(
                <SignInButton mode="modal" >
                    <Button variant="default">Sign In</Button>
                </SignInButton>
            )

        }

    </div>
  )
}

export default DesktopNavbar