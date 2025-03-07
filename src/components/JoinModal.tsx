import { api } from "@/app/services/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type JoinProps = {
  sessionId: string;
};

const Join = ({ sessionId }: JoinProps) => {
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.push("/404");
    }
  }, [sessionId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName) {
      setError("Please enter a name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/join-session", {
        sessionId,
        name: userName,
      });

      router.push(`/room/${sessionId}?name=${response.data.userName}`);
    } catch (err) {
      setError("Failed to join the session. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Join the Room</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userName">Enter your name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
