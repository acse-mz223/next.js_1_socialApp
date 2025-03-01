
import Link from 'next/link'
import React from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'
import { currentUser } from '@clerk/nextjs/server'
import { syncUserInfo } from '@/actions/user_action'

async function Navbar() {
  // user info into database
  const user = await currentUser()
  if(user) {  // add user info into database
    await syncUserInfo()
  }

  return (
    <nav className='sticky top-0 w-full border-b bg-background/95 backdrop-blur z-50'>
        <div className='flex items-center justify-between h-16 px-6'>
            <div className='flex items-center'> 
                <Link href="/">
                    main page
                </Link>
            </div>
            <DesktopNavbar/>
            <MobileNavbar/>
        </div>
    </nav>
  )
}

export default Navbar