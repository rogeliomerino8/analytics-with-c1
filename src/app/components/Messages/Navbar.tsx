import { ChevronLeft, ChevronRight, Home, Sparkle } from "lucide-react";
import "./Navbar.css";

const baseButtonStyle = {
  width: "32px",
  height: "32px",
  border: "none",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  transition: "all 0.2s ease",
  cursor: "pointer",
} as const;

export const Navbar = ({
  switchToNewThread,
  goToNext,
  canGoToNext,
  canGoToPrevious,
  goToPrevious,
  toggleAskAI,
}: {
  switchToNewThread: () => void;
  canGoToNext: boolean;
  goToNext: () => void;
  canGoToPrevious: boolean;
  goToPrevious: () => void;
  toggleAskAI: () => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        padding: "4px",
        borderRadius: "8px",
      }}
    >
      <button
        onClick={switchToNewThread}
        className="nav-button"
        style={{
          ...baseButtonStyle,
          color: "#666",
        }}
      >
        <Home size={16} />
      </button>
      <button
        disabled={!canGoToPrevious}
        onClick={goToPrevious}
        className="nav-button"
        style={{
          ...baseButtonStyle,
          color: canGoToPrevious ? "#666" : "#ccc",
        }}
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={goToNext}
        disabled={!canGoToNext}
        className="nav-button"
        style={{
          ...baseButtonStyle,
          color: canGoToNext ? "#666" : "#ccc",
        }}
      >
        <ChevronRight size={16} />
      </button>

      <button
        onClick={toggleAskAI}
        className="nav-button nav-button-ask"
        style={{
          ...baseButtonStyle,
          color: "#9A48FF",
        }}
      >
        <Sparkle size={16} />
      </button>
    </div>
  );
};
