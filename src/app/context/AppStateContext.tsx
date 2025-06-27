import { AppState } from "@/app/store/state";
import { createContext } from "react";

export const AppStateContext = createContext<AppState>(new AppState());
