import { api } from "@/app/services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/redux";
import { setError, setLoading } from "@/state";
import { useParams } from "next/navigation";

interface Props {
  onApproved?: () => void;
}

const ModifyQuestions = ({ onApproved }: Props) => {
  const {  loading, data } = useSelector((state: RootState) => state.session);
  const { sessionId } = useParams<{ sessionId: string }>();
  const dispatch = useDispatch();

  const currentQuestion = data?.currentQuestion
  const handleModify = async (selectedTone: "funnier" | "serious" | "exciting") => {
    if (!currentQuestion?.id) return;
    dispatch(setLoading(true));

    
    try {
      const response = await api.post("/questions/modify", {
        questionId: currentQuestion?.id,
        tone: selectedTone,
        sessionId: sessionId,
      });

      const modified = response.data?.modified;
      if (modified) {

        await api.patch(`/questions/${currentQuestion.id}`, {
          name: modified,
          sessionId,
        });

        if (onApproved) onApproved();
      } else {
        dispatch(setError("Modified text not found."));
      }
    } catch (err) {
      const error = err as { 
        message: string
      } | undefined

      const userError = error?.message || 'Error when fetching'

      dispatch(setError(userError));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-background rounded-2xl px-8 py-4 mt-1 lg:mt-4 w-fit mx-auto shadow-md mb-2 lg:mb-4">
      <p className="text-center text-sm font-semibold text-gray-600 mb-3">Use AI to make it</p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          className="bg-white text-gray-500 text-sm font-bold px-4 py-2 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition"
          onClick={() => handleModify("funnier")}
          disabled={loading}
        >
          funnier
        </button>
        <button
          className="bg-white text-gray-500 text-sm font-bold px-4 py-2 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition"
          onClick={() => handleModify("serious")}
          disabled={loading}
        >
          serious
        </button>
        <button
          className="bg-white text-gray-500 text-sm font-bold px-4 py-2 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition"
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