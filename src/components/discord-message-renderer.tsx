import { parseDiscordContent } from "@/app/utils/transformDiscordContent";
import { Badge } from "@/components/ui/badge";

function formatMarkdown(text: string): React.ReactNode {
  // Bold (**text**)
  if (/^\*\*(.+)\*\*$/.test(text)) {
    const inner = text.match(/^\*\*(.+)\*\*$/)?.[1];
    return <strong>{inner}</strong>;
  }

  // Italic (*text*)
  if (/^\*(.+)\*$/.test(text)) {
    const inner = text.match(/^\*(.+)\*$/)?.[1];
    return <em>{inner}</em>;
  }

  // Inline code (`code`)
  if (/^`(.+)`$/.test(text)) {
    const inner = text.match(/^`(.+)`$/)?.[1];
    return (
      <code className="bg-zinc-800 text-zinc-300 px-1 rounded">{inner}</code>
    );
  }

  return text;
}


export function DiscordMessageRenderer({ content }: { content: string }) {
  const tokens = parseDiscordContent(content);

  return (
    <span className="flex flex-wrap items-center gap-x-1 gap-y-1 text-zinc-100">
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
                @{token.id}
              </Badge>
            );
          case "channel":
            return (
              <Badge
                key={i}
                variant="outline"
                className="text-blue-400 border-blue-400"
              >
                #{token.id}
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
            return <span key={i} className="text-sm text-zinc-400">{token.content}</span>;
        }
      })}
    </span>
  );
}

