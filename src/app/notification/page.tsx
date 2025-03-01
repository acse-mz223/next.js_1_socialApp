"use client"

import { getNotification, NotificationsMarkedAsRead } from '@/actions/notification_action'
import { getUserDbId } from '@/actions/user_action'
import NotificationSkeleton from '@/components/NotificationSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

// function 
//   - fatch data
//     - loading: skeleton
//     - loaded: show all the notificaiton: like + comment + follow
//               update unread in db as read
//     - after loaded: wont update page until hit page update button

function NotificationContent(notification: Awaited<ReturnType<typeof getNotification>>["notifications"][number]){
  let action = ""
  if (notification.type === "LIKE"){
    action = `${notification.author.displayName} liked your post`
  }
  else if (notification.type === "FOLLOW") {
    action = `${notification.author.displayName} started following you`
  }
  else if (notification.type === "COMMENT"){
    action = `${notification.author.displayName} commented your post` 
  }

  return (
    <div className='flex flex-col w-full gap-2 items-start'>
      <div className='font-bold flex items-center gap-3'>
        {action} 
        {notification.read? null:<div className='p-1 rounded-md bg-muted'>new</div>}
      </div>
      {notification.type === "COMMENT" || notification.type === "LIKE" ? 
        <div className='flex flex-col w-full item-start gap-1 border-l-8 border-black/15 pl-1'>
          {notification.post?.content? <div className='text-sm break-words'>{notification.post?.content}</div> : null}
          {notification.post?.image? <Image src={notification.post?.image} alt="Image failed to load" layout="intrinsic" className='w-full h-auto'/> : null}
        </div>
        : null 
      }
      {notification.type === "COMMENT"? <div>{notification.comment?.content}</div> : null}
      <div className='text-sm text-muted-foreground'>{formatDistanceToNow(new Date(notification.createdAt))}</div>
    </div>
  )
}

function NotificationPage() {
  // add loading effect -- use hook
  const [isLoading, setIsLoading] = useState(false) //isLoading state is to update loading state and decide the page content
  const [notifications, setNotifications] = useState<Awaited<ReturnType<typeof getNotification>>>() // notificaitons state is used to save notificaitons info, becasue 
                                                                                                    // re-render caused by isLoading will re-render the page with init params except the value wrapped by useStete
                                                                                                    // so if notificaitions do not use useState, the new value will not be remembered.
  const [unReadNum, setUnReadNum] = useState(0)                                                                                                    
  // useEffect make async usable in client component      
  // but async need to be a func      
  useEffect(()=>{
    async function fetchNotificaitons() {
      try{
        setIsLoading(true)
        const userId = await getUserDbId()
        const result = await getNotification(userId)
        setNotifications(result) // this func will update cache and update page
        // mark as read
        const unread = result.notifications.filter((info) => !info.read).map(info => info.id)
        setUnReadNum(unread.length)
        await NotificationsMarkedAsRead(unread)
      } catch(error){
        console.log("failed to fetch notificaitons")
      }finally{
        setIsLoading(false)
      }
    }
    fetchNotificaitons()
  },[])

  return (
    isLoading? 
      <NotificationSkeleton/> :
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between w-full'>
            <div className='font-extrabold text-xl'>Notifications</div>
            <div className='text-muted-foreground text-md'>{unReadNum} unreads</div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-14rem)]">
            {notifications?.notifications?.map((notification) =>{
              return(
                <>
                  <div className='flex gap-4 items-start justify-between w-full p-6 hover:bg-muted'>
                    <Link href={`/profile/${notification.author.username}`}>
                        <Avatar >
                            <AvatarImage className='w-10 h-10' src={notification.author.image || "https://github.com/shadcn.png"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar> 
                    </Link>
                    {NotificationContent(notification)}
                  </div>
                  <Separator/>
                </>
              )
            })}
          </ScrollArea>
        </CardContent>
      </Card>
  )
}

export default NotificationPage