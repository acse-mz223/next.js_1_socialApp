import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
        maxFileSize: "4MB",
        maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async (req) => {
        // This code runs on your server before upload
        const {userId} = await auth();

        // If you throw, the user will not be able to upload
        if (!userId) throw new UploadThingError("Unauthorized");

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {  // middleware返回的内容会存储在metadata中
        // This code RUNS ON YOUR SERVER after upload
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
        }),
    } satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
