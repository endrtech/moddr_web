import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationBar } from "@/components/application/application-bar";
import { Toaster } from "@/components/ui/sonner";
import React, { Suspense } from "react";
import Loading from "./loading";
import { useLoadingStore } from "@/lib/store/useLoadingStore";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Briefcase, Cog, LayoutDashboard, Lock, MessageSquareDot, Settings, ShieldUser, User, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { SettingsTabs } from "@/components/tabs";
import { io } from "socket.io-client";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MODDR",
    description: "The live-moderation system for Discord -- and the companion to MYMOD.",
};

export default function RootLayout({
    children,
    messageactivity,
    guildactivity,
    recentcases,
    guildmembers,
    guildchannels,
    guildteam,
    endrintelligence,

    memberslist,
    channelslist,
    caseslist,
    teamlist,

    enablefeatures,
    securitysettings,
}: Readonly<{
    children: React.ReactNode;
    messageactivity: React.ReactNode;
    guildactivity: React.ReactNode;
    recentcases: React.ReactNode;
    guildmembers: React.ReactNode;
    guildchannels: React.ReactNode;
    guildteam: React.ReactNode;
    endrintelligence: React.ReactNode;

    memberslist: React.ReactNode;
    channelslist: React.ReactNode;
    caseslist: React.ReactNode;
    teamlist: React.ReactNode;

    enablefeatures: React.ReactNode;
    securitysettings: React.ReactNode;
}>) {
    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col gap-0 w-full h-screen bg-black`}
        >
            <ApplicationBar />
            <Tabs defaultValue="dashboard" className="dark w-full h-full">
                <div className="flex flex-row gap-0 w-full h-full">
                    <Card className="p-0 rounded-none h-full w-12 bg-background text-white">
                        <TabsList className="flex flex-col gap-2 w-full h-full rounded-none">
                            <TabsTrigger value="dashboard" className="w-full h-8 rounded-none">
                                <LayoutDashboard />
                            </TabsTrigger>
                            <TabsTrigger value="users" className="w-full rounded-none">
                                <Users />
                            </TabsTrigger>
                            <TabsTrigger value="channels" className="w-full rounded-none">
                                <MessageSquareDot />
                            </TabsTrigger>
                            <TabsTrigger value="cases" className="w-full rounded-none">
                                <Briefcase />
                            </TabsTrigger>
                            <TabsTrigger value="team" className="w-full rounded-none">
                                <ShieldUser />
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="w-full rounded-none">
                                <Cog />
                            </TabsTrigger>
                        </TabsList>
                    </Card>
                    <TabsContent value="dashboard" className="w-full h-full">
                        <div className="flex flex-row w-full h-1/2 gap-0">
                            {messageactivity}
                            {guildactivity}
                            {recentcases}
                        </div>
                        <div className="flex flex-row w-full h-1/2 gap-0">
                            {guildmembers}
                            {guildchannels}
                            {guildteam}
                            {/*{endrintelligence}*/}
                        </div>
                    </TabsContent>
                    <TabsContent value="users" className="w-full h-full">
                        {memberslist}
                    </TabsContent>
                    <TabsContent value="channels" className="w-full h-full">
                        {channelslist}
                    </TabsContent>
                    <TabsContent value="cases" className="w-full h-full">
                        {caseslist}
                    </TabsContent>
                    <TabsContent value="team" className="w-full h-full">
                        {teamlist}
                    </TabsContent>
                    <TabsContent value="settings" className="w-full h-full">
                        <div className="w-full h-full">
                            <div className="flex flex-col gap-4 p-4">
                                <div className="flex flex-col gap-0 p-2">
                                    <h1 className={`${geistSans.className} text-white font-bold text-3xl`}>Settings</h1>
                                    <span className={`${geistSans.className} text-zinc-600 font-normal text-md`}>Manage your MODDR settings here, such as enabling specific sections of the app, clearing your data, and enabling message encryption.</span>
                                </div>
                                <Separator />
                            </div>
                            <div className="flex flex-row gap-2 w-full">
                                <div className="p-4">
                                    <SettingsTabs />
                                </div>
                                <div className="w-fit h-full p-4 hidden" id="appearance">

                                </div>
                                <div className="w-fit h-full p-4 hidden" id="notifications">

                                </div>
                                <div className="w-full h-full p-4 hidden" id="security">
                                    {securitysettings}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
            {children}
            <Loading />
            <Toaster className="dark" />
        </div >
    );
}