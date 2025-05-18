"use client"
import Image from "next/image"
import { Card } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"
import { AudioWaveform, Circle, CircleDashed, CircleMinus, CircleSlash, Command, Dot, GalleryVerticalEnd, Slash } from "lucide-react";
import { ServerSwitcher } from "./server-switcher";
import { UserButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import connectSocket from "@/app/actions/connectSocket";
import { toast } from "sonner";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { socket } from "@/app/app/page";
import { Button } from "../ui/button";

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
                    {
                        status === "up" && (
                            <span className="text-green-500 text-sm font-semibold flex items-center gap-3"><Dot size={20} className="animate-pulse" /> WebSocket connected</span>
                        )
                    }
                    {
                        status !== "up" && (
                            <span className="text-orange-500 text-sm font-semibold flex items-center gap-3"><CircleDashed size={20} className="animate-pulse" /> WebSocket down <Button variant="link" className="text-orange-500 text-sm" onClick={() => connectToWS()}>Reconnect</Button></span>
                        )
                    }
                    <UserButton />
                </div>
            </div>
        </Card>
    )
}