"use client";

// 1. resolveria a reactions pra um usuario
// por dentro de questions
// e criar uma coisa chamada "current question", q tenha qm tah respondendo e os dados normais dela
// 1.1 fazer td sem a parte do sincrionismo, ou seja, testar atualizando kd um dos usuarios pra q tenha uma nova chamada
// 2. implementar um websocket pra comunicar as mudancas pra mais de um usuario


// passo 1: criar uma forma de indetificar a currentquestion
// passo 2: colocar a lista de usuarios que jah deram like em kd uma das reactions
// passo 3: checar se o usuario logado (ver no localstorage, achar ele no users), jah esta contido no array de users feito acima

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
  CurrentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  currentQuestion: question;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<question>>;
  updateToNextQuestion: () => void
  updateToNextUser:() => void
  currentUser: User;
  hostId: string;
  sessionUser: User;
};

export type question = {
  name: string;
  id: string;
  isCurrent?: boolean;
  reactions: {
    name: string;
    amount: number;
    UserReaction?: {
      user: {
        id: string;
        name: string;
      };
    }[];
  }[];
};

const Container = ({
  questions,
  currentQuestion,
  updateToNextUser,
  updateToNextQuestion,
  setCurrentUser,
  currentUser,
  users,
  sessionUser,
  sessionId,
  hostId,
}: QuestionsProps) => {
  const [reactionsByQuestion, setReactionsByQuestion] = useState<
    Record<string, Record<string, number>>
  >({});

  useEffect(() => {
    if (users.length > 0) {
      setCurrentUser(users[0]);
    }
  }, [users, setCurrentUser]);

  

  const handleNextUser = () => {
    if (!currentUser) {
      setCurrentUser(users[0]);
      return;
    }

    const currentIndex = users.findIndex((user) => user.id === currentUser.id);
    if (currentIndex !== -1 && currentIndex < users.length - 1) {
      setCurrentUser(users[currentIndex + 1]);
    } else {
      setCurrentUser(users[0]);
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

        {currentUser && (
          <h2 className="mt-6 text-xl font-black text-center">
            {capFirstLetter(currentUser?.name)}
          </h2>
        )}

        {sessionUser && (
          <Reactions
          questionId={currentQuestion?.id}
          reactions={reactionsByQuestion[currentQuestion.id] || {}}
          disabledReactions={
            userReactions[currentQuestion.id]?.[sessionUser] || []
          }
          sessionUserId={sessionUser.id}
          onReact={(reactionName: string) => {
            const questionId = currentQuestion.id;
            const userId = sessionUser.id;
        
      
        
            const alreadyReacted =
              userReactions[questionId]?.[userId]?.includes(reactionName);
            if (alreadyReacted) {
              setReactionsByQuestion((prev) => ({
                ...prev,
                [questionId]: {
                  ...prev[questionId],
                  [reactionName]: Math.max((prev[questionId]?.[reactionName] || 1) -1, 0)
                }
              }))
              
              setUserReactions((prev) => ({
                ...prev,
                [questionId]: {
                  ...prev[questionId],
                  [userId]: prev[questionId]?.[userId].filter((reac) => reac !== reactionName || [])
                }
              }))
            
            } else {
              setReactionsByQuestion((prev) => ({
                ...prev,
                [questionId]: {
                  ...prev[questionId],
                  [reactionName]: (prev[questionId]?.[reactionName] || 0) + 1,
                }
              }))

              setUserReactions((prev) => ({
                  ...prev,
                  [questionId]: {
                    ...prev[questionId],
                    [userId]: [...(prev[questionId]?.[userId] || {}, reactionName)]
                }
              }))
            }
        
          }}
        />
        )}
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
