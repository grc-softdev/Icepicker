"use client";
import Image from "next/image";
import logo from "../app/assets/logo.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "./services/api";
import useLocalStorage from "@/hooks/useLocalStorage";

type SessionResp = {
  isAdmin: boolean;
  sessionLink: string;
};

const Home = () => {
  const [name, setName] = useLocalStorage<string>("name", "");
  const [sessionName, setSessionName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !sessionName) {
      setError("name and/or sessionName are required");
      return;
    }

    try {
      const response = await api.post<SessionResp>("/session", {
        name,
        sessionName,
      });
      console.log(response.data);
      setIsAdmin(response.data.isAdmin);
      setError("");

      router.push(response.data.sessionLink);
    } catch (err) {
      setError("Error. Try Again");
    }
  };

  return (
    <div className="p-6 min-h-screen rounded-xl bg-magnolia">
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
    </div>
  );
};

export default Home;
