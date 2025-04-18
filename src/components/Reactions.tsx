"use client";
import React from "react";

type ReactionsProps = {
  questionId: string;
  reactions: Record<string, number>;
  disabledReactions: string[];
  sessionUserId: string;
  onReact: (reactionName: string) => void
};

const getEmojiSymbol = (name: string) => {
  switch (name) {
    case "thumb":
      return "👍";
    case "laugh":
      return "😂";
    case "surprise":
      return "😮";
    case "heart":
      return "❤️";
    default:
      return "❓";
  }
};

const Reactions = ({
  onReact,
  reactions,
  disabledReactions,
}: ReactionsProps) => {
  return (
    <div className="flex gap-4 mt-4 flex-wrap justify-center">
      {Object.entries(reactions).map(([reactionName, count]) => {
        const isReacted = disabledReactions.includes(reactionName);

        return (
          <button
            key={reactionName}
            onClick={() => onReact(reactionName)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg transition font-medium ${
              isReacted
                ? "bg-blue-300 text-blue-900"
                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
            }`}
          >
            {getEmojiSymbol(reactionName)}
            <span className="text-sm">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Reactions;