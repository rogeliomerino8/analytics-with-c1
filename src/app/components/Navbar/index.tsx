"use client";

import { Button } from "@crayonai/react-ui";
import Image from "next/image";
import { useTheme } from "../../hooks/useTheme";
import { Github } from "lucide-react";

export const NavBar = () => {
  const theme = useTheme();

  const goToSourceCode = () => {
    window.open("https://github.com/thesysdev/analytics-with-c1", "_blank");
  };

  const goToDocumentation = () => {
    window.open("https://docs.thesys.dev", "_blank");
  };

  const goToConsole = () => {
    window.open("https://console.thesys.dev", "_blank");
  };

  return (
    <div className="flex items-center justify-between bg-container border border-default px-l py-s">
      <div className="flex items-center text-secondary gap-s">
        {theme === "light" ? (
          <Image
            src="/thesys-navbar-light.svg"
            alt="Thesys"
            width={32}
            height={32}
          />
        ) : (
          <Image src="/thesys-navbar.svg" alt="Thesys" width={32} height={32} />
        )}
        <span className="font-semibold text-primary">Demos</span> by Thesys /
        <span className="text-primary">Analytics</span>
      </div>
      <div className="flex items-center gap-s">
        <Button
          variant="tertiary"
          size="medium"
          onClick={goToSourceCode}
          iconLeft={<Github />}
        >
          GitHub
        </Button>
        <Button variant="tertiary" size="medium" onClick={goToDocumentation}>
          Documentation
        </Button>
        <Button variant="primary" size="medium" onClick={goToConsole}>
          Build for free
        </Button>
      </div>
    </div>
  );
};
