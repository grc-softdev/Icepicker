import React, { useState, useEffect } from "react";
import JoinModal from "./JoinModal";
import { useParams } from "next/navigation";
import { api } from "@/app/services/api";
import { setError } from "@/state";
import { useDispatch } from "react-redux";

const Join = () => {
  const dispatch = useDispatch()
  const { sessionId } = useParams();
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    const fetchSessionData = async () => {
      
      try {
        const response = await api.get(`/get-session/${sessionId}`);
        setSessionName(response.data.sessionName);
      } catch (err) {
        const error = err as { 
          message: string
        } | undefined
        const userError = error?.message || 'Error when fetching'
        dispatch(setError(userError));
      }
    };

    fetchSessionData();
  }, [sessionId]);

  return (
    <div>
      <h1>Welcome to {sessionName} Session</h1>
      <JoinModal sessionId={sessionId as string} />
    </div>
  );
};

export default Join;
