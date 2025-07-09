import { IconButton } from "@crayonai/react-ui";
import { ArrowUp, StopCircle } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useThreadActions, useThreadState } from "@crayonai/react-core";
import { Suggestions, type Suggestion } from "./Suggestions";

const prefilledSuggestions: Suggestion[] = [
  { text: "Show me 3 stocks with net income > $10B", type: "explain" },
  { text: "What is the latest news for Tesla?", type: "investigate" },
  {
    text: "Show me Microsoft's latest quarterly earnings report.",
    type: "analyze",
  },
];

export const Composer = () => {
  const [textContent, setTextContent] = useState("");
  const { processMessage, onCancel } = useThreadActions();
  const { isRunning } = useThreadState();
  const { messages } = useThreadState();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!textContent.trim() || isRunning) {
      return;
    }

    executePrompt(textContent);
  };

  const executePrompt = async (prompt: string) => {
    processMessage({
      type: "prompt",
      role: "user",
      message: prompt,
    });

    setTextContent("");
  };

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.style.height = "0px";
    input.style.height = `${input.scrollHeight}px`;
  }, [textContent]);

  const suggestions = messages.length === 0 ? prefilledSuggestions : [];

  return (
    <div className="flex flex-col gap-l bg-none relative">
      <Suggestions
        suggestions={suggestions}
        collapsed={messages.length > 0}
        executePrompt={executePrompt}
      />

      <div className="py-xs px-s border border-default rounded-xl flex items-center justify-between gap-s bg-elevated">
        <input
          type="text"
          placeholder="Type here..."
          className="flex-1 outline-none"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <IconButton
          variant="primary"
          icon={isRunning ? <StopCircle /> : <ArrowUp />}
          onClick={isRunning ? onCancel : handleSubmit}
        />
      </div>
    </div>
  );
};
