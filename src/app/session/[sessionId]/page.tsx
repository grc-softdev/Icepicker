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
};

export type Data = {
  sessionLink: string;
  hostId: string;
  userId: string;
  questions: string[];
  users: User[];
};

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [error, setError] = useState<string>("");

  const cachedUserName = JSON.parse(window.localStorage.getItem("name"));

  const defaultUser = cachedUserName || "";

  const [name, setName] = useLocalStorage<string>("name", defaultUser);

  const [data, setData] = useState<Data | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const isAlreadyLoggedIn = name?.length !== 0; 

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get<Data>(`/session/${sessionId}`);
        setData(res.data);
        setError("");
      } catch (err) {
        setError("Error. Try Again");
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!isAlreadyLoggedIn) {
    return (
      <JoinModal
        error={error}
        setError={setError}
        sessionId={sessionId}
        setName={setName}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar sessionLink={data.sessionLink} />
      <div className="flex items-center">
        <Container
          questions={data.questions}
          users={data.users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <Users
          hostId={data.hostId}
          users={data.users}
          selectedUser={selectedUser}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;
