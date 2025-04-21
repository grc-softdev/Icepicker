import Image from "next/image";
import nav from "../app/assets/nav.png";
import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";
import { User } from "@/app/session/[sessionId]/page";

import { VscSignOut } from "react-icons/vsc";

type NavbarProps = {
  sessionId: string;
  sessionUser: User;
};

const Navbar = ({ sessionId, sessionUser }: NavbarProps) => {
  const router = useRouter();

  const handleLeaveRoom = async () => {
  
    try {
      await api.put(`session/${sessionId}/leave`, {
        sessionId,
        userId: sessionUser.id,
      });
      localStorage.removeItem("name");
      router.push("/");
    } catch (error) {
      console.error("Erro ao sair da sala", error);
    }
  };



  return (
    <div className="flex items-center justify-between mx-20 lg:mb-0 xl:mb-4">
      <Image src={nav} width={120} height={90} alt="logo" />
      <div onClick={handleLeaveRoom}>
        <VscSignOut className="w-8 h-7 text-marine rounded-md hover:text-greenblue"/>
      </div>
    </div>
  );
};

export default Navbar;
