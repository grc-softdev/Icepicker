'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";
import Container from "@/components/Container";
import { api } from "@/app/services/api";
import useLocalStorage from "@/hooks/useLocalStorage";

const Session = () => {
  const { sessionId } = useParams();
  const [error, setError] = useState("");
  const [data, setData] = useState({
    userName: "",
    hostName: "",
    questions: []
  });

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const response = await api.get(`/session/${sessionId}`);
        console.log(response.data);
        setData({
          userName: response.data.name,
          hostName: response.data.hostName,
          questions: response.data.questions
        });
        setError("");
        
      } catch (err) {
        setError("Error. Try Again");
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!sessionId) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-r from-cyan-500 to-blue-500">
      <Navbar />
      <div className="flex items-center">
        <Container questions={data.questions} />
        <Users hostName={data.hostName} userName={data.userName} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;