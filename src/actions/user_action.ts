"use server"

import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { error } from "console"
import { Link } from "lucide-react"
import { revalidatePath } from "next/cache"
import { use } from "react"

// update db when sign in
export async function syncUserInfo() {
    // get user info
    const user = await currentUser()
    if (!user) return 
    // check if user exist in database
    const getUser = await prisma.user.findUnique({
        where: {clerkId: user.id }
    })
    if (getUser) {
        console.log("User exist in db")
        return getUser
    }
    // add new user into database
    const newUser = prisma.user.create({
        data: {
            clerkId: user.id,
            displayName:  `${user.firstName} ${user.lastName}`,
            username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl
        }
    })
    console.log("User added into bd")
    return newUser
}

// find user info from db by id
export async function getUserInfoByClerkId(clerkId:string){
    let userInfo = await prisma.user.findUnique({
        where: {clerkId: clerkId},
        include:{
            _count:{
                select:{
                    followers: true,
                    following: true,
                    posts: true
                }
            }
        }
    })
    return userInfo
}

// find user.id in db from fetching clerk id
export async function getUserDbId() {
    // 获取clerkId
    const user = await currentUser()
    if (!user) throw new Error("No user anthorized")
    // 通过clerkId获取db user Info
    const userInfo = await getUserInfoByClerkId(user.id)
    if (!userInfo) throw new Error("cant find user info in db")
    return userInfo.id
} 

// fetch some user info randomly
export async function getUserInfoRandom() {
    try{
        // user id
        const userId = await getUserDbId()
        // get  user info from db (exlude ourselves + who we already followed)
        const usersInfo = await prisma.user.findMany({
            where: {
                AND:[
                    {NOT: {id:userId}},
                    {NOT: {followers: {
                        some:{
                            followerId: userId
                        }
                    }}}
                ]
            },
            select :{
                id: true,
                image: true,
                displayName: true,
                username: true,
                _count:{
                    select:{
                        followers: true
                    }
                }
            },
            take:3
        })
        return usersInfo
    } catch(error){
        console.log("Failed to fetch random userInfo:", error)
    }
}

// add new following into db
export async function toggleFollow(followerId:string) {
    try{
        const userdbId = await getUserDbId()
        // add/cancel the following into/from following
        // find
        const findResult = await prisma.follows.findUnique({
            where: {
                followerId_followeringId:{
                    followerId: userdbId,
                    followeringId: followerId
                }
            }
        })
        // unfollow
        if (findResult){
            await prisma.follows.delete({
                where: {
                    followerId_followeringId:{
                        followerId: userdbId,
                        followeringId: followerId
                    }
                }
            })
        }
        // follow
        else{
            await prisma.$transaction([
                prisma.follows.create({
                    data: {
                        followerId: userdbId,
                        followeringId: followerId
                        
                    }
                }),
                prisma.notification.create({
                    data: {
                        authorId: userdbId,
                        recivorId: followerId,
                        type: "FOLLOW"  
                    }
                })                     
            ])          
        }
        // return
        revalidatePath("/")
        return {success:true, result: findResult? "unfollow": "follow"}
    } catch(error){
        console.log("Failed to follow/unfollow")
        return {success:false, error:error}
    }
}