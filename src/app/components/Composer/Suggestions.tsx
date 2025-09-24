import { ArrowRight, BadgePercent, TrendingUp, Users } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { m } from "framer-motion";

export type Suggestion = {
  text: string;
  type: "investigate" | "analyze" | "explain";
  title?: string;
};

interface SuggestionsProps {
  suggestions: Suggestion[];
  collapsed?: boolean;
  executePrompt: (prompt: string) => void;
  pushQueryTitle: (title: string) => void;
  inputContainerRef?: React.RefObject<HTMLElement | null>;
}

export const Suggestions = ({
  suggestions,
  collapsed,
  executePrompt,
  pushQueryTitle,
  inputContainerRef,
}: SuggestionsProps) => {
  const [hovered, setHovered] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(125); // fallback percentage
  const expanded = !collapsed || hovered;

  useEffect(() => {
    if (!inputContainerRef?.current) return;

    const updatePosition = () => {
      const containerHeight = inputContainerRef.current!.getBoundingClientRect().height;
      setBottomPosition(containerHeight + 12); // container height + 12px
    };

    updatePosition();

    // Update position when window resizes or container might change
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(inputContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [inputContainerRef]);

  const suggestionClickHandler = (queryText: string, queryTitle?: string) => {
    if (!expanded) {
      setHovered(true);
      return;
    }

    pushQueryTitle(queryTitle ?? queryText);
    executePrompt(queryText);
    setHovered(false);
  };

  return (
    <m.div
      className={clsx(
        "flex flex-col gap-[4px] absolute z-10 w-full pt-l delay-75 transition-all duration-300",
        expanded && "bg-container"
      )}
      style={{ bottom: `${bottomPosition}px` }}
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
          suggestionClickHandler={suggestionClickHandler}
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
  suggestionClickHandler: (queryText: string, queryTitle?: string) => void;
}

const Suggestion = ({
  title,
  text,
  type,
  position,
  total,
  setHovered,
  suggestionClickHandler,
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
        suggestionClickHandler(text, title);
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
