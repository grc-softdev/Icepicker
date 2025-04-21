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


  const isFirstUser = data?.users?.[0]?.id === sessionUser?.id;
  
  const updateToNextQuestion = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-question`);
      dispatch(setCurrentQuestion(res.data.currentQuestion));
    } catch (err) {
      console.error("Error", err);
    }
  };

  const updateToNextUser = async () => {
    try {
      const res = await api.put(`/session/${sessionId}/next-user`);
      dispatch(setCurrentUser(res.data.currentUser));
    } catch (err) {
      console.error("Error", err);
    }
  };


  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get<Data>(`/session/${sessionId}`);
        dispatch(setData(res.data));

        const foundUser = res.data.users.find((user) => {
          return user.name === name
        });
        setSessionUser(foundUser || null);
        setLoading(false);

      } catch (error) {
        dispatch(setError("Error. Try Again"));
        setLoading(false);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 2000);
    return () => clearInterval(interval);
  }, [sessionId, name, dispatch]);

  useEffect(() => {
    const onClosing = async (event: BeforeUnloadEvent) => {
      event.preventDefault()

      try {
        const payload = JSON.stringify({
          sessionId,
          userId: sessionUser?.id,
        });

        const leaveEndpoint = `${process.env.NEXT_PUBLIC_API}/session/${sessionId}/leave`

        fetch(`${leaveEndpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
          keepalive: true,
        });
      
        localStorage.removeItem("name");
      } catch (error) {
        console.error("Erro ao sair da sala", error);
      }
    };
  
    window.addEventListener("beforeunload", onClosing);
  
    return () => {
      window.removeEventListener("beforeunload", onClosing);
    };
  }, [sessionUser?.id]);

  if (loading || !data) {
    return <div>Loading...</div>;
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
          isFirstUser={isFirstUser}
        />
        <Users
          users={data.users}
          sessionLink={data.sessionLink}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;