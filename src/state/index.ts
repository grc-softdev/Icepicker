import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, User } from "@/app/session/[sessionId]/page";

type SessionState = {
  data: Data | null;
  currentQuestion: Data["currentQuestion"] | null;
  currentUser: User | null;
  sessionId: string | null;
  hostId: string | null;
  error: string;
  name: string;
};

const initialState: SessionState = {
  data: null,
  currentQuestion: null,
  currentUser: null,
  sessionId: null,
  hostId: null,
  error: "",
  name: "",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Data>) {
      state.data = action.payload;
      state.hostId = action.payload.hostId;
      state.currentQuestion = action.payload.currentQuestion;
      state.currentUser = action.payload.currentUser;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setCurrentQuestion(state, action: PayloadAction<SessionState["currentQuestion"]>) {
      state.currentQuestion = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    }
  },
});

export const { setData, setCurrentQuestion, setCurrentUser, setError, setName } = sessionSlice.actions;
export default sessionSlice.reducer;
