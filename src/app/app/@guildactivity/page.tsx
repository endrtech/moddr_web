"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getGuildMessages from "@/app/actions/getGuildMessages";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, ClockFadingIcon, MailMinus, MailPlus, MessageSquareDot, MessageSquarePlus, UserMinus, UserPlus } from "lucide-react";
import { getCurrentGuildEvents } from "@/app/actions/getCurrentGuildEvents";
import moment from "moment";
import Loading from "../loading";
import { getDiscordUser } from "@/app/actions/getDiscordUser";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { socket } from "../page";

export default function GuildActivity() {
    const [auditLog, setAuditLog] = useState<any>();
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    const guildId = useServerStore((state) => state.serverId);
    console.log(guildId);

    useEffect(() => {
        if (guildId) {
            const getData = async () => {
                const getEvents = await getCurrentGuildEvents(guildId);
                setAuditLog(getEvents);
            }

            getData();

            const useSocket = async () => {
                if (!guildId) return;

                socket.on("newGuildEvent", (data) => {
                    setAuditLog((prev: any) => [...prev, data]);
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
    }, [auditLog])

    return (

        <Card className="p-0 w-full bg-zinc-900 border-zinc-800 rounded-none flex flex-col dark">
            <CardHeader className="p-2 h-4 border-b border-zinc-800">
                <CardTitle className="uppercase text-zinc-600 font-semibold text-sm">
                    Server activity
                </CardTitle>
            </CardHeader>
            {
                auditLog && (
                    <div className="relative flex-grow overflow-hidden h-80">
                        {/* Top fade effect */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

                        <ScrollArea className="h-full w-full">
                            <div className="flex flex-col justify-end min-h-full space-y-4">
                                <AnimatePresence initial={false}>
                                    {auditLog.length > 0 && auditLog?.map((message: any) => (
                                        <motion.div
                                            key={message._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-transparent p-3 border-b border-zinc-800"
                                        >
                                            <div className="text-zinc-300 text-sm flex items-center justify-between gap-2">
                                                <div className="flex items-center font-semibold gap-2">
                                                    {
                                                        message.eventType === "ban"
                                                            ? <Ban size={15} className="text-red-500" />
                                                            : message.eventType === "member_add"
                                                                ? <UserPlus size={15} className="text-green-500" />
                                                                : message.eventType === "member_remove"
                                                                    ? <UserMinus size={15} className="text-red-500" />
                                                                    : message.eventType == "member_timeout"
                                                                        ? <ClockFadingIcon size={15} className="text-orange-500" />
                                                                        : message.eventType == "channel_add"
                                                                        ? <MailPlus size={15} className="text-green-500" />
                                                                        : message.eventType == "channel_remove"
                                                                        ? <MailMinus size={15} className="text-red-500" />
                                                                        : ""
                                                    }
                                                    <span className="text-wrap max-w-80">{message.eventDescription}</span>
                                                </div>
                                                <div className="text-xs text-zinc-400">{moment(message.timestamp).format("DD/MM/YY, hh:mm a")}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {auditLog.length <= 0 && (
                                        <div className="flex justify-center items-center gap-2 text-zinc-400">
                                            <div className="my-4">There are no logs to view.</div>
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