"use client";

import { ThemeProvider } from "@crayonai/react-ui";
import "@crayonai/react-ui/styles/index.css";
import { DashboardScreen } from "./components/DashboardScreen";
import { domAnimation, LazyMotion } from "framer-motion";
import Image from "next/image";

export interface CardInfo {
  text: string; // card prompt
}

export default function Home() {
  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider mode="light">
        <div className="flex w-full h-full max-h-screen justify-between">
          <div className="w-2/3 brightness-40">
            <Image
              src="/background.svg"
              alt="background"
              fill
              className="object-cover object-left-top"
            />
          </div>
          <DashboardScreen />
        </div>
      </ThemeProvider>
    </LazyMotion>
  );
}
