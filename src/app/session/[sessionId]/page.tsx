"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";
import Container from "@/components/Container";
import { api } from "@/app/services/api";
import useLocalStorage from "@/hooks/useLocalStorage";
import JoinModal from "@/components/JoinModal";

const Session = () => {
  const { sessionId } = useParams();
  const [error, setError] = useState("");

  const emptyString = ""

  const [name, setName] = useLocalStorage('name',emptyString);

  const [data, setData] = useState();

  const isAlreadyLoggedIn = name?.length  !== 0 // starts with an empty string



  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await api.get(`/session/${sessionId}`);
        setData(res.data);
        setError("");
      } catch (err) {
        setError("Error. Try Again");
      }
    };

    fetchSession();
  }, []);


  if (!isAlreadyLoggedIn) {
    return <JoinModal data={data} error={error} setError={setError} sessionId={sessionId} setName={setName}/> 
  } 

  if (!data) {
    return null
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar sessionLink={data.sessionLink} />
      <div className="flex items-center">
        <Container questions={data.questions} users={data.users} />
        <Users hostName={data.hostName} users={data.users} />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Session;
