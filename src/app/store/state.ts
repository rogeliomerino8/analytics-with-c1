import { makeAutoObservable } from "mobx";
import type { PromptInfo } from "../page";

export interface Card {
  id: string;
  prompt: string;
  ui?: string; // c1 response data
}

interface ConversationPart {
  query: string;
  cards: Card[];
}

type Status =
  | "awaiting_prompt"
  | "orchestrating"
  | "generating_responses"
  | "fulfilled"
  | "failed";

export class AppState {
  conversation: ConversationPart[];
  status: Status;

  constructor() {
    this.conversation = [];
    this.status = "awaiting_prompt";

    makeAutoObservable(this);
  }

  addQuery(query: string) {
    this.conversation.push({
      query,
      cards: [],
    });
    this.status = "orchestrating";
  }

  updateStatus(status: Status) {
    this.status = status;
  }

  addCard(card: Card) {
    this.conversation[this.conversation.length - 1].cards.push(card);
  }

  addPrompts(prompts: PromptInfo[]) {
    const cards: Card[] = prompts.map((prompt) => ({
      id: prompt.id,
      prompt: prompt.text,
    }));
    this.conversation[this.conversation.length - 1].cards.push(...cards);
    this.updateStatus("generating_responses");
  }

  updateCardUI(id: string, c1Response: string) {
    const card = this.conversation[this.conversation.length - 1].cards.find(
      (card) => card.id === id
    );
    if (card) {
      card.ui = c1Response;
    }
  }
}
