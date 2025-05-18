// app/actions/getDiscordUser.ts
'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from 'next/headers';

export async function getDiscordUser() {
  const session = await auth();

  if (!session.userId) {
    return { message: "User not found" };
  }

  const provider = "discord";

  try {
    const clerkResponse = (await clerkClient()).users.getUserOauthAccessToken(session.userId, provider);

    const accessToken = (await clerkResponse).data[0]?.token;

    if (!accessToken) {
      return { message: "Access token not found" };
    }

    const discordResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!discordResponse.ok) {
      return { message: "Failed to fetch Discord user", status: discordResponse.status };
    }

    const discordData = await discordResponse.json();
    return discordData;
  } catch (err) {
    console.error("Error fetching Discord user:", err);
    return { message: "Internal server error" };
  }
}