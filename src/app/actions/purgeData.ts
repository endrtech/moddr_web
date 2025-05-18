"use server";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export async function purgeData(guildId: string) {
  const sessionToken = (await cookies()).get("__session");
  try {
    const resp: AxiosResponse = await axios.get(
      `https://api.mymod.endr.tech/api/guilds/${guildId}/moddr/purge`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken?.value}`,
        },
      },
    );

    if (resp.status === 200) {
      return 200;
    }

    // Optional: handle other non-200 cases
    return 400;
  } catch (error: any) {
    // Customize the return based on error status if needed
    if (error.response?.status === 500) {
      return 500;
    }

    return 400;
  }
}
