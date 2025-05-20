"use client"
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import socket from "../../socket";
import connectSocket from "../actions/connectSocket";
import { toast } from "sonner";

export default function AppPage() {
    const router = useRouter();
    const user = useAuth();

    if (!user.sessionId) {
        return router.push("/");
    }
    
    return null;
}