import React from "react";
import { Button } from "@crayonai/react-ui";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";

interface HeaderProps {
  canGoToNext: boolean;
  goToNext: () => void;
  canGoToPrevious: boolean;
  goToPrevious: () => void;
  switchToNewThread: () => void;
}

const Header: React.FC<HeaderProps> = ({
  canGoToNext,
  goToNext,
  canGoToPrevious,
  goToPrevious,
  switchToNewThread,
}) => {
  return (
    <div className="flex justify-between items-center p-m border-b border-b-black/4">
      <div className="flex items-center gap-s">
        <div className="rounded-[8px] w-[36px] h-[36px] bg-[linear-gradient(180deg,_#2684FF_0%,_#0255CF_100%)]" />
        <p className="text-md text-primary">
          Analytics <span className="text-secondary">Copilot</span>
        </p>
      </div>

      <div className="flex items-center gap-s">
        <Button
          variant="secondary"
          size="large"
          onClick={switchToNewThread}
          iconRight={<Home />}
        />
        <Button
          variant="secondary"
          size="large"
          iconRight={<ArrowLeft />}
          disabled={!canGoToPrevious}
          onClick={goToPrevious}
        />
        <Button
          variant="secondary"
          size="large"
          iconRight={<ArrowRight />}
          disabled={!canGoToNext}
          onClick={goToNext}
        />
      </div>
    </div>
  );
};

export default Header;
