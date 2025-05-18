"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { getDiscordUser } from "@/app/actions/getDiscordUser";
import { getUserGuilds } from "@/app/actions/getUserGuilds";
import { Avatar, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { useLoadingStore, useServerStore } from "@/lib/store/useLoadingStore";
import connectSocket from "@/app/actions/connectSocket";
import { toast } from "sonner";
import { socket } from "@/app/app/page";

export const ServerSwitcher = () => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [servers, setServers] = React.useState<any>();
    const router = useRouter();
    const setLoading = useLoadingStore((state) => state.setLoading);
    const setServerId = useServerStore((state) => state.setServerId);

    React.useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const discordData = await getDiscordUser();
            const guilds = await getUserGuilds(discordData?.id);
            setServers(guilds);

            const currentServer = window.localStorage.getItem("currentServerId");
            setValue(currentServer || "");
            if (currentServer) {
                setLoading(false);
            }
        };

        getData();
    }, []);

    const switchServer = async (serverId: any) => {
        setLoading(true); // Start loading
        setServerId(serverId);
        window.localStorage.setItem("currentServerId", serverId);

        const response = await connectSocket(serverId);
        socket.emit("joinGuild", serverId);

            if (response === 200) {
                toast.success("Connected to WebSocket API.")
            }

        // Add delay if needed for smooth animation:
        await new Promise((res) => setTimeout(res, 300));

        router.refresh();

        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timeout);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="bg-background text-white inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:text-white border-none truncate h-9 px-4 py-2 justify-between"
                >
                    {value ? (
                        <span className="relative flex shrink-0 overflow-hidden rounded-full mr-2 h-5 w-5">
                            <Image
                                width={5}
                                height={5}
                                src={`https://cdn.discordapp.com/icons/${servers?.find((s: any) => s.id === value)?.id}/${servers?.find((s: any) => s.id === value)?.icon}`}
                                className="w-full h-full object-contain"
                                alt={servers?.find((s: any) => s.id === value)?.name}
                            />
                        </span>
                    ) : (
                        ""
                    )}
                    <span className="max-w-sm truncate">
                        {value
                            ? servers?.find((s: any) => s.id === value)?.name
                            : "Select a server..."}
                    </span>
                    <ChevronsUpDown className="opacity-50 ml-auto" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 dark text-white" align="start">
                <Command className="bg-black border-zinc-900">
                    <CommandInput placeholder="Search servers..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No servers found.</CommandEmpty>
                        <CommandGroup>
                            {servers?.map((server: any) => (
                                <CommandItem
                                    key={server.id}
                                    value={server.id}
                                    onSelect={(currentValue: any) => {
                                        setValue(currentValue);
                                        switchServer(currentValue);
                                        setOpen(false);
                                    }}
                                    className="flex flex-row justify-between items-center gap-2"
                                >
                                    <span className="flex flex-row items-center gap-1">
                                        <Avatar>
                                            <AvatarImage
                                                src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}`}
                                                width={15}
                                                height={15}
                                                alt={server.name}
                                            />
                                        </Avatar>
                                        {server.name}
                                    </span>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === server.id ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
