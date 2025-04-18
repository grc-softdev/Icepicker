"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/app/services/api";
import io from "socket.io-client";

export type User = {
  id: string;
  name: string;
  role: "HOST" | "GUEST";
};

export type Reaction = {
  id: string;
  name: string;
  amount: number;
  questionId: string;
  createdAt: string;
};

export type Question = {
  id: string;
  name: string;
  reactions: Reaction[];
};

type SessionData = {
  sessionId: string;
  sessionLink: string;
  hostId: string;
  hostName: string;
  users: User[];
  questions: Question[];
};

type SessionContextType = {
  sessionData: SessionData | null;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
      throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
  };

export const SessionProvider = ({ sessionId, children }: { sessionId: string; children: React.ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await api.get(`/session/${sessionId}`);
      setSessionData({ sessionId, ...response.data });
    };

    fetchSession();

    const socket = io("http://localhost:3333");

    socket.emit("join-room", sessionId);

    socket.on("user-list-updated", (updatedUsers: User[]) => {
      setSessionData((prev) =>
        prev ? { ...prev, users: updatedUsers } : prev
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

