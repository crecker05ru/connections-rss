import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ConversationMessagesResponse } from "../../shared/models/conversation.model";
import { Observable } from "rxjs";

export const ConversationActions = createActionGroup({
  source: 'conversation',
  events: {
    'Set canUpdate': props<{canUpdate: boolean}>(),
    'Set timer': props<{timer: Observable<number>}>(),
    'Set loading': props<{isLoading: boolean}>(),
    'Set response message': props<{responseMessage: string}>(),
    'Get messages': props<{conversationMessages: ConversationMessagesResponse}>(),
    'Update messages': props<{newMessages: ConversationMessagesResponse}>(),
    'Send message': emptyProps()
  }
})