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
import { initSocket, setData, setLoading } from "@/state";

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
  const { data, error, loading } = useSelector((state: RootState) => state.session);

  const cachedUserName = JSON.parse(window.localStorage.getItem("name"));
  const defaultUser = cachedUserName || "";
  const [name, setName] = useLocalStorage<string>("name", defaultUser);

  const sessionUser = data?.users.find((user) => user.name === name);

  console.log("sessionUser", sessionUser, name)
  const isAlreadyLoggedIn = name?.length !== 0

  const updateToNextQuestion = async () => {
    try {
      await api.put(`/session/${sessionId}/next-question`);
      await api.get<Data>(`/session/${sessionId}`);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const updateToNextUser = async () => {
    try {
      await api.put(`/session/${sessionId}/next-user`);
      await api.get<Data>(`/session/${sessionId}`);

    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        dispatch(setLoading(true));
        const res = await api.get<Data>(`/session/${sessionId}`);
        dispatch(setData(res.data));

        const foundUser = res.data.users.find((user) => user.name === name);
        setSessionUser(foundUser || null);
        dispatch(setLoading(false));

        const currentUserStills = res.data.users.some(
          (user) => user.id === res.data.currentUser?.id
        );

        if (!currentUserStills) {
          const resNext = await api.put(`/session/${sessionId}/next-user`);
          dispatch(setData(resNext.data.currentUser));
        }

        dispatch(initSocket(sessionId));
      } catch (error) {
        dispatch(setLoading(false));
      }
    };

    fetchSession();
  }, [sessionId, name, dispatch]);
  
  
  // if (loading || !data) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <AiOutlineLoading3Quarters className="animate-spin text-marine text-4xl" />
  //     </div>
  //   );
  // }


  console.log(sessionUser, isAlreadyLoggedIn)

  if (!isAlreadyLoggedIn) {
    return (
      <JoinModal sessionId={sessionId} setName={setName} isOpen={true} />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col mb-16 md:mb-2">
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
        />
        <Users users={data?.users} sessionLink={data?.sessionLink} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;