"use client";
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
  avatar: string;
};

export type Data = {
  sessionLink: string;
  hostName: string;
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
  isCurrent: boolean;
};

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [error, setError] = useState<string>("");

  const cachedUserName = JSON.parse(window.localStorage.getItem("name"));

  const defaultUser = cachedUserName || "";

  const [name, setName] = useLocalStorage<string>("name", defaultUser);
  const [data, setData] = useState<Data | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAlreadyLoggedIn = name?.length !== 0;


  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get<Data>(`/session/${sessionId}`);
        setData(res.data);
        setCurrentUser(res.data.currentUser)
        setCurrentQuestion(res.data.currentQuestion)

        // const localUserName = localStorage.getItem("name")
        //   const getUser = res.data.users.find((user) => user.name === localUserName)
        //   if (getUser) {
        //     setSessionUser(getUser)
        //   } else {
        //     console.warn("user nao encontado")
        //   }

        // setError("");

      } catch (err) {
        setError("Error. Try Again");
      }
    };
  
    fetchSession();

     // Set up polling
     //const interval = setInterval(fetchSession, 2000);
 
     // Clear interval on unmount or if sessionId changes
     //return () => clearInterval(interval);

  }, [sessionId]);

  const sessionUser = data?.users.find((user) => {
    return user.name === name
  })

  const updateToNextQuestion = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-question`);
        setCurrentQuestion(res.data.currentQuestion)
    } catch (err) {
      if (err.response) {
        console.error("Erro na resposta:", err.response.data);
      } else {
        console.error("Erro desconhecido:", err);
      }
    }
  };

  const updateToNextUser = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-user`);
        setCurrentUser(res.data.currentUser)
    } catch (err) {
      if (err.response) {
        console.error("Erro na resposta:", err.response.data);
      } else {
        console.error("Erro desconhecido:", err);
      }
    }
  };


  if (!data) {
    return null;
  }

  console.log(data)

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
          currentUser={currentUser}
          sessionLink={data.sessionLink}
        />

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
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;
