"use client";

// 1. resolveria a reactions pra um usuario
// por dentro de questions
// e criar uma coisa chamada "current question", q tenha qm tah respondendo e os dados normais dela
// 1.1 fazer td sem a parte do sincrionismo, ou seja, testar atualizando kd um dos usuarios pra q tenha uma nova chamada
// 2. implementar um websocket pra comunicar as mudancas pra mais de um usuario

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";
import Container from "@/components/Container";
import { api } from "@/app/services/api";
import useLocalStorage from "@/hooks/useLocalStorage";
import JoinModal from "@/components/JoinModal";

export type User = {
  id: string;
  name: string;
  role: 'HOST' | "GUEST"
};

export type Data = {
  sessionLink: string;
  hostName: string;

  hostId: string;
  userId: string;
  questions: Question[];
  users: User[];
};

type Question = {
  name: string;
  id: string;
};

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [error, setError] = useState<string>("");

  const cachedUserName = JSON.parse(window.localStorage.getItem("name"));

  const defaultUser = cachedUserName || "";

  const [name, setName] = useLocalStorage<string>("name", defaultUser);

  const [data, setData] = useState<Data | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

   const [sessionUser, setSessionUser] = useState<User | null>(null)

  const isAlreadyLoggedIn = name?.length !== 0;

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get<Data>(`/session/${sessionId}`);
        setData(res.data);
        setError("");

        const currUser = res.data.users.find((user) => user.name === name)
        if(currUser) {
          setSelectedUser(currUser)
          setSessionUser(currUser)
        }

      } catch (err) {
        setError("Error. Try Again");
      }
    };

    fetchSession();

    // // Set up polling
    // const interval = setInterval(fetchSession, 2500);

    // // Clear interval on unmount or if sessionId changes
    // return () => clearInterval(interval);
  }, [sessionId]);

  console.log(data);

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
      <div className="flex items-center justify-start mx-20">
        <Users
          hostId={data.hostId}
          users={data.users}
          selectedUser={selectedUser}
          sessionLink={data.sessionLink}
        />

        <Container
          questions={data.questions}
          users={data.users}
          sessionUser={sessionUser}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          hostId={data.hostId}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;
