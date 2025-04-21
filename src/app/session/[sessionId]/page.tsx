"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";
import Container, { Reaction } from "@/components/Container";
import { api } from "@/app/services/api";
import useLocalStorage from "@/hooks/useLocalStorage";
import JoinModal from "@/components/JoinModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/redux";
import { setCurrentQuestion, setCurrentUser, setData, setError } from "@/state";

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
  sessionUser: User;
};

type Question = {
  name: string;
  id: string;
  reaction: Reaction[];
};

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const dispatch = useDispatch();
  const { data, error } = useSelector((state: RootState) => state.session);

  const cachedUserName = JSON.parse(window.localStorage.getItem("name"));
  const defaultUser = cachedUserName || "";
  const [name, setName] = useLocalStorage<string>("name", defaultUser);
  const isUserInSession = data?.users?.some((user) => user.name === name);
  const isAlreadyLoggedIn = name?.length !== 0 && isUserInSession;

  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<User | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get<Data>(`/session/${sessionId}`);
        dispatch(setData(res.data));

        // Busca o usuário correspondente ao nome salvo no localStorage
        const foundUser = res.data.users.find((user) => user.name === name);
        setSessionUser(foundUser || null);
        console.log(res.data)
        console.log(foundUser)
        setLoading(false);

  console.log("API Response:", res);
      } catch (error) {
        dispatch(setError("Erro ao carregar a sessão. Tente novamente."));
        setLoading(false);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 2000);
    return () => clearInterval(interval);
  }, [sessionId, name, dispatch]);

  const isFirstUser = data?.users?.[0]?.id === sessionUser?.id;

  
  const updateToNextQuestion = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-question`);
      dispatch(setCurrentQuestion(res.data.currentQuestion));
    } catch (err) {
      console.error("Erro ao mudar para a próxima pergunta:", err);
    }
  };

  const updateToNextUser = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-user`);
      dispatch(setCurrentUser(res.data.currentUser));
    } catch (err) {
      console.error("Erro ao mudar para o próximo usuário:", err);
    }
  };

  if (loading || !data) {
    return <div>Carregando sessão...</div>;
  }

  if (!sessionUser || !isAlreadyLoggedIn) {
    return (
      <JoinModal
        sessionId={sessionId}
        setName={setName}
        isOpen={true}
      />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <JoinModal
        sessionId={sessionId}
        setName={setName}
        isOpen={!isAlreadyLoggedIn}
      />
      <Navbar sessionId={sessionId} sessionUser={sessionUser} />
      <div className="flex flex-col md:flex-row-reverse items-center sm:items-center md:items-start justify-center mx-20 gap-6 mt-2 sm:mt-2 md:mt-0">
        <Container
          updateToNextQuestion={updateToNextQuestion}
          updateToNextUser={updateToNextUser}
          sessionUser={sessionUser}
          sessionId={sessionId}
          hostId={data.hostId}
          isFirstUser={isFirstUser}
        />
        <Users
          hostId={data.hostId}
          users={data.users}
          sessionLink={data.sessionLink}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;