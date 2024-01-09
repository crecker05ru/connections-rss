import { createFeatureSelector } from "@ngrx/store";
import { ConversationState } from "../reducers/conversation.reducer";

export const selectConversation = createFeatureSelector<ConversationState>('conversation')