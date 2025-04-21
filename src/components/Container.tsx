"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { User } from "@/app/session/[sessionId]/page";
import { capFirstLetter, userAvatar } from "../utils/format";
import Reactions from "./Reactions";
import { api } from "@/app/services/api";
import { RootState } from "@/state/redux";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentQuestion } from "@/state";

export type QuestionsProps = {
  questions: question[];
  users: User[];
 
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  
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
  reactions: Reaction[];
};

export type Reaction = {
  name: string;
  amount: number;
  sessionId: string;
  users: User[];
};

const Container = ({
  updateToNextUser,
  updateToNextQuestion,
  isFirstUser,
  sessionUser,
  sessionId,
  hostId,
}: QuestionsProps) => {
  const dispatch = useDispatch();
  const { currentQuestion, currentUser } = useSelector((state: RootState) => state.session);
  const [userReactions, setUserReactions] = useState<Record<string, Record<string, string[]>>>({});

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
        return;
      }

      dispatch(setCurrentQuestion({
        ...currentQuestion,
        reactions: updateReactions
      }));

      const foundReaction = updateReactions.find(
        (react) => react.name === reactionName
      );

      const reactionDetected =
        foundReaction?.users?.map((user) => user.id) ?? [];

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

  return (
    <section className="flex items-center justify-center px-1 md:px-2 lg:px-4 w-[348px] h-[100%] lg:w-full">
      <div className="max-w-[600px] w-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <Link href="/">
          {currentUser && (
            <div className="w-full h-[80px] sm:h-80px md-[90px] lg-[96px] mb-2">
              <Image
                src={userAvatar(currentUser.avatar)}
                width={100}
                height={100}
                alt="user"
                className="rounded-full cursor-pointer"
              />
            </div>
          )}
        </Link>

        {currentUser && (
          <h2 className="mt-6 md:mt-8 lg:mt-10 xl:mt-12 text-xl lg:text-2xl font-black text-center mb-2 lg:mb-4 xl:mb-6">
            {capFirstLetter(currentUser?.name)}
          </h2>
        )}

        <Reactions reactions={currentQuestion?.reactions} onReact={onReact} />

        {currentQuestion && (
          <div className="w-full">
            <h2 className="mt-6 md:text-lg lg:text-xl xl:text-2xl font-semibold p-3 text-center text-gray-800">
              {currentQuestion.name}
            </h2>
          </div>
        )}

        {isFirstUser && (
          <div className="w-full flex sm:flex-col items-center justify-center gap-4 mt-4 sm:mt-4 md:mt-6">
            <button
              onClick={updateToNextUser}
              className="w-[120px] h-[30px] sm:w-40 sm:h-10 font-semibold rounded-md bg-marine text-white lg:font-bold hover:bg-marine/80 transition"
            >
              Next User
            </button>

            <button
              onClick={updateToNextQuestion}
              className=" w-[120px] h-[30px] sm:w-40 sm:h-10 font-semibold rounded-md bg-greenblue text-white lg:font-bold hover:bg-greenblue/80 transition"
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
