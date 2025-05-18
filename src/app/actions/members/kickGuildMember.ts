"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function kickGuildMember(serverId: any, userId: any, body: any) {
  const sessionToken = (await cookies()).get("__session");
  const resp = await axios.post(
    `http://localhost:3030/api/guilds/${serverId}/members/${userId}/kick`,
    body,
    {
      headers: {
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    },
  );

  if (resp.status === 200) {
    return 200;
  } else {
    return 400;
  }
}
