"use client"
import Image from "next/image"
import { Card } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"
import { AudioWaveform, Circle, CircleDashed, CircleMinus, CircleSlash, Command, Dot, GalleryVerticalEnd, Slash, Wifi, WifiOff } from "lucide-react";
import { ServerSwitcher } from "./server-switcher";
import { UserButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import connectSocket from "@/app/actions/connectSocket";
import { toast } from "sonner";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { socket } from "@/app/app/page";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const ApplicationBar = () => {
    const serverId = useServerStore((state) => state.serverId);
    const setServerId = useServerStore((state) => state.setServerId);
    const [status, setStatus] = useState("unknown");
    const heartbeatTimeout = useRef<NodeJS.Timeout | null>(null);

    const connectToWS = async () => {
        const guildId = window.localStorage.getItem("currentServerId");
        if (guildId) {
            setServerId(guildId);

            const response = await connectSocket(guildId);
            socket.emit("joinGuild", guildId);
            socket.emit("heartbeat", guildId);

            if (response === 200) {
                toast.success("Connected to WebSocket API.")
            }
        }
    }

    useEffect(() => {
        connectToWS();
    }, [])


    useEffect(() => {
        const handleHeartbeat = (newStatus: string) => {
            setStatus(newStatus);

            // Reset the timeout every time we receive a heartbeat
            if (heartbeatTimeout.current) clearTimeout(heartbeatTimeout.current);

            heartbeatTimeout.current = setTimeout(() => {
                // If no heartbeat received in 60s, mark as down
                setStatus("down");
            }, 60000);
        };

        socket.on("heartbeat", handleHeartbeat);

        return () => {
            socket.off("heartbeat", handleHeartbeat);
            if (heartbeatTimeout.current) clearTimeout(heartbeatTimeout.current);
        };
    }, []);

    return (
        <Card className="p-1 rounded-none w-full h-12 bg-background text-white dark border-none border-b-1 border-b-muted">
            <div className="flex px-2 flex-row items-center justify-start gap-4 h-12">
                <Avatar className="w-[30px] h-[30px]">
                    <AvatarImage
                        src={"/moddr-logo.svg"}
                        alt="MODDR"
                    />
                </Avatar>
                <Slash size={15} className="text-zinc-600" />
                <ServerSwitcher />
                <div className="ml-auto flex items-center gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="dark cursor-pointer" onClick={() => connectToWS()}>
                                    {status === "up" ? <Wifi className="animate-pulse text-green-500" /> : <WifiOff size={15} className="text-orange-500" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {status === "up" ? "Connected to WebSocket API." : "WebSocket connection is down. Try reconnecting."}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <UserButton />
                </div>
            </div>
        </Card>
    )
}