"use server"
import prisma from "@/lib/prisma"
import { getUserDbId } from "./user_action"
import { revalidatePath } from "next/cache"
import { tree } from "next/dist/build/templates/app-page"
import { use, useId } from "react"
import { comment } from "postcss"

// trans content and imageUrl of post into db
export async function createPost(content:string,imageUrl:string) {
    try{
        const userdbId = await getUserDbId()
        // update to post 
        const updatePostRes = prisma.post.create({
            data: {
                authorId: userdbId,
                content: content,
                image: imageUrl
            }
        })
        // update main page 
        revalidatePath("/")
        //return 
        return {success:true, updatePostRes}
    } catch(error) {
        console.log("create post failed:", error)
        return {success:false , error}
    }
}

export async function getPosts() {
    try{
        const userId = await getUserDbId()
        const postdInfos = await prisma.post.findMany({
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

export async function toggleLike(userId: string, postId: string, authorId:string){
    try{
        // find
        const result = await prisma.like.findUnique({
            where: { 
                authorId_postId:{
                    authorId: userId,
                    postId: postId
                }
                
            }
        })
        console.log("like:",result)
        // unlike
        if (result) {
            await prisma.like.delete({
                where: { 
                    authorId_postId:{
                        authorId: userId,
                        postId: postId
                    }
                    
                }
            })            
        }
        // like + notificaiton
        else {
            // console.log(userId,authorId,postId)
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        authorId: userId,
                        postId: postId
                    }
                }),
                prisma.notification.create({
                    data:{
                        authorId: userId,
                        recivorId: authorId,
                        type: "LIKE",
                        postId: postId,
                    }
                })

            ])
        }
        console.log("like status updated to db")
        revalidatePath("/")
        return {success: true}
    } catch(error){
        console.log("Fail to update like status:",error)
        return {success: false}
    }
}

export async function createComment (postId:string, content:string, userId: string, authorId:string) {
    try{
        // add comment + notification
        const result = await prisma.$transaction(async(tx) =>{
            const newComment = await tx.comment.create({
                data:{
                    authorId: userId,
                    postId: postId,
                    content: content
                }
            })
            await tx.notification.create({
                data:{
                    authorId: userId,
                    recivorId: authorId,
                    type: "COMMENT",
                    postId: postId,
                    commentId: newComment.id
                                        
                }
            })
        })
        console.log("comment updated to db")
        revalidatePath("/")
        return {success: true}
    } catch(error){
        console.log("fail to update comment to db")
        return {success: false}
    }
}

// delete the post: only when user is the author, function can be used. the check shouw be done before this
export async function deletePost(postId:string, userId: string){
    try{
        const result = await prisma.post.delete({
            where:{
                id: postId
            }
        })
        console.log("post deleted in the db")
        revalidatePath("/")
        return {success: true}        
    } catch(error){
        console.log("fail to delete post to db")
        return {success: false}
    }
}
