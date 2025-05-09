import { api } from "@/app/services/api";
import Image from "next/image";
import icker from "../app/assets/icker.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setError } from "@/state";


type JoinProps = {
  sessionId: string;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  isOpen?: boolean;
};

const JoinModal = ({
  sessionId,
  setName,
  isOpen,
}: JoinProps) => {
  const [joinName, setJoinName] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const handleJoinSession = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!joinName.trim()) return

    try {
      await api.put(`/session/${sessionId}`, { name: joinName });

      if (setName) setName(joinName);

      dispatch({type: "session/initSocket", payload: sessionId})

      router.push(`/session/${sessionId}`);
    } catch (err) {
      const error = err as { 
        message: string
      } | undefined

      const userError = error?.message || 'Error when fetching'

      dispatch(setError(userError));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 dark:bg-blue-950/75 flex justify-center items-center z-50">
      <div className=" flex flex-col gap-4 items-center justify-center w-[500px] max-h-[600px] bg-background dark:bg-gray-300 rounded-lg mx-8 sm:mx-0 p-4 sm:p-6">
        <form onSubmit={handleJoinSession}>
          <div className="flex items-center justify-center">
            <Image
              src={icker}
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
            className="w-full pl-2 text-gray-700 rounded-md border-solid border-2  border-blue-500 py-1.5 mb-2"
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
