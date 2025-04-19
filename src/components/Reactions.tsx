"use client";
import { Reaction } from "./Container";

type ReactionsProps = {
  questionId: string;
  reactions: Reaction[];
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

const emojiOrder = ["thumb", "laugh", "surprise", "heart"];

const Reactions = ({
  onReact,
  reactions,
}: ReactionsProps) => {

  const sortedReactions = reactions?.sort((a,b) => emojiOrder.indexOf(a.name) - emojiOrder.indexOf(b.name))
    
  return (
    <div className="flex gap-4 mt-4 flex-wrap justify-center">
      {sortedReactions?.map((reaction) => {

        return (
          <button
            key={reaction.name}
            onClick={() => onReact(reaction.name)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-lg transition font-medium bg-background text-blue-900"
            
          >
            {getEmojiSymbol(reaction.name)}
            <span className="text-sm">{reaction.amount}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Reactions;