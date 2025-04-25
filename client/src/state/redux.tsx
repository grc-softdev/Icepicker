import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./index";
import { socketMiddleware } from "./middleware/socketMiddleware";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunkDispatch = typeof store.dispatch;
