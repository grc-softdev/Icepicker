'use client'
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";
import { useParams } from "next/navigation";
import Container  from "@/components/Container";

const Session = () => {
  const { sessionId } = useParams();

  if (!sessionId) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-r from-cyan-500 to-blue-500">
    <Navbar />
    <div className="flex items-center">
      <Container />
      <Users />
    </div>
  </div>
  )
}

export default Session;