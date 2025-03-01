"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { getUserDbId } from "./user_action"
import { tree } from "next/dist/build/templates/app-page"
import { profile } from "console"

// get user info
export async function getProfileByUsername(userName: string) {
    try{
        const result = await prisma.user.findUnique({
            where: {
                username: userName
            },
            select:{
                id: true,
                image: true,
                displayName: true,
                username: true,
                location: true,
                webLink: true,
                _count:{
                    select:{
                        followers: true,
                        following: true,
                        posts: true
                    }
                },
                // posts: {
                //     select:{
                //         id: true,
                //         image: true,
                //         content: true,
                //         createdAt: true,
                //         _count:{
                //             select:{
                //                 likes: true,
                //                 comment: true
                //             }
                //         }
                //     },
                //     orderBy: {
                //         createdAt: "desc"
                //     }
                // }
            }
        })
        console.log("fetch profile successfully!")
        return result
    } catch(error){
        console.log("failed to fetch profile")
        // return {success: false, error: error}
        throw new Error("Failed to fetch profile");
    }
}

// get profile posts
export async function getProfilePosts(profileId: string) {
    try{
        const postdInfos = await prisma.post.findMany({
            where:{
                authorId:profileId
            },
            orderBy:{
                createdAt: "desc"
            },
            include:{
                author:{
                    select:{
                        displayName: true,
                        image: true,
                        username: true
                    }
                },
                comment:{
                    include:{
                        author: {
                            select:{
                                id: true,
                                displayName: true,
                                image: true,
                                username: true
                            }
                        }
                    },
                    orderBy:{
                        createdAt: "asc"
                    }
                },
                likes:{
                    select:{
                        authorId: true
                    }
                },
                _count:{
                    select:{
                        likes: true,
                        comment: true
                    }
                }
                
            },
            take: 5
        })
        return {success: true, postdInfos:postdInfos}
    } catch(error){
        console.log("failed to fetch posts")
        return {success: false, error:error, postdInfos:[]}
    }
}

// get posts that user liked 
export async function getLikedPostByUserId(userId: string){
    try{
        const result = await prisma.post.findMany({
            where: {
                likes:{
                    some:{
                        authorId: userId
                    }
                }
            },
            orderBy:{
                createdAt: "desc"
            },
            include:{
                author:{
                    select:{
                        displayName: true,
                        image: true,
                        username: true
                    }
                },
                comment:{
                    include:{
                        author: {
                            select:{
                                id: true,
                                displayName: true,
                                image: true,
                                username: true
                            }
                        }
                    },
                    orderBy:{
                        createdAt: "asc"
                    }
                },
                likes:{
                    select:{
                        authorId: true
                    }
                },
                _count:{
                    select:{
                        likes: true,
                        comment: true
                    }
                }
                
            }
        })

        console.log("fetch liked post info successfully!")
        return {success: true, post: result}
    } catch(error){
        console.log("failed to fetch liked post")
        throw new Error("Failed to fetch liked post");
        //return {success: false, error: error}
    }
}

// update user info
export async function updateUserInfo(formData: FormData) {
    try{
        const {userId: clerkId} = await auth()
        if (!clerkId) throw new Error("Unauthorized")

        const displayName = formData.get("name") as string
        const location = formData.get("location") as string
        const website = formData.get("website") as string

        const result = await prisma.user.update({
            where: {
                clerkId: clerkId
            },
            data:{
                displayName: displayName,
                location: location,
                webLink: website
            }
        })
        revalidatePath("/profile")
        console.log("update user info successfully!")
        return {success: true}
    } catch(error){
        console.log("failed to update user info")
        return {success: false, error: error}
    }
}

// check whether user is following another user or not 
export async function checkFollowState(userId: string){
    try{
        const currentUserId = await getUserDbId()
        if (!currentUserId) return false

        const result = await prisma.follows.findUnique({
            where: {
                followerId_followeringId:{
                    followerId: currentUserId,
                    followeringId: userId
                }
            }
        })
        return !!result
    } catch(error){
        console.log("failed to get follow state")
        return false
    }
}
