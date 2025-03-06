'use client';
import Image from 'next/image';
import logo from '../app/assets/logo.png';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from './services/api';
const Home = () => {

  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [roomLink, setRoomLink] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !roomName) {
      setError("name and/or roomName are required");
      return;
    }

    try {
      const response = await api.post("/room", { name, roomName });

      setRoomLink(response.data.roomLink);
      setIsAdmin(response.data.isAdmin);
      setError("");

      router.push(response.data.roomLink);
    } catch (err) {
      setError("Error. Try Again");
      console.log(err);
    }
  };

  return (
    <div className="p-6 min-h-screen rounded-xl bg-magnolia">
      <section className="mt-40 flex flex-col items-center">
      <Image src={logo} alt="logo do serviço" width={200} />
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
            placeholder="room's name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full pl-2 text-marine rounded-md border-solid border-2 border-gray py-1.5 mb-2"
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            className="rounded-md w-full bg-marine text-white mb-4 py-3 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Criar Sala
          </button>
        </form>

        {/* {roomLink && (
          <div className="mt-4">
            <h3>Sua sala foi criada com sucesso!</h3>
            <p>Link da sala: <strong>{roomLink}</strong></p>
            <button
              onClick={() => navigator.clipboard.writeText(roomLink)}
              className="bg-blue-500 text-white p-2 rounded-md mt-2"
            >
              Copiar link
            </button>
          </div>
        )} */}
      </section>
    </div>
  );
};

export default Home;

