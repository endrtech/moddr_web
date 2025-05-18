export type DiscordToken =
  | { type: "text"; content: string }
  | { type: "emoji"; name: string; id: string; animated: boolean }
  | { type: "mention"; id: string }
  | { type: "channel"; id: string }
  | { type: "image"; url: string }
  | { type: "link"; url: string };

export function parseDiscordContent(content: string): DiscordToken[] {
  const tokens: DiscordToken[] = [];

  const regex =
    /\\(<a?:\w{1,32}:\d{17,20}>)|<(?<animated>a?):(?<name>\w{1,32}):(?<id>\d{17,20})>|<@(?<mentionId>\d+)>|<#(?<channelId>\d+)>|(?<url>https?:\/\/[^\s]+)|(?<text>[^\s]+)/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const { groups } = match as any;

    if (match[1]) {
      // Escaped emoji
      tokens.push({ type: "text", content: match[1] });
    } else if (groups?.id) {
      tokens.push({
        type: "emoji",
        name: groups.name,
        id: groups.id,
        animated: !!groups.animated,
      });
    } else if (groups?.mentionId) {
      tokens.push({ type: "mention", id: groups.mentionId });
    } else if (groups?.channelId) {
      tokens.push({ type: "channel", id: groups.channelId });
    } else if (groups?.url) {
      const isImage = /\.(png|jpe?g|gif|webp)$/i.test(groups.url);
      tokens.push({ type: isImage ? "image" : "link", url: groups.url });
    } else if (groups?.text) {
      tokens.push({ type: "text", content: groups.text });
    }
  }

  return tokens;
}
