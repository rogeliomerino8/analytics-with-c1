import { useThreadActions, useThreadState } from "@crayonai/react-core";
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { clsx } from "clsx";
import { IconButton } from "@crayonai/react-ui";
import { ArrowUp, StopCircle } from "lucide-react";

export const Composer = ({ className }: { className?: string }) => {
  const [textContent, setTextContent] = useState("");
  const { processMessage, onCancel } = useThreadActions();
  const { isRunning } = useThreadState();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!textContent.trim() || isRunning) {
      return;
    }

    processMessage({
      type: "prompt",
      role: "user",
      message: textContent,
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

  return (
    <div
      className={clsx("crayon-copilot-shell-thread-composer", className)}
      style={{ padding: "4px 0 0px" }}
    >
      <div className="crayon-copilot-shell-thread-composer__input-wrapper">
        <textarea
          ref={inputRef}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="crayon-copilot-shell-thread-composer__input"
          placeholder="Type here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <IconButton
          variant="primary"
          onClick={isRunning ? onCancel : handleSubmit}
          icon={isRunning ? <StopCircle size="1em" /> : <ArrowUp size="1em" />}
        />
      </div>
    </div>
  );
};
