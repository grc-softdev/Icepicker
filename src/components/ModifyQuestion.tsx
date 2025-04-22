import { useState } from "react";
import { api } from "@/app/services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/redux";
import { setCurrentQuestion } from "@/state";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
  onApproved?: () => void;
}

const ModifyQuestions = ({ onApproved }: Props) => {
  const { currentQuestion } = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModify = async (selectedTone: "funnier" | "serious" | "exciting") => {
    if (!currentQuestion?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/questions/modify", {
        questionId: currentQuestion.id,
        tone: selectedTone,
      });

      const modified = response.data?.modified;

      if (modified) {
        
        dispatch(setCurrentQuestion({
          ...currentQuestion,
          name: modified,
        }));

        
        await api.patch(`/questions/${currentQuestion.id}`, {
          name: modified,
        });

        if (onApproved) onApproved();
      } else {
        setError("Texto modificado não encontrado.");
      }
    } catch (err) {
      setError("Erro ao tentar modificar a pergunta.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div><AiOutlineLoading3Quarters /></div>}

  return (
    <div className="p-2 border flex flex-col items-center rounded-lg shadow max-w-xl bg-white">
      <p className="text-sm text-gray-600">You can turn your question more...</p>

      <div className="flex gap-3 mt-2">
        <button
          className="flex items-center gap-2 px-4 md:py-2 rounded-full text-sm transition font-medium bg-background text-blue-900"
          onClick={() => handleModify("funnier")}
          disabled={loading}
        >
          funnier
        </button>
        <button
          className="flex items-center gap-2 px-4 md:py-2 rounded-full text-sm transition font-medium bg-background text-blue-900"
          onClick={() => handleModify("serious")}
          disabled={loading}
        >
          serious
        </button>
        <button
          className="flex items-center gap-2 px-4 md:py-2 rounded-full text-sm transition font-medium bg-background text-blue-900"
          onClick={() => handleModify("exciting")}
          disabled={loading}
        >
          exciting
        </button>
      </div>
    </div>
  );
};

export default ModifyQuestions;