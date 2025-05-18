"use client"
import { LoginForm } from "@/components/login-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const user = useAuth();
  const router = useRouter();

  if (user.sessionId) {
    router.push("/app");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[url('/moddr-bkg.svg')] bg-cover bg-no-repeat p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 dark text-white">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md">
            <Avatar>
              <AvatarImage
                src={"/moddr-logo.svg"}
                alt="MODDR"
              />
            </Avatar>
          </div>
          MODDR
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
