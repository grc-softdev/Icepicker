import { useRouter } from "next/navigation";
import { api } from "@/app/services/api";
import useLocalStorage from "@/hooks/useLocalStorage";

const LeaveRoomButton = () => {
  const router = useRouter();
  const [userName] = useLocalStorage<string>("name", "");

  const handleLeaveRoom = async () => {
    const confirmed = window.confirm("Tem certeza que deseja sair da sala?");
    if (!confirmed) return;

    const sessionId = window.location.pathname.split("/").pop();

    try {
      const response = await api.post("/leave", {
        sessionId,
        name: userName,
      });
      console.log("resposta do backend", response.data)
      localStorage.removeItem("name");
      router.push("/");
    } catch (error) {
      console.error("Erro ao sair da sala", error);
      alert("Erro ao sair da sala. Tente novamente.");
    }
  };

  return (
    <div>
      <button onClick={handleLeaveRoom}>Deixar Sala</button>
    </div>
  );
};

export default LeaveRoomButton;