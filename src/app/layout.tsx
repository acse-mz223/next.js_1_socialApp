import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              <Navbar />
              <main className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="hidden lg:block lg:col-span-3">
                      <SideBar/>
                    </div>
                    <div className="lg:col-span-9">
                    <NextSSRPlugin
                      /**
                       * The `extractRouterConfig` will extract **only** the route configs
                       * from the router to prevent additional information from being
                       * leaked to the client. The data passed to the client is the same
                       * as if you were to fetch `/api/uploadthing` directly.
                       */
                      routerConfig={extractRouterConfig(ourFileRouter)}
                    />
                      {children}
                    </div>
                  </div>
                </div>
              </main>
             
            </div>
            
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
