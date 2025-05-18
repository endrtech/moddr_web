"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getGuildMessages from "@/app/actions/getGuildMessages";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, ClockFadingIcon, Loader2, MessageSquareDot, MessageSquareDotIcon, ShieldAlert, TimerOff, UserMinus, UserPlus } from "lucide-react";
import { getCurrentGuildEvents } from "@/app/actions/getCurrentGuildEvents";
import moment from "moment";
import Loading from "../loading";
import { getCurrentGuildMembers } from "@/app/actions/getCurrentGuildMembers";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getDiscordUser } from "@/app/actions/getDiscordUser";
import { toast } from "sonner";
import { timeoutGuildMember } from "@/app/actions/members/timeoutGuildMember";
import { warnGuildMember } from "@/app/actions/members/warnGuildMember";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import DurationUnitSelect from "@/components/DurationUnitSelect";
import getGuildChannels from "@/app/actions/getGuildChannels";

export default function GuildActivity() {
    const [channels, setChannels] = useState<any>();
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<any>();

    useEffect(() => {
        const getData = async () => {
            const guildId = window.localStorage.getItem("currentServerId");
            const getChannels = await getGuildChannels(guildId);
            setChannels(getChannels);
            const getAllMessages = await getGuildMessages(guildId);
            setMessages(getAllMessages);
        };

        // Run once immediately
        getData();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [channels])

    return (

        <Card className="p-0 h-full w-full bg-zinc-900 border-zinc-800 rounded-none flex flex-col dark">
            <CardHeader className="p-2 h-4 border-b border-zinc-800">
                <CardTitle className="uppercase text-zinc-600 font-semibold text-sm">
                    Channels in your server
                </CardTitle>
            </CardHeader>
            <div className="relative flex-grow overflow-hidden h-80">
                {/* Top fade effect */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

                <ScrollArea className="h-full w-full">
                    <div className="flex flex-col justify-end min-h-full space-y-4">
                        <AnimatePresence initial={false}>
                            {channels && channels.length > 0 && channels?.map((channel: any) => (
                                <motion.div
                                    key={channel.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-transparent p-3 border-b border-zinc-800"
                                >
                                    <div className="text-zinc-300 text-sm flex items-center justify-between gap-2">
                                        <div className="flex items-center font-semibold gap-2">
                                            <span className="text-wrap max-w-80 flex items-center gap-3"><MessageSquareDotIcon size={15} className="text-blue-500" /> #{channel.name}</span>
                                        </div>
                                        <div className="flex flex-row gap-1 text-xs items-center">
                                            {messages ? messages?.length > 0 && messages?.filter((m: any) => m.channel.id === channel.id).length + " messages" : <Loader2 className="animate-spin" size={15} />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {channels?.length <= 0 && (
                                <div className="flex justify-center items-center gap-2 text-zinc-400">
                                    <div className="my-4">There are no channels in your server.</div>
                                </div>
                            )}
                            {
                                !channels && (
                                    <div className="flex justify-center items-center gap-2 text-zinc-400">
                                        <div className="my-4">
                                            <Loader2 size={20} className="animate-spin" />
                                        </div>
                                    </div>
                                )
                            }
                        </AnimatePresence>
                        <div ref={bottomRef} />
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>


                {/* Bottom fade effect */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-900 to-transparent z-10 pointer-events-none" />
            </div>
        </Card>
    );
}