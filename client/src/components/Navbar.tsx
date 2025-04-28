import Image from "next/image";
import icker from "../app/assets/icker.png";
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
  console.log(sessionId, sessionUser)
  const handleLeaveRoom = async () => {
 
    try {
      await api.put(`session/${sessionId}/leave`, {
        sessionId,
        userId: sessionUser?.id,
      });
      console.log(sessionUser?.id)
      localStorage.removeItem("name");
      router.push("/");
    } catch (error) {
      console.log("Error to leave", error);
    }
  };

  return (
    <div className="flex items-center justify-between mx-20 lg:mb-0 xl:mb-4">
      <Image src={icker} width={120} height={90} alt="logo" priority/>
      <div onClick={handleLeaveRoom}>
        <VscSignOut className="w-8 h-7 text-marine dark:text-greenblue rounded-md hover:text-greenblue cursor-pointer"/>
      </div>
    </div>
  );
};

export default Navbar;
