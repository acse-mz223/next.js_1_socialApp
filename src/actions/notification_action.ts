"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { tree } from "next/dist/build/templates/app-page";

// get all notification for one user
// like: author + post info
// follow: author info
// comment: author + post info + comment
export async function getNotification(userId: string) {
    try{
        const result = await prisma.notification.findMany({
            where:{
                recivorId: userId,
            },
            include:{
                author:{
                    select:{
                        displayName: true,
                        username: true,
                        image: true
                    }
                },
                post:{
                    select:{
                        content: true,
                        image: true
                    }
                },
                comment:{
                    select:{
                        content: true
                    }
                }
            },
            orderBy:{
                createdAt: "desc"
            }
        })
        revalidatePath("/notification")
        return {success: true, notifications: result}
    } catch(error){
        return {success: false, error:error, notifications: []}
    }
}

// mark notifications as read
export async function NotificationsMarkedAsRead(notificationIds: string[]){
    try{
        const result = await prisma.notification.updateMany({
            where: {
                id: { in:notificationIds}
            },
            data:{
                read: true
            }
        })
        return {success: true}
    } catch(error){
        return {success: false}
    }
}