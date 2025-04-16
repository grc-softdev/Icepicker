"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import user1 from "../app/assets/user1.webp";
import { User } from "@/app/session/[sessionId]/page";
import { capFirstLetter } from "../utils/format";
import Reactions from "./Reactions";

export type QuestionsProps = {
  questions: question[];
  users: User[];
  selectedUser: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
  hostId: string;
  sessionUser: string;
};

export type question = {
  name: string;
  id: string;
  reactions: { name: string; amount: number }[];
};

const Container = ({
  questions,
  users,
  selectedUser,
  setSelectedUser,
  sessionUser,
  hostId,
}: QuestionsProps) => {
  const [currQuestion, setCurrQuestion] = useState(0);
  const [reactionsByQuestion, setReactionsByQuestion] = useState<
    Record<string, Record<string, number>>
  >({});
  const [userReactions, setUserReactions] = useState<
    Record<string, Record<string, string[]>>
  >({});

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, setSelectedUser]);

  useEffect(() => {
    const initialReactions = {};
    questions.forEach((question) => {
      initialReactions[question.id] = {};
      question.reactions.forEach((reaction) => {
        initialReactions[question.id][reaction.name] = reaction.amount;
      });
    });
    setReactionsByQuestion(initialReactions);
  }, [questions]);

  const handleNextQuestion = () => {
    setCurrQuestion((prevState) => (prevState + 1) % questions.length);
  };

  const handleNextUser = () => {
    if (!selectedUser) {
      setSelectedUser(users[0]);
      return;
    }

    const currentIndex = users.findIndex((user) => user.id === selectedUser.id);
    if (currentIndex !== -1 && currentIndex < users.length - 1) {
      setSelectedUser(users[currentIndex + 1]);
    } else {
      setSelectedUser(users[0]);
    }
  };

  return (
    <section className="flex items-center justify-center lg:mt-[-90px] py-10 px-4 w-full">
      <div className="max-w-md w-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <Link href="/">
          <Image
            src={user1}
            width={80}
            height={80}
            alt="user"
            className="rounded-full cursor-pointer"
          />
        </Link>

        {selectedUser && (
          <h2 className="mt-6 text-xl font-black text-center">
            {capFirstLetter(selectedUser?.name)}
          </h2>
        )}

        {selectedUser && (
          <Reactions
            questionId={questions[currQuestion].id}
            reactions={reactionsByQuestion[questions[currQuestion].id] || {}}
            disabledReactions={
              userReactions[questions[currQuestion].id]?.[selectedUser.id] || []
            }
            onReact={(reactionName: ReactionName) => {
              const questionId = questions[currQuestion].id;
              const userId = selectedUser.id;

              if(sessionUser.id !== userId) return
             
              const alreadyReacted =
                userReactions[questionId]?.[userId]?.includes(reactionName);
              if (alreadyReacted) return;

              
              setReactionsByQuestion((prev) => ({
                ...prev,
                [questionId]: {
                  ...prev[questionId],
                  [reactionName]: (prev[questionId]?.[reactionName] || 0) + 1,
                },
              }));

              
              setUserReactions((prev) => ({
                ...prev,
                [questionId]: {
                  ...prev[questionId],
                  [userId]: [
                    ...(prev[questionId]?.[userId] || []),
                    reactionName,
                  ],
                },
              }));
            }}
          />
        )}
        {questions.length > 0 && (
          <div key={questions[currQuestion].id} className="w-full">
            <h2 className="mt-8 text-lg font-semibold p-4 text-center text-gray-800">
              {questions[currQuestion].name}
            </h2>
          </div>
        )}

        {hostId && (
          <div className="w-full flex flex-col items-center gap-4 mt-6">
            <button
              onClick={handleNextUser}
              className="w-40 h-10 rounded-md bg-marine text-white font-bold hover:bg-marine/80 transition"
            >
              Next User
            </button>

            <button
              onClick={handleNextQuestion}
              className="w-40 h-10 rounded-md bg-greenblue text-white font-bold hover:bg-greenblue/80 transition"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Container;
