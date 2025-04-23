"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/session/[sessionId]/page";
import { capFirstLetter, userAvatar } from "../utils/format";
import Reactions from "./Reactions";
import { api } from "@/app/services/api";
import { RootState } from "@/state/redux";
import { useSelector } from "react-redux";
import ModifyQuestions from "./ModifyQuestion";

export type ContainerProps = {
  questions: question[];
  users: User[];
  updateToNextQuestion: () => void;
  updateToNextUser: () => void;
  isFirstUser: User;
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
  sessionUser,
  sessionId,
}: ContainerProps) => {
  const { data } = useSelector(
    (state: RootState) => state.session
  );

  const currentQuestion = data?.currentQuestion
  const currentUser = data?.currentUser
  const hostId = data?.hostId

  const onReact = async (reactionName: string) => {
    if (!sessionUser?.id || !currentQuestion?.id) {
      return;
    }

    try {
      await api.post(`/session/${sessionId}/toggle`, {
        userId: sessionUser?.id,
        questionId: currentQuestion?.id,
        reactionName: reactionName,
        sessionId: sessionId,
      });

    } catch (err) {
      console.log("unknown error:", err);
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
          <h2 className="mt-6 md:mt-8 lg:mt-8 text-xl lg:text-2xl font-black text-center mb-2 ">
            {capFirstLetter(currentUser?.name)}
          </h2>
        )}

        <Reactions reactions={currentQuestion?.reactions} onReact={onReact} />
        {currentQuestion && (
          <div className="w-full">
            <h2 className="mt-4 md:text-lg lg:text-xl xl:text-2xl font-semibold p-3 text-center text-gray-800 mb-2 lg:mb-4">
              {currentQuestion.name}
            </h2>
          </div>
        )}
        {hostId === sessionUser.id && <ModifyQuestions />}

        {hostId === sessionUser.id && (
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
