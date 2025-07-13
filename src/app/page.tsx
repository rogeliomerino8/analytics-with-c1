"use client";

import { ThemeProvider } from "@crayonai/react-ui";
import "@crayonai/react-ui/styles/index.css";
import { DashboardScreen } from "./components/DashboardScreen";
import { domAnimation, LazyMotion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "./hooks/useTheme";

export interface CardInfo {
  text: string; // card prompt
}

export default function Home() {
  const theme = useTheme();

  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider
        mode={theme}
        theme={{ defaultChartPalette: ["#4F46E5", "#7F56D9", "#1882FF"] }}
      >
        <div className="flex w-full h-full max-h-screen justify-between">
          <div className="w-2/3 brightness-40">
            {theme === "light" ? (
              <Image
                src="/background.svg"
                alt="background"
                fill
                className="object-cover object-left-top"
              />
            ) : (
              <Image
                src="/background-dark.svg"
                alt="background"
                fill
                className="object-cover object-left-top"
              />
            )}
          </div>
          <DashboardScreen />
        </div>
      </ThemeProvider>
    </LazyMotion>
  );
}
