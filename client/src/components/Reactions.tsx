"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Reaction } from "./Container";
import { useState } from "react";

type ReactionsProps = {
  reactions: Reaction[];
  onReact: (reactionName: string) => void;
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

const Reactions = ({ onReact, reactions }: ReactionsProps) => {
  const [reactedEmoji, setReactedEmoji] = useState<
    { id: number; emoji: string }[]
  >([]);

  const handleReact = (reactionName: string) => {
    onReact(reactionName);

    const emoji = getEmojiSymbol(reactionName);
    const id = Date.now();

    setReactedEmoji((prev) => [...prev, { id, emoji }]);

    setTimeout(() => {
      setReactedEmoji((prev) => prev.filter((item) => item.id !== id));
    }, 1500);
  };

  const sortedReactions = [...(reactions ?? [])].sort(
    (a, b) => emojiOrder.indexOf(a.name) - emojiOrder.indexOf(b.name)
  );

  return (
    <div className="relative">
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {reactedEmoji.map(({ id, emoji }) => (
            <motion.div
              key={id}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{ y: -100, opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 text-3xl"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        {sortedReactions?.map((reaction) => {
          return (
            <button
              key={reaction.name}
              onClick={() => handleReact(reaction.name)}
              className="flex items-center gap-2 px-4 md:py-2 rounded-full shadow-md text-lg transition font-medium bg-background dark:bg-blue-950 text-blue-900"
            >
              {getEmojiSymbol(reaction.name)}
              <span className="text-sm dark:text-white">{reaction.amount}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Reactions;
