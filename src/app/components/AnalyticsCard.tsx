import { useEffect, useRef } from "react";
import { useUIState } from "../hooks/useUIState";
import { C1Component } from "@thesysai/genui-sdk";

interface AnalyticsCardProps {
  prompt: string;
  updatePrompt: (prompt: string) => void;
  markStreamingDone: (c1Response: string) => void;
}

export const AnalyticsCard = ({ prompt, updatePrompt, markStreamingDone }: AnalyticsCardProps) => {
  const { state, actions } = useUIState();
  const lastPrompt = useRef<string | null>(null);

  useEffect(() => {
    if (state.c1Response && state.c1Response.length > 0 && !state.isLoading) {
      markStreamingDone(state.c1Response);
    }
  });

  useEffect(() => {
    if (!prompt || prompt === lastPrompt.current) return;

    actions.makeApiCall(prompt);
    lastPrompt.current = prompt;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  return (
    <C1Component
      c1Response={state.c1Response}
      isStreaming={state.isLoading}
      updateMessage={(message) => actions.setC1Response(message)}
      onAction={({ llmFriendlyMessage, humanFriendlyMessage }) => {
        if (!state.isLoading) {
          updatePrompt(humanFriendlyMessage);
          actions.makeApiCall(llmFriendlyMessage);
        }
      }}
    />
  );
};
