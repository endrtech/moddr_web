"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getGuildMessages from "@/app/actions/getGuildMessages";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Circle, CircleDashed, CircleMinus, CircleSlash, ClockFadingIcon, MessageSquareDot, ShieldAlert, TimerOff, UserMinus, UserPlus } from "lucide-react";
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
import getAllPresences from "@/app/actions/presence/getAllPresences";
import getPresence from "@/app/actions/presence/getPresence";
import updatePresence from "@/app/actions/presence/updatePresence";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { socket } from "../page";

export default function GuildActivity() {
    const [members, setMembers] = useState<any>();
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [presence, setPresence] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const guildId = useServerStore((state) => state.serverId);
    console.log(guildId);

    useEffect(() => {
        if (guildId) {
            const getData = async () => {
                const getCases = await getAllPresences(guildId);
                setMembers(getCases);
            }

            getData();

            const useSocket = async () => {
                if (!guildId) return;

                socket.on("newGuildTeamPresence", (data) => {
                    setMembers((prev: any) => [...prev, data]);
                });

                socket.on("updateGuildTeamPresence", (data) => {
                    setMembers((prev: any) =>
                        prev.map((item: any) =>
                            item.id === data.id ? { ...item, ...data } : item
                        )
                    );

                })

                return () => {
                    socket.off("guildUpdate", () => {
                        socket.disconnect();
                    });
                };
            }
            useSocket();
        }
    }, [guildId]);

    const setPresenceFn = async (presence: any) => {
        const user = await getDiscordUser();
        const server = window.localStorage.getItem("currentServerId");
        const response = await updatePresence(server, user?.id, presence)
        if (response) {
            setPresence(presence);
        }
    }

    useEffect(() => {
        const setPresenceData = async () => {
            const user = await getDiscordUser();
            const server = window.localStorage.getItem("currentServerId");
            const getPresenceData = await getPresence(server, user?.id);
            setPresence(getPresenceData.presence || "online")
        }
        setPresenceData();
    }, [presence])
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [members])

    return (

        <Card className="p-0 w-full bg-zinc-900 border-zinc-800 rounded-none flex flex-col dark">
            <CardHeader className="p-2 h-4 border-b border-zinc-800">
                <CardTitle className="-m-0.5 uppercase text-zinc-600 font-semibold text-sm flex flex-row items-center justify-between">
                    <span>Your team</span>
                    <div className="flex flex-row items-center justify-start gap-2 h-4">
                        <Select defaultValue={presence} onValueChange={(e) => setPresenceFn(e)}>
                            <SelectTrigger className="max-h-6 p-2 bg-background border-none">
                                <SelectValue placeholder="Select a status..." className="bg-transparent border-none" />
                            </SelectTrigger>
                            <SelectContent className="dark text-white">
                                <SelectItem value="online"><Circle size={5} className="text-green-500" /> Online</SelectItem>
                                <SelectItem value="away"><CircleSlash size={5} className="text-yellow-500" /> Away</SelectItem>
                                <SelectItem value="dnd"><CircleMinus size={5} className="text-red-500" /> Do not disturb</SelectItem>
                                <SelectItem value="offline"><Circle size={5} className="text-gray-500" /> Offline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardTitle>
            </CardHeader>
            {
                members && (
                    <div className="relative flex-grow overflow-hidden h-80">
                        {/* Top fade effect */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

                        <ScrollArea className="h-full w-full">
                            <div className="flex flex-col justify-end min-h-full space-y-4">
                                <AnimatePresence initial={false}>
                                    {members?.length > 0 && members?.map((member: any) => (
                                        <motion.div
                                            key={member.userID}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-transparent p-3 border-b border-zinc-800"
                                        >
                                            <div className="text-zinc-300 text-sm flex items-center justify-between gap-2">
                                                <div className="flex items-center font-semibold gap-2">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={member.user_info.avatarURL}
                                                            alt={member.user_info.username}
                                                        />
                                                    </Avatar>
                                                    <span className="text-wrap max-w-80">{member.user_info.globalName || member.user_info.username}</span>
                                                </div>
                                                <div className="flex flex-row gap-1 items-center">
                                                    {
                                                        member.presence === "offline"
                                                            ? <CircleDashed size={15} className="text-gray-500" />
                                                            : member.presence === "away"
                                                                ? <CircleSlash size={15} className="text-yellow-500" />
                                                                : member.presence === "dnd"
                                                                    ? <CircleMinus size={15} className="text-red-500" />
                                                                    : <Circle size={15} className="text-green-500" />
                                                    }
                                                    <span>
                                                        {
                                                            member.presence === "offline"
                                                                ? "Offline"
                                                                : member.presence === "away"
                                                                    ? "Away"
                                                                    : member.presence === "dnd"
                                                                        ? "Do not disturb"
                                                                        : "Online"
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {members?.length <= 0 && (
                                        <div className="flex justify-center items-center gap-2 text-zinc-400">
                                            <div className="my-4">There is no one on your team.</div>
                                        </div>
                                    )}
                                </AnimatePresence>
                                <div ref={bottomRef} />
                            </div>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>


                        {/* Bottom fade effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-900 to-transparent z-10 pointer-events-none" />
                    </div>
                )
            }
        </Card>
    );
}