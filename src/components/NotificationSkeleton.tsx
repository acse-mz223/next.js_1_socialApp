import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Skeleton } from './ui/skeleton'

function NotificationSkeleton() {
  // array of 5 items
  const skeletonItems = Array.from({ length: 10 }, (_, i) => i);
  return (
    <Card>
        <CardHeader className="border-b">
            <div className='flex items-center justify-between w-full'>
                <div className='font-extrabold text-xl'>Notifications</div>
                <Skeleton className="h-4 w-20" />
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
            {skeletonItems.map((index) => (
                <div key={index} className="flex items-start gap-4 p-4 border-b">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="pl-6 space-y-2">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>
            ))}
            </ScrollArea>
        </CardContent>
    </Card>
    )
}

export default NotificationSkeleton