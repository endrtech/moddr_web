"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getGuildMessages from "@/app/actions/getGuildMessages";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Delete, MessageSquareDot, MessageSquareOff, Pencil, ShieldAlert, TimerOff } from "lucide-react";
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
import { DiscordMessageRenderer } from "@/components/discord-message-renderer";
import { useSearchParams } from "next/navigation";
import { socket } from "../page";
import { useServerStore } from "@/lib/store/useLoadingStore";

export default function GuildActivity() {
    const [messages, setMessages] = useState<any>();
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const params = useSearchParams();
    const [warnReason, setWarnReason] = useState("");
    const [warnExpiry, setWarnExpiry] = useState("");
    const [currentUser, setCurrentUser] = useState<any>();
    const [timeoutReason, setTimeoutReason] = useState("");
    const [timeoutDuration, setTimeoutDuration] = useState("");
    const [timeoutTime, setTimeoutTime] = useState("");
    const [banReason, setBanReason] = useState("");
    const [deleteMsgDays, setDeleteMsgDays] = useState("");

    const guildId = useServerStore((state) => state.serverId);
    console.log(guildId);

    useEffect(() => {
        if (guildId) {
            const getData = async () => {
                const getMessages = await getGuildMessages(guildId);
                setMessages(getMessages);
                const getUser = await getDiscordUser();
                setCurrentUser(getUser);
            }

            getData();

            const useSocket = async () => {
                if (!guildId) return;

                socket.on("newGuildMessage", (data) => {
                    setMessages((prev: any) => [...prev, data]);
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
    }, [messages])

    const deleteMessageFn = async (serverId: any, message: any) => {
        const response = await deleteMessage(serverId, message.messageID);

        if (response === 200) {
            toast.success(`Deleted message ${message.content}.`);
        } else {
            toast.error(`Unable to delete message ${message.content}. If the issue persists, contact MODDR Support.`)
        }
    }

    const warnUser = async (serverId: any, message: any) => {
        const response = await warnGuildMember(serverId, message.author.id, {
            warnReason: warnReason,
            createdById: currentUser.id,
            warnTimestamp: warnExpiry,
        });

        if (response.status === 200) {
            toast.success(`Warned user ${message.author.globalName || message.author.username}.`, {
                action: {
                    label: "Open in MYMOD",
                    onClick: () => {
                        window.open(`https://mymod.endr.tech/:d:/app/server/${message.guildID}/cases/${response.caseID}`, "_blank");
                    }
                }
            });
        } else {
            toast.error(`${response} If the issue persists, contact MODDR Support.`)
        }
    }

    const timeoutUser = async (serverId: any, message: any) => {
        const response = await timeoutGuildMember(
            serverId,
            message.author.id,
            {
                timeoutReason: timeoutReason,
                createdById: currentUser.id,
                timeoutDuration: timeoutDuration,
                timeoutTime: timeoutTime,
            },
        );

        if (response.status === 200) {
            toast.success(`Timed out user ${message.author.globalName || message.author.username}.`, {
                action: {
                    label: "Open in MYMOD",
                    onClick: () => {
                        window.open(`https://mymod.endr.tech/:d:/app/server/${message.guildID}/cases/${response.caseID}`, "_blank");
                    }
                }
            });
        } else {
            toast.error(`${response} If the issue persists, contact MODDR Support.`)
        }
    }

    const banUser = async (serverId: any, message: any) => {
        const response = await banGuildMember(
            serverId,
            message.author.id,
            {
                banReason: banReason,
                createdById: currentUser.id,
                deleteMsgDays: deleteMsgDays,
            },
        );

        if (response !== 400) {
            toast.success(`Banned user ${message.author.globalName || message.author.username}.`, {
                action: {
                    label: "Open in MYMOD",
                    onClick: () => {
                        window.open(`https://mymod.endr.tech/:d:/app/server/${serverId}/cases/${response.caseID}`, "_blank");
                    }
                }
            });
        } else {
            toast.error(`${response} If the issue persists, contact MODDR Support.`)
        }
    }

    return (
        <Card className="p-0 w-full bg-zinc-900 border-zinc-800 rounded-none flex flex-col dark">
            <CardHeader className="p-2 h-4 border-b border-zinc-800">
                <CardTitle className="uppercase text-zinc-600 font-semibold text-sm">
                    Message activity
                </CardTitle>
            </CardHeader>
            <div className="relative flex-grow overflow-hidden h-80">
                {/* Top fade effect */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

                <ScrollArea className="h-full w-full">
                    <div className="flex flex-col justify-end min-h-full space-y-4">
                        <AnimatePresence initial={false}>
                            {messages?.length > 0 && messages?.map((message: any) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-transparent p-3 border-b border-zinc-800"
                                >
                                    <div className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                                        {
                                            message.messageType === "update"
                                                ? <Pencil size={15} className="text-orange-500" />
                                                : message.messageType === "delete"
                                                    ? <MessageSquareOff size={15} className="text-red-500" />
                                                    : <MessageSquareDot size={15} className="text-blue-500" />
                                        }
                                        {message.messageType === "update" ? "Message edited" : message.messageType === "delete" ? "Messaged deleted" : "New message"} in #{message.channel.name}
                                    </div>
                                    <div className="flex flex-col items-start gap-2 text-zinc-400">
                                        <div>
                                            <DiscordMessageRenderer content={message.content} />
                                        </div>
                                        <div className="self-end flex flex-row items-center gap-2 text-xs">
                                            <div>{moment(new Date(message.createdAt)).format("DD/MM/YY, hh:mm a")}</div>
                                            <div>•</div>
                                            <div>{message.author.globalName || message.author.username}</div>
                                            <div>•</div>
                                            <div className="flex flex-row gap-1 items-center">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <span>
                                                                        <Ban size={15} className="text-red-500" />
                                                                    </span>
                                                                </DialogTrigger>
                                                                <DialogContent className="dark text-white">
                                                                    <DialogTitle>Ban {message.author.globalName || message.author.username}</DialogTitle>
                                                                    <DialogDescription>Ban this member using this form. Bans submitted via MODDR will automatically create a case in MYMOD.</DialogDescription>
                                                                    <div className="flex flex-col gap-2">
                                                                        <Label>Whats the reason for the ban?</Label>
                                                                        <Input type='text' name="warnReason" value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="e.g: inappropriate message" />
                                                                        <br />
                                                                        <Label>How many days of messages do you want to delete?</Label>
                                                                        <Input type='text' name="warnReason" value={deleteMsgDays} onChange={(e) => setDeleteMsgDays(e.target.value)} placeholder="Enter 1 - 7." />
                                                                        <br />
                                                                        <Button variant="outline" className="dark text-white w-auto self-end" onClick={() => banUser(window.localStorage.getItem("currentServerId"), message)}>Ban {message.author.globalName || message.author.username}</Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Ban {message.author.globalName || message.author.username}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <span>
                                                                        <ShieldAlert size={15} className="text-yellow-500" />
                                                                    </span>
                                                                </DialogTrigger>
                                                                <DialogContent className="dark text-white">
                                                                    <DialogTitle>Warn {message.author.globalName || message.author.username}</DialogTitle>
                                                                    <DialogDescription>Warn this member using this form. Warns submitted via MODDR will automatically create a case in MYMOD.</DialogDescription>
                                                                    <div className="flex flex-col gap-2">
                                                                        <Label>Whats the reason for the warn?</Label>
                                                                        <Input type='text' name="warnReason" value={warnReason} onChange={(e) => setWarnReason(e.target.value)} placeholder="e.g: inappropriate message" />
                                                                        <br />
                                                                        <Label>When do you want the warn to expire?</Label>
                                                                        <DatePicker onChange={(timestamp) => setWarnExpiry(timestamp)} />
                                                                        <br />
                                                                        <Button variant="outline" className="dark text-white w-auto self-end" onClick={() => warnUser(message.guildID, message)}>Warn {message.author.globalName || message.author.username}</Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Warn {message.author.globalName || message.author.username}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <span>
                                                                        <TimerOff size={15} className="text-gray-500" />
                                                                    </span>
                                                                </DialogTrigger>
                                                                <DialogContent className="dark text-white z-[999]">
                                                                    <DialogTitle>Timeout {message.author.globalName || message.author.username}</DialogTitle>
                                                                    <DialogDescription>Timeout this member using this form. Timeouts submitted via MODDR will automatically create a case in MYMOD.</DialogDescription>
                                                                    <div className="flex flex-col gap-2">
                                                                        <Label>Whats the reason for the timeout?</Label>
                                                                        <Input type='text' name="warnReason" value={timeoutReason} onChange={(e) => setTimeoutReason(e.target.value)} placeholder="e.g: inappropriate message" />
                                                                        <br />
                                                                        <Label>When do you want the timeout to expire?</Label>
                                                                        <div className="flex flex-row items-center w-full gap-1">
                                                                            <Input
                                                                                value={timeoutDuration}
                                                                                onChange={(e) => setTimeoutDuration(e.target.value)}
                                                                                placeholder="e.g: 2"
                                                                                className="w-full text-white"
                                                                            />
                                                                            <DurationUnitSelect
                                                                                value={timeoutTime}
                                                                                onChange={setTimeoutTime}
                                                                            />
                                                                            <input
                                                                                hidden
                                                                                readOnly
                                                                                name="timeoutTime"
                                                                                value={timeoutTime}
                                                                            />
                                                                        </div>
                                                                        <br />
                                                                        <Button variant="outline" className="dark text-white w-auto self-end" onClick={() => timeoutUser(message.guildID, message)}>Timeout {message.author.globalName || message.author.username}</Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Timeout {message.author.globalName || message.author.username}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {
                                                    message.messageType !== "delete" && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <span onClick={() => deleteMessageFn(message.guildID, message)}>
                                                                        <Delete size={15} className="text-red-500" />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Delete message
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {messages?.length <= 0 && (
                                <div className="flex justify-center items-center gap-2 text-zinc-400">
                                    <div className="my-4">There are no messages to view.</div>
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
