"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getGuildMessages from "@/app/actions/getGuildMessages";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Briefcase, Delete, MessageSquareDot, MessageSquareOff, Pencil, ShieldAlert, TimerOff } from "lucide-react";
import moment from "moment";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import deleteMessage from "@/app/actions/messages/deleteMessage";
import { toast } from "sonner";
import { banGuildMember } from "@/app/actions/members/banGuildMember";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { warnGuildMember } from "@/app/actions/members/warnGuildMember";
import { getDiscordUser } from "@/app/actions/getDiscordUser";
import { timeoutGuildMember } from "@/app/actions/members/timeoutGuildMember";
import DurationUnitSelect from "@/components/DurationUnitSelect";
import getGuildCases from "@/app/actions/getGuildCases";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { socket } from "../page";

export default function GuildActivity() {
    const [cases, setCases] = useState<any>();
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [currentUser, setCurrentUser] = useState<any>();

    const guildId = useServerStore((state) => state.serverId);
    console.log(guildId);

    useEffect(() => {
        if (guildId) {
            const getData = async () => {
                const getCases = await getGuildCases(guildId);
                setCases(getCases);
                const getCurrentUser = await getDiscordUser();
                setCurrentUser(getCurrentUser);
            }

            getData();

            const useSocket = async () => {
                if (!guildId) return;

                socket.on("newCase", (data) => {
                    setCases((prev: any) => [...prev, data]);
                });

                return () => {
                    socket.off("guildUpdate", () => {
                        socket.disconnect();
                    });
                };
            }
            useSocket();
        }
    }, [guildId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [cases])

    return (
        <Card className="p-0 w-full bg-zinc-900 border-zinc-800 rounded-none flex flex-col dark">
            <CardHeader className="p-2 h-4 border-b border-zinc-800">
                <CardTitle className="uppercase text-zinc-600 font-semibold text-sm">
                    New cases
                </CardTitle>
            </CardHeader>
            <div className="relative flex-grow overflow-hidden h-80">
                {/* Top fade effect */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

                <ScrollArea className="h-full w-full">
                    <div className="flex flex-col justify-end min-h-full space-y-4">
                        <AnimatePresence initial={false}>
                            {cases?.length > 0 && cases?.map((message: any) => (
                                <motion.div
                                    key={message.caseID}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-transparent p-3 border-b border-zinc-800"
                                >
                                    <div className="font-semibold text-zinc-300 flex items-center gap-2">
                                        <Briefcase size={15} className="text-blue-500" />
                                        Case created for {message.user_info.globalName || message.user_info.username}
                                    </div>
                                    <div className="flex justify-between items-center gap-2 text-zinc-400">
                                        <div>Reason: {message.case_info.case_reason}</div>
                                        <div className="flex flex-row items-center gap-2 text-xs">
                                            <div>Case ID: <a href={`https://mymod.endr.tech/:d:/app/server/${message.guildID}/cases/${message.caseID}`} target="_blank" className="hover:underline hover:text-white">{message.caseID}</a></div>
                                            <div>•</div>
                                            <div>{message.assignee_info.globalName || message.assignee_info.username}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {cases?.length <= 0 && (
                                <div className="flex justify-center items-center gap-2 text-zinc-400">
                                    <div className="my-4">There are no cases to view.</div>
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
        </Card>
    );
}
