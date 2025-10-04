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
        <div className="flex flex-col h-full w-full max-h-screen">
          <div className="flex w-full h-full max-h-full overflow-hidden justify-between">
            <div className="hidden md:block w-2/3 brightness-40 relative group cursor-pointer">
              {theme === "light" ? (
                <Image
                  src="/background.svg"
                  alt="background"
                  fill
                  className="object-cover object-left-top"
                  priority
                />
              ) : (
                <Image
                  src="/background-dark.svg"
                  alt="background"
                  fill
                  className="object-cover object-left-top"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    This is a Preview Screen
                  </h3>
                  <p className="text-lg">
                    You can ask the agent on the right about U.S. equities or
                    current market movements
                  </p>
                </div>
              </div>
            </div>
            <DashboardScreen />
          </div>
        </div>
      </ThemeProvider>
    </LazyMotion>
  );
}
