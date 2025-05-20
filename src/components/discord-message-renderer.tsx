import { parseDiscordContent, DiscordToken } from "@/app/utils/transformDiscordContent";
import { Badge } from "@/components/ui/badge";

function formatMarkdown(text: string): React.ReactNode {
  if (/^\*\*(.+)\*\*$/.test(text)) {
    const inner = text.match(/^\*\*(.+)\*\*$/)?.[1];
    return <strong>{inner}</strong>;
  }

  if (/^\*(.+)\*$/.test(text)) {
    const inner = text.match(/^\*(.+)\*$/)?.[1];
    return <em>{inner}</em>;
  }

  if (/^`(.+)`$/.test(text)) {
    const inner = text.match(/^`(.+)`$/)?.[1];
    return <code className="bg-zinc-800 text-zinc-300 px-1 rounded">{inner}</code>;
  }

  return text;
}

type MentionContext = {
  users?: { id: string; name: string }[];
  roles?: { id: string; name: string }[];
  channels?: { id: string; name: string }[];
};

export function DiscordMessageRenderer({
  content,
  mentions,
  attachments
}: {
  content: string;
  mentions?: MentionContext;
  attachments?: { url: string; contentType?: string; name?: string }[];
}) {
  const tokens = parseDiscordContent(content);

  const resolveMentionName = (id: string, type: "user" | "role" | "channel") => {
    const group = mentions?.[`${type}s` as keyof MentionContext];
    const item = group?.find((item) => item.id === id);
    return item?.name || id;
  };

  return (
    <div className="flex flex-col gap-1 text-zinc-100">
      <span className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {tokens.map((token, i) => {
          switch (token.type) {
            case "emoji":
              return (
                <img
                  key={i}
                  src={`https://cdn.discordapp.com/emojis/${token.id}.${
                    token.animated ? "gif" : "webp"
                  }`}
                  alt={`:${token.name}:`}
                  className="inline h-5 w-5 align-middle"
                />
              );
            case "mention":
              return (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-blue-400 border-blue-400"
                >
                  @{resolveMentionName(token.id, "user")}
                </Badge>
              );
            case "channel":
              return (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-blue-400 border-blue-400"
                >
                  #{resolveMentionName(token.id, "channel")}
                </Badge>
              );
            case "image":
              return (
                <img
                  key={i}
                  src={token.url}
                  alt=""
                  className="max-h-[150px] rounded object-contain"
                />
              );
            case "link":
              return (
                <a
                  key={i}
                  href={token.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline break-all"
                >
                  {token.url}
                </a>
              );
            case "text":
              return (
                <span key={i} className="text-sm text-zinc-400">
                  {formatMarkdown(token.content)}
                </span>
              );
          }
        })}
      </span>

      {/* Render attachments */}
      {attachments &&
        attachments.map((attachment, idx) => {
          const isImage = attachment.contentType?.startsWith("image/");
          if (isImage) {
            return (
              <img
                key={`att-${idx}`}
                src={attachment.url}
                alt={attachment.name || ""}
                className="max-h-[300px] rounded"
              />
            );
          }
          return (
            <a
              key={`att-${idx}`}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline"
            >
              📎 {attachment.name || attachment.url}
            </a>
          );
        })}
    </div>
  );
}
