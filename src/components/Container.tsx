"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { User } from "./Users";
import { capFirstLetter } from "../utils/format"

type QuestionsProps = {
  questions: question[];
  users: User[]
};

type question = {
  name: string;
  id: string;
};

const Container = ({ questions, users }: QuestionsProps) => {
  const [currQuestion, setCurrQuestion] = useState(0);

  const handleNextQuestion = () => {
    setCurrQuestion((prevState) => (prevState + 1) % questions.length);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen border-r-2 border-neutral-200">
      <div className="flex mt-10 items-center justify-center cursor-pointer">
        <Link href={"/"}>
          <Image
            src={"https://i.imgur.com/OZ1YruF.png"}
            width={100}
            height={100}
            alt="user"
            className="rounded-full cursor-pointer"
          />
        </Link>
      </div>
    
      {users.map((userName) => (
        <h2 className='mt-10 text-xl font-black' key={userName.id}>{capFirstLetter(userName.name)}</h2>
      ))}
      
      {questions.length > 0 && (
        <div key={questions[currQuestion].id}>
          <h2 className="mt-10 text-2xl font-extrabold p-4 text-center">
            {questions[currQuestion].name}
          </h2>
        </div>
      )}

      <div className="mt-10 w-24 h-10 rounded-md bg-neutral-200 flex items-center justify-center">
        <span className="font-medium">Reloaded</span>
      </div>

      <div
        className="mt-20 w-24 h-10 rounded-md bg-sky-600 flex items-center justify-center cursor-pointer hover:bg-sky-700 transition duration-300"
        onClick={handleNextQuestion} 
      >
        <span className="text-white font-bold">Next</span>
      </div>
    </div>
  );
};

export default Container;
