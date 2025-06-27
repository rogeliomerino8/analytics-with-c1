"use client";

import { AppState } from "../store/state";
import { AppStateContext } from "./AppStateContext";

export const AppStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <AppStateContext.Provider value={new AppState()}>
    {children}
  </AppStateContext.Provider>
);
