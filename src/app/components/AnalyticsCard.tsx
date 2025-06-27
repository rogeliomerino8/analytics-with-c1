import { useEffect } from "react";
import { useUIState } from "../hooks/useUIState";
import { C1Component } from "@thesysai/genui-sdk";
import type { Card } from "../store/state";

interface AnalyticsCardProps {
  card: Card;
  markCardAsDone: (promptId: string, c1Response: string) => void;
}

export const AnalyticsCard = ({
  card,
  markCardAsDone,
}: AnalyticsCardProps) => {
  const { state, actions } = useUIState();

  useEffect(() => {
    if (state.c1Response && state.c1Response.length > 0 && !state.isLoading) {
      markCardAsDone(card.id, state.c1Response);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markCardAsDone, state.c1Response, state.isLoading]);

  useEffect(() => {
    if (!card.prompt) return;
    actions.makeApiCall(card.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.prompt]);

  return (
    <C1Component c1Response={state.c1Response} isStreaming={state.isLoading} />
  );
};
