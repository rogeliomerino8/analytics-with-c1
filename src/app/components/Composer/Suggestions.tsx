import { ArrowRight, BadgePercent, TrendingUp, Users } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface SuggestionsProps {
  suggestions: {
    text: string;
    type: "investigate" | "analyze" | "explain";
  }[];
  collapsed?: boolean;
  executePrompt: (prompt: string) => void;
}

export const Suggestions = ({
  suggestions,
  collapsed,
  executePrompt,
}: SuggestionsProps) => {
  const [hovered, setHovered] = useState(false);
  const expanded = !collapsed || hovered;

  return (
    <div
      className={clsx(
        "flex flex-col gap-[4px] absolute bottom-[125%] z-10 w-full transition-all duration-300 pt-l delay-75",
        expanded && "bg-linear-to-t from-container from-90% to-transparent"
      )}
    >
      {suggestions.map((suggestion, index) => (
        <Suggestion
          key={suggestion.text}
          {...suggestion}
          position={expanded ? 0 : suggestions.length - index - 1}
          total={suggestions.length}
          setHovered={setHovered}
          executePrompt={executePrompt}
        />
      ))}
    </div>
  );
};

interface SuggestionProps {
  text: string;
  type: "investigate" | "analyze" | "explain";
  position: number;
  total: number;
  setHovered: (hovered: boolean) => void;
  executePrompt: (prompt: string) => void;
}

const Suggestion = ({
  text,
  type,
  position,
  total,
  setHovered,
  executePrompt,
}: SuggestionProps) => {
  return (
    <div
      className="px-l py-s flex items-center justify-between gap-s flex-nowrap border border-interactive-el rounded-xl shadow-lg hover:border-interactive-el-hover cursor-pointer group transition-all duration-150 bg-container delay-100"
      style={{
        transform: `translateY(calc(${position} * 90%))`,
        zIndex: total - position,
        scale: 1 - (position / total) * 0.1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => executePrompt(text)}
    >
      <div className="flex items-center gap-s">
        {type === "investigate" && (
          <TrendingUp className="text-blue-500" size={16} />
        )}
        {type === "analyze" && <Users className="text-orange-500" size={16} />}
        {type === "explain" && (
          <BadgePercent className="text-pink-500" size={16} />
        )}
        <span className="text-primary">{text}</span>
      </div>

      <ArrowRight
        size={16}
        className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />
    </div>
  );
};
