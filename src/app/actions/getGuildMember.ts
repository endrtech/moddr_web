"use server";
import axios from "axios";
import { cookies } from "next/headers";

export async function getGuildMember(serverId: string, memberId: string) {
  const sessionToken = (await cookies()).get("__session");
  const resp = await axios.get(
    `http://localhost:3030/api/guilds/${serverId}/members/${memberId}`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken?.value}`,
      },
    },
  );

  if (resp.status === 200) {
    return resp.data;
  } else {
    return 404;
  }
}
