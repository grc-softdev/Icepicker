import { api } from "@/app/services/api";
import Image from "next/image";
import nav from "../app/assets/nav.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

type JoinProps = {
  sessionId: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
};

const JoinModal = ({
  sessionId,
  setName,
  isOpen,
}: JoinProps) => {
  const [joinName, setJoinName] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const handleJoinSession = async (e) => {
    e.preventDefault();
    if (!joinName.trim()) return

    try {
      await api.put(`/session/${sessionId}`, { name: joinName });

      setName(joinName);

      dispatch({type: "session/initSocket", payload: sessionId})

      router.push(`/session/${sessionId}`);
    } catch (err) {
      console.log("Failed to join session.");
    }
  };

  if (!isOpen) {
    console.log(`about to return null`)


    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className=" flex flex-col gap-4 items-center justify-center w-[500px] max-h-[600px] bg-background rounded-lg p-6">
        <form onSubmit={handleJoinSession}>
          <div className="flex items-center justify-center">
            <Image
              src={nav}
              alt="logo"
              width={200}
              className="cursor-pointer flex items-center justify-center"
            />
          </div>
          <input
            type="text"
            id="userName"
            placeholder="Username"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            className="w-full pl-2 text-marine rounded-md border-solid border-2 border-gray py-1.5 mb-2"
            required
          />
          <button
            className="rounded-md w-full bg-marine text-white mb-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-inset ring-sky-600 hover:bg-greenblue disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Go to Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinModal;
