import Image from "next/image";
import nav from "../app/assets/nav.png";
import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";
import { User } from "@/app/session/[sessionId]/page";

type NavbarProps = {
  sessionId: string;
  sessionUser: User;
}

const Navbar = ({ sessionId, sessionUser }: NavbarProps) => {
  const router = useRouter();

  const handleLeaveRoom = async () => {
    const confirmed = window.confirm("Tem certeza que deseja sair da sala?");
    if (!confirmed) return;
    console.log(sessionId, sessionUser )
    try {
      await api.put(`session/${sessionId}/leave`, {
        sessionId,
        userId: sessionUser.id,
      });
      console.log("leaveRoom", sessionId, sessionUser.id)
      localStorage.removeItem("name");
      router.push("/");
    } catch (error) {
      console.error("Erro ao sair da sala", error);
    }
  };
  return (
    <div className="flex items-center justify-center md:justify-start mx-20 lg:mb-0 xl:mb-4">
        <Image src={nav} width={120} height={90} alt="logo" />
        <button
        onClick={handleLeaveRoom}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Sair da Sala
      </button>
    </div>
  );
};

export default Navbar;


