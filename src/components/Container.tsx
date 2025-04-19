"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import user1 from "../app/assets/user1.webp";
import { User } from "@/app/session/[sessionId]/page";
import { capFirstLetter } from "../utils/format";
import Reactions from "./Reactions";
import { api } from "@/app/services/api";

export type QuestionsProps = {
  questions: question[];
  users: User[];
  CurrentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  currentQuestion: question;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<question>>;
  updateToNextQuestion: () => void;
  updateToNextUser: () => void;
  currentUser: User;
  hostId: string;
  sessionUser: User;
  sessionId: string;
};

export type question = {
  name: string;
  id: string;
  isCurrent?: boolean;
  reactions: Reaction[];
};

export type Reaction = {
  name: string;
  amount: number;
  sessionId: string;
  users: User[];
};

const Container = ({
  currentQuestion,
  setCurrentQuestion,
  updateToNextUser,
  updateToNextQuestion,
  currentUser,
  sessionUser,
  sessionId,
  hostId,
}: QuestionsProps) => {
  const [userReactions, setUserReactions] = useState<
    Record<string, Record<string, string[]>>
  >({});

  const onReact = async (reactionName: string) => {
    if (!sessionUser?.id || !currentQuestion?.id) {
      return;
    }

    try {
      const res = await api.post(`/session/${sessionId}/toggle`, {
        userId: sessionUser?.id,
        questionId: currentQuestion?.id,
        reactionName: reactionName,
        sessionId: sessionId,
      });

      const updateReactions = res?.data?.reactions;

      if (!Array.isArray(updateReactions)) {
        console.error("updateReactions não é um array:", updateReactions);
        return;
      }

      setCurrentQuestion((prev) => ({
        ...prev,
        reactions: updateReactions,
      }));

      const foundReaction = updateReactions.find(
        (react) => react.name === reactionName
      );

      const reactionDetected = foundReaction?.users?.map((usr) => usr.id) ?? [];

      setUserReactions((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          [sessionUser.id]: reactionDetected,
        },
      }));
    } catch (err) {
      console.error("Erro desconhecido:", err);
    }
  };

  console.log(currentUser)

  const BASE_URL = process.env.NEXT_PUBLIC_API
  const imagePath = '/files' + currentUser.avatar
  const imageURL = BASE_URL + imagePath
  return (
    <section className="flex items-center justify-center lg:mt-[-90px] py-10 px-4 w-full">
      <div className="max-w-md w-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <Link href="/">
         {currentUser &&(<Image
            src={imageURL}
            width={80}
            height={80}
            alt="user"
            className="rounded-full cursor-pointer"
          />)}
        </Link>

        {currentUser && (
          <h2 className="mt-6 text-xl font-black text-center">
            {capFirstLetter(currentUser?.name)}
          </h2>
        )}

        <Reactions
          questionId={currentQuestion?.id}
          reactions={currentQuestion?.reactions}
          onReact={onReact}
        />

        {currentQuestion && (
          <div className="w-full">
            <h2 className="mt-8 text-lg font-semibold p-4 text-center text-gray-800">
              {currentQuestion.name}
            </h2>
          </div>
        )}

        {hostId && (
          <div className="w-full flex flex-col items-center gap-4 mt-6">
            <button
              onClick={updateToNextUser}
              className="w-40 h-10 rounded-md bg-marine text-white font-bold hover:bg-marine/80 transition"
            >
              Next User
            </button>

            <button
              onClick={updateToNextQuestion}
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
