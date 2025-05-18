"use client"
import Image from "next/image"
import { Card } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"
import { AudioWaveform, Circle, CircleMinus, CircleSlash, Command, GalleryVerticalEnd, Slash } from "lucide-react";
import { ServerSwitcher } from "./server-switcher";
import { UserButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import connectSocket from "@/app/actions/connectSocket";
import { toast } from "sonner";
import { useServerStore } from "@/lib/store/useLoadingStore";
import { socket } from "@/app/app/page";

export const ApplicationBar = () => {
    const serverId = useServerStore((state) => state.serverId);
    const setServerId = useServerStore((state) => state.setServerId);

    useEffect(() => {
        const connectToWS = async () => {
            const guildId = window.localStorage.getItem("currentServerId");
            if (guildId) {
                setServerId(guildId);

                const response = await connectSocket(guildId);
                socket.emit("joinGuild", guildId);

                if (response === 200) {
                toast.success("Connected to WebSocket API.")
            }
            }
        }
        connectToWS();
    }, [])

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
                    <UserButton />
                </div>
            </div>
        </Card>
    )
}