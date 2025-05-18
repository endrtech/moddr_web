"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import {
  MessageSquareDot,
  Pencil,
  MessageSquareOff,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { socket } from "../page";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import getGuildMessages from "@/app/actions/getGuildMessages";

export default function LiveFeed() {
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();

  useEffect(() => {
    const useSocket = async () => {
      const guildId = params.get("serverId");

      const getMessages = await getGuildMessages(guildId);
      setMessages(getMessages);

      if (!guildId) return;
      socket.emit("joinGuild", guildId);

      socket.on("newGuildMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        socket.off("guildUpdate", () => {
          socket.disconnect();
        });
      };
    }
    useSocket();
  }, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="p-0 w-full bg-zinc-900 border-zinc-800 rounded-none flex flex-col dark">
      <CardHeader className="p-2 h-4 border-b border-zinc-800">
        <CardTitle className="uppercase text-zinc-600 font-semibold text-sm">
          Live Feed
        </CardTitle>
      </CardHeader>
      <div className="relative flex-grow overflow-hidden h-80">
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-900 to-transparent z-10 pointer-events-none" />

        <ScrollArea className="h-full w-full">
          <div className="flex flex-col justify-end min-h-full space-y-4 p-3">
            <AnimatePresence initial={false}>
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-transparent p-2 border-b border-zinc-800"
                  >
                    <div className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                      <MessageSquareDot size={15} className="text-blue-500" />
                      New message!
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {msg.content || "New data received."}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex justify-center items-center gap-2 text-zinc-400">
                  <div className="my-4">No events received yet.</div>
                </div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-900 to-transparent z-10 pointer-events-none" />
      </div>
    </Card>
  );
}
