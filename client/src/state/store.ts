// src/state/store.ts
import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import projectReducer from "./portfolioSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    portfolio: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
