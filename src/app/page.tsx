import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle"
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
import FollowBar from "@/components/FollowBar";
import Posts from "@/components/Posts";

export default async function Home() {
  const user = await currentUser()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="flex flex-col lg:col-span-6 gap-4">
        {user? <CreatePost/>: null}
        {user? <Posts/>: null}
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20" >
        <FollowBar/>
      </div>
    </div>
  );
}
