import { api } from "@/app/services/api";
import Image from "next/image";
import joinlogo from "../app/assets/joinlogo.png";
import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinProps = {
  sessionId: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setError: (error: string) => void;
  error: string;
};

const JoinModal = ({ sessionId, setError, error, setName }: JoinProps) => {
  const [joinName, setJoinName] = useState("");
  const router = useRouter();

  const handleJoinSession = async (e) => {
    e.preventDefault();
    if (!joinName.trim()) return;

    try {
      await api.put(`/session/${sessionId}`, { name: joinName, sessionId });

      setName(joinName);

      router.push(`/session/${sessionId}`);
    } catch (err) {
      setError("Failed to join session. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center">
      <div className=" flex flex-col gap-4 items-center justify-center w-[500px] max-h-[600px] bg-white rounded-lg p-6">
        <form onSubmit={handleJoinSession}>
          <div className="flex items-center justify-center mb-4">
          <Image
            src={joinlogo}
            alt="logo"
            width={100}
            className="cursor-pointer flex items-center justify-center"
          />
          </div>
          <input
            type="text"
            id="userName"
            placeholder="username"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            className="w-full pl-2 text-marine rounded-md border-solid border-2 border-gray py-1.5 mb-2"
            required
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            onClick={handleJoinSession}
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

{
  /* <div className="p-6 min-h-screen rounded-xl bg-magnolia">
<section className="mt-40 flex flex-col items-center">
  <Image src={logo} alt="logo" width={200} className="cursor-pointer" />
  <form onSubmit={handleLogin}>
    <input
      type="text"
      required
      placeholder="username"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full pl-2 text-marine rounded-md border-solid border-2 border-gray py-1.5 mb-2"
    />

    <input
      type="text"
      required
      placeholder="sessions's name"
      value={sessionName}
      onChange={(e) => setSessionName(e.target.value)}
      className="w-full pl-2 text-marine rounded-md border-solid border-2 border-gray py-1.5 mb-2"
    />

    {error && <p className="text-red-500 mb-2">{error}</p>}

    <button
      className="rounded-md w-full bg-marine text-white mb-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-inset ring-sky-600 hover:bg-greenblue disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
    >
      Go to Room
    </button>
  </form>
</section>
</div> */
}
