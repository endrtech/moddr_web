"use server";
import axios from "axios";
import { cookies } from "next/headers";

export default async function updatePresence(serverId: any, userId: any, presence: any) {
  const sessionToken = (await cookies()).get("__session");
  const resp = await axios.get(
    `http://localhost:3030/api/guilds/${serverId}/presence/${userId}/update?presence=${presence}`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    },
  );

  if (resp.status === 200) {
    return resp.data;
  } else {
    return 400;
  }
}
