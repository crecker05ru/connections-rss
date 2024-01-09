import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PeoplesConversationsCreate, PeoplesState } from "../../shared/models/peoples.model";
import { ConversationState } from "../reducers/conversation.reducer";

export const selectorPeoples = createFeatureSelector<PeoplesState>('peoples')
// export const selectConversation = createFeatureSelector<ConversationState>('conversation')
// export const selectPeopleConversation = createSelector(
//   selectorPeoples,
//   selectConversation,
//   (peoples,conversation) => {
//     return peoples.peoples.Items.filter((people) => people.uid.S === conversation.conversationIDs[0].conversationID)
//   }
// )