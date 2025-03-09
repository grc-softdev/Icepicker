"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import user1 from "../app/assets/user1.webp";
import { User } from "@/app/session/[sessionId]/page";
import { capFirstLetter } from "../utils/format";

type QuestionsProps = {
  questions: question[];
  users: User[];
  selectedUser: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
};

type question = {
  name: string;
  id: string;
};

const Container = ({
  questions,
  users,
  selectedUser,
  setSelectedUser,
}: QuestionsProps) => {
  const [currQuestion, setCurrQuestion] = useState(0);

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, setSelectedUser]); // E

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
    <div className="w-full flex flex-col items-center min-h-screen border-l-2 border-neutral-200">
      <div className="flex items-center">
        <Link href={"/"}>
          <Image
            src={user1}
            width={100}
            height={100}
            alt="user"
            className="rounded-full cursor-pointer"
          />
        </Link>
      </div>

      {questions.length > 0 && (
        <div key={questions[currQuestion].id}>
          <h2 className="mt-10 text-2xl font-extrabold p-4 text-center">
            {questions[currQuestion].name}
          </h2>
        </div>
      )}

      <div className="w-full flex flex-col items-center">
        {selectedUser && (
          <h2 className="mt-6 text-xl font-black">
            {capFirstLetter(selectedUser.name)}
          </h2>
        )}
        <div
          onClick={handleNextUser}
          className="mt-20 w-36 h-10 rounded-md bg-marine flex items-center justify-center cursor-pointer hover:bg-marine/75 transition duration-300"
        >
          <span className="text-white font-bold">Next User</span>
        </div>
      </div>
      <div
        onClick={handleNextQuestion}
        className="mt-10 w-36 h-10 rounded-md bg-greenblue flex items-center justify-center cursor-pointer hover:bg-greenblue/75 transition duration-300"
      >
        <span className="text-white font-bold">Next Question</span>
      </div>
    </div>
  );
};

export default Container;
