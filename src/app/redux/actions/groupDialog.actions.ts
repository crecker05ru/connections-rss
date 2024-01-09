import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { GroupDialogMessagesResponse } from "../../shared/models/groupDialog.model";
import { Observable } from "rxjs";

export const GroupDialogActions = createActionGroup({
  source: 'groupDialog',
  events: {
    'Set canUpdate': props<{canUpdate: boolean}>(),
    'Set timer': props<{timer: Observable<number>}>(),
    'Set loading': props<{isLoading: boolean}>(),
    'Set response message': props<{responseMessage: string}>(),
    'Update messages': props<{newMessages: GroupDialogMessagesResponse}>(),
    'Get messages': props<{messages: GroupDialogMessagesResponse}>(),
    'Send message': emptyProps()
  }
})