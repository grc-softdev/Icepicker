import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, User } from "@/app/session/[sessionId]/page";
import { Reaction } from "@/components/Container";

type SessionState = {
  data: Data | null;
  currentQuestion: Data["currentQuestion"] | null;
  currentUser: User | null;
  sessionId: string | null;
  hostId: string | null;
  error: string;
  name: string;
  loading: boolean;
  users: User[];
  reactions: Reaction[];
};

const initialState: SessionState = {
  data: null,
  currentQuestion: null,
  currentUser: null,
  sessionId: null,
  hostId: null,
  error: "",
  name: "",
  loading: false,
  users: [],
  reactions: [],
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
  
    setData(state, action: PayloadAction<Data>) {
      state.data = action.payload;
    },
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
   
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },


    initSocket(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
  },
});

export const {
  setData,
  setError,
  setName,
  setLoading,
  setSessionId,
  initSocket,
} = sessionSlice.actions;

export default sessionSlice.reducer;