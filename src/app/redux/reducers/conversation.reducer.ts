import { createReducer, on } from "@ngrx/store"
import { PeoplesConversationsCreate } from "../../shared/models/peoples.model"
import { ConversationActions } from "../actions/conversation.actions"
import { ConversationMessagesResponse } from "../../shared/models/conversation.model"
import { Observable } from "rxjs"

export interface ConversationState {
  isLoading: boolean
  responseMessage: string,
  conversationMessages: ConversationMessagesResponse | undefined
  timer: Observable<number> | undefined
  canUpdate: boolean
}
export const initialState: ConversationState = {
  isLoading:  false,
  responseMessage: '',
  conversationMessages: undefined,
  timer: undefined,
  canUpdate: true
}

export const conversationReducer = createReducer(
  initialState,
  on(ConversationActions.setCanUpdate,(state,{canUpdate}) => {
    return {...state, canUpdate}
  }),
  on(ConversationActions.setTimer,(state,{timer}) => {
    return {...state,timer}
  }),
  on(ConversationActions.setLoading,(state,{isLoading}) => {
    return {...state,isLoading}
  }),
  on(ConversationActions.setResponseMessage,(state,{responseMessage}) => {
    return {...state,responseMessage}
  }),
  on(ConversationActions.getMessages,(state,{conversationMessages}) => {
    return {...state, conversationMessages}
  }),
  on(ConversationActions.updateMessages,(state,{newMessages}) => {
    console.log('newMessages',newMessages)
    return {...state,messages : {...state.conversationMessages,Items: [...state.conversationMessages!.Items,...newMessages.Items]}}
  }),
  on(ConversationActions.sendMessage,(state) => state)
)