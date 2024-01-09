import { createReducer, on } from "@ngrx/store"
import { GroupDialogMessagesItem, GroupDialogMessagesResponse } from "../../shared/models/groupDialog.model"
import { GroupDialogActions } from "../actions/groupDialog.actions"
import { Observable } from "rxjs"

export interface GroupDialogsState {
  isLoading: boolean
  responseMessage: string
  messages: GroupDialogMessagesResponse | undefined
  timer: Observable<number> | undefined
  canUpdate: boolean
}
export const initialState : GroupDialogsState = {
isLoading: false,
responseMessage: '',
messages: undefined,
timer: undefined,
canUpdate: true
}

export const groupDialogReducer = createReducer(
  initialState,
  on(GroupDialogActions.setCanUpdate,(state,{canUpdate}) => {
    return {...state, canUpdate}
  }),
  on(GroupDialogActions.setTimer,(state,{timer}) => {
    return {...state,timer}
  }),
  on(GroupDialogActions.setLoading,(state,{isLoading}) => {
    return {...state,isLoading}
  }),
  on(GroupDialogActions.setResponseMessage,(state,{responseMessage}) => {
    return {...state,responseMessage}
  }),
  on(GroupDialogActions.getMessages,(state,{messages}) => {
    return {...state, messages}
  }),
  on(GroupDialogActions.updateMessages,(state,{newMessages}) => {
    // return {...state,messages : {...state.messages,Items: {...state.messages?.Items.concat(newMessages.Items)}}}
    console.log('newMessages',newMessages)
    return {...state,messages : {...state.messages,Items: [...state.messages!.Items,...newMessages.Items]}}
  }),
  on(GroupDialogActions.sendMessage,(state) => state)
)