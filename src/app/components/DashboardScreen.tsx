import { ArrowRightIcon } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader } from "./Loader";
import { Button } from "@crayonai/react-ui";
import { AnimatePresence, m } from "framer-motion";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppStateContext } from "../context/AppStateContext";

interface DashboardScreenProps {
  loading: boolean;
  isPromptsFetchError?: boolean;
}

interface CardStreamingState {
  id: string; // prompt id
  prompt: string;
  status: "streaming" | "done";
}

export const DashboardScreen = ({
  loading,
  isPromptsFetchError,
}: DashboardScreenProps) => {
  const [cardStreamingStates, setCardStreamingStates] = useState<
    CardStreamingState[]
  >([]);

  const appState = useContext(AppStateContext);

  const latestCards =
    appState.conversation[appState.conversation.length - 1].cards;

  // state to set the initial streaming state for all cards
  useEffect(() => {
    if (!latestCards || latestCards.length === 0) return;
    if (cardStreamingStates.length > 0) return; // Only populate once

    setCardStreamingStates(
      latestCards.map((card) => ({
        id: card.id,
        prompt: card.prompt,
        status: "streaming" as const,
      }))
    );
  }, [latestCards, cardStreamingStates]);

  const markCardAsDone = useCallback(
    (promptId: string, c1Response: string) => {
      setCardStreamingStates((prev) =>
        prev.map((card) =>
          card.id === promptId ? { ...card, status: "done" } : card
        )
      );
      appState.updateCardUI(promptId, c1Response);
    },
    [appState]
  );

  const allCardsDoneStreaming = cardStreamingStates.every(
    (card) => card.status === "done"
  );

  useEffect(() => {
    if (allCardsDoneStreaming) {
      appState.updateStatus("fulfilled");
    }
  }, [allCardsDoneStreaming, latestCards, appState]);

  const noResponsesAvailable = latestCards.length === 0 && !isPromptsFetchError;

  return (
    <m.div
      className="flex min-h-screen w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col w-full bg-black/1">
        <Header />

        <div className="flex flex-1 mt-[48px]">
          <Sidebar lowFidelity />

          <div className="flex-1 items-center justify-center p-4">
            {loading ? (
              <Loader />
            ) : isPromptsFetchError || noResponsesAvailable ? (
              <div className="flex flex-col gap-4 pt-[60px] pb-[100px] w-full h-full justify-center items-center">
                <p className="text-sm text-red-500/80">
                  {isPromptsFetchError
                    ? "There was an error fetching your data. Please try again."
                    : "It looks like your prompt didn't result in any data. Please try again with a different prompt."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 pt-[60px] pb-[100px] max-w-full">
                <div className="columns-1 xl:columns-2 gap-4">
                  {latestCards.map((card) => (
                    <div key={card.id} className="mb-4 break-inside-avoid">
                      <AnalyticsCard
                        card={card}
                        markCardAsDone={markCardAsDone}
                      />
                    </div>
                  ))}
                </div>
                <AnimatePresence>
                  {(allCardsDoneStreaming || isPromptsFetchError) && (
                    <m.div
                      key="footer"
                      className="text-center mt-[100px] flex flex-col items-center gap-[24px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <p className="text-sm text-gray-500">
                        This dashboard is powered by the C1 GenUI API <br /> and
                        uses sample data for demonstration purposes.
                      </p>
                      <Button
                        variant="secondary"
                        size="large"
                        iconRight={<ArrowRightIcon />}
                        onClick={() =>
                          window.open(
                            "https://docs.thesys.dev/guides/overview",
                            "_blank"
                          )
                        }
                      >
                        View Documentation
                      </Button>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
};
