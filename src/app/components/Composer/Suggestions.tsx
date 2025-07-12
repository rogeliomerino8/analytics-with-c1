import { ArrowRight, BadgePercent, TrendingUp, Users } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { m } from "framer-motion";

export type Suggestion = {
  text: string;
  type: "investigate" | "analyze" | "explain";
  title: string;
};

interface SuggestionsProps {
  suggestions: Suggestion[];
  collapsed?: boolean;
  executePrompt: (prompt: string) => void;
  pushQueryTitle: (title: string) => void;
}

export const Suggestions = ({
  suggestions,
  collapsed,
  executePrompt,
  pushQueryTitle,
}: SuggestionsProps) => {
  const [hovered, setHovered] = useState(false);
  const expanded = !collapsed || hovered;

  return (
    <m.div
      className={clsx(
        "flex flex-col gap-[4px] absolute bottom-[125%] z-10 w-full pt-l delay-75 transition-all duration-300",
        expanded && "bg-container"
      )}
      initial={{ opacity: 0, display: "none" }}
      animate={{ opacity: 1, display: "flex" }}
      exit={{ opacity: 0, transitionEnd: { display: "none" } }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {suggestions.map((suggestion, index) => (
        <Suggestion
          key={suggestion.text}
          {...suggestion}
          position={expanded ? 0 : suggestions.length - index - 1}
          total={suggestions.length}
          setHovered={setHovered}
          executePrompt={executePrompt}
          pushQueryTitle={pushQueryTitle}
        />
      ))}
    </m.div>
  );
};

interface SuggestionProps {
  title?: string;
  text: string;
  type: "investigate" | "analyze" | "explain";
  position: number;
  total: number;
  setHovered: (hovered: boolean) => void;
  executePrompt: (prompt: string) => void;
  pushQueryTitle: (title: string) => void;
}

const Suggestion = ({
  title,
  text,
  type,
  position,
  total,
  setHovered,
  executePrompt,
  pushQueryTitle,
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
      onClick={() => {
        pushQueryTitle(title ?? text);
        executePrompt(text);
      }}
    >
      <div className="flex items-center gap-m">
        {type === "investigate" && (
          <TrendingUp className="text-blue-500" size={18} />
        )}
        {type === "analyze" && <Users className="text-orange-500" size={18} />}
        {type === "explain" && (
          <BadgePercent className="text-pink-500" size={18} />
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
