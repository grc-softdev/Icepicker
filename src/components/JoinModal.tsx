import { api } from "@/app/services/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type JoinProps = {
  sessionId: string;
  userName: string;
  setError: (error: string) => void;
  error: string;
};

const JoinModal = ({ sessionId, setData, setError, error, setName}: JoinProps) => {
  const [joinName, setJoinName] = useState("");
  const router = useRouter()

  const handleJoinSession = async (e) => {
    e.preventDefault()
    if (!joinName.trim()) return;

    try {
     await api.put(`/session/${sessionId}`, { name: joinName, sessionId });



      console.log('about to call setName')
      setName(joinName)

      router.push(`/session/${sessionId}`)
    } catch (err) {
      setError("Failed to join session. Try again.");
    }
    
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center">
      <div className="w-[400px] max-h-[500px] bg-white rounded-lg flex flex-col p-6">
      <div className="mt-40 flex flex-col items-center">
        <h1 className='text-marine font-bold text-2xl mb-2'>Join the Session</h1>
        <form onSubmit={handleJoinSession}>
          
            <label htmlFor="userName">Enter your name:</label>
            <input
              type="text"
              id="userName"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
    
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleJoinSession}
          >
            Join
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;