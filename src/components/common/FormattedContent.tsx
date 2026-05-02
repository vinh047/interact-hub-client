import React from "react";
import { Link } from "react-router-dom";

export default function FormattedContent({ content }: { content: string }) {
  // Regex bóc tách hashtag hỗ trợ tiếng Việt có dấu
  const parts = content.split(/(#[\p{L}\p{N}_]+)/gu);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("#")) {
          const tag = part.slice(1);
          return (
            <Link
              key={index}
              to={`/hashtag/${tag}`}
              className="text-blue-600 hover:underline font-medium relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        // Text bình thường thì giữ nguyên, bọc React.Fragment để cấp key
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}
