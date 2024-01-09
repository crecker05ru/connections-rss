import { createActionGroup, props } from "@ngrx/store";
import { PeoplesConversationsCreate, PeoplesConversationsResponse, PeoplesState, PeoplesSuccessResponse } from "../../shared/models/peoples.model";
import { Observable } from "rxjs";

export const PeoplesActions = createActionGroup({
  source: 'peoples',
  events: {
    'Set canUpdate': props<{canUpdate: boolean}>(),
    'Set timer': props<{timer: Observable<number> | number}>(),
    'Set loading': props<{isLoading: boolean}>(),
    'Set response message': props<{responseMessage: string}>(),
    'Load users': props<{peoples:PeoplesSuccessResponse}>(),
    'Load conversations': props<{conversations: PeoplesConversationsResponse}>(),
    'Set conversations ids': props<{conversationsIDs: string[]}>(),
    'Create conversation': props<{conversationId: string}>()
  }
})