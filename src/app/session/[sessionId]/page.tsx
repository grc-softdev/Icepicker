"use client";
// session name
// performance do thumbs
// aih tem esse bug da volta
// ajeitar o azulzinho do selected

// em vez de go to room, create a room qnd for na homepage, e join na hora do modal
// a cor do texto tem q ser algo normal, preto
// talvez diminuir um tiquinho de nada a cor do azul da border
// colocar 3 pontinhos no link pra n ser scrollavel

// overall:
// refatorar, por redux
// por AI
// por websockets
// appcues

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";
import Container, { Reaction } from "@/components/Container";
import { api } from "@/app/services/api";
import useLocalStorage from "@/hooks/useLocalStorage";
import JoinModal from "@/components/JoinModal";

export type User = {
  id: string;
  name: string;
  role: "HOST" | "GUEST";
  avatar: string;
};

export type Data = {
  sessionLink: string;
  hostId: string;
  userId: string;
  currentQuestion: Question;
  currentUser: User;
  questions: Question[];
  users: User[];
};

type Question = {
  name: string;
  id: string;
  reaction: Reaction[]
};

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [error, setError] = useState<string>("");

  const cachedUserName = JSON.parse(window.localStorage.getItem("name"));

  const defaultUser = cachedUserName || "";

  const [name, setName] = useLocalStorage<string>("name", defaultUser);
  const [data, setData] = useState<Data | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAlreadyLoggedIn = name?.length !== 0;

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get<Data>(`/session/${sessionId}`);
        setData(res.data);
        setCurrentUser(res.data.currentUser);
        setCurrentQuestion(res.data.currentQuestion);
      } catch (error) {
        setError("Error. Try Again");
      }
    };

    fetchSession();

    const interval = setInterval(fetchSession, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const sessionUser = data?.users.find((user) => {
    return user.name === name;
  });

  const updateToNextQuestion = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-question`);
      setCurrentQuestion(res.data.currentQuestion);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const updateToNextUser = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-user`);
      setCurrentUser(res.data.currentUser);
    } catch (err) {
      console.error("Erro desconhecido:", err);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <JoinModal
        error={error}
        setError={setError}
        sessionId={sessionId}
        setName={setName}
        isOpen={!isAlreadyLoggedIn}
      />
      <Navbar />
      <div className="flex flex-col md:flex-row-reverse items-center sm:items-center md:items-start justify-center mx-20 gap-6 mt-2 sm:mt-2 md:mt-0">
        <Container
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          updateToNextQuestion={updateToNextQuestion}
          updateToNextUser={updateToNextUser}
          currentUser={currentUser}
          sessionUser={sessionUser}
          sessionId={sessionId}
          hostId={data.hostId}
        />
        <Users
          hostId={data.hostId}
          users={data.users}
          currentUser={currentUser}
          sessionLink={data.sessionLink}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;
