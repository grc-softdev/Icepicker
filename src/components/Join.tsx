import React, { useState, useEffect } from "react";
import JoinModal from "./JoinModal";
import { useParams } from "next/navigation";
import { api } from "@/app/services/api";

const Join = () => {
  const { sessionId } = useParams();
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await api.get(`/get-session/${sessionId}`);
        setRoomName(response.data.sessionName);
      } catch (err) {
        console.error("Error fetching session data", err);
      }
    };

    fetchRoomData();
  }, [sessionId]);

  return (
    <div>
      <h1>Welcome to {roomName} Room</h1>
      <JoinModal sessionId={sessionId} roomName={roomName} />
    </div>
  );
};

export default Join;
