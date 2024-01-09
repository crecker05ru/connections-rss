import { createReducer,on } from "@ngrx/store";
import { PeoplesConversationsResponse, PeoplesState } from "../../shared/models/peoples.model";
import { PeoplesActions } from "../actions/peoples.actions";


export const initialState: PeoplesState = {
  peoples: {
    Count: 0,
    Items: []
  },
  isLoading:  false,
  responseMessage: '',
  conversationIDs: [],
  conversations: null,
  timer: undefined,
  canUpdate: true

}
export const peoplesReducer = createReducer(
initialState,
on(PeoplesActions.setCanUpdate,(state,{canUpdate}) => {
  return {...state, canUpdate}
}),
on(PeoplesActions.setTimer,(state,{timer}) => {
  return {...state,timer}
}),
on(PeoplesActions.setLoading,(state,{isLoading}) => {
  return {...state, isLoading}
}),
on(PeoplesActions.setResponseMessage,(state, {responseMessage}) => {
  return {...state, responseMessage}
}),
on(PeoplesActions.loadUsers,(state,{peoples}) => {
  return {...state, peoples}
}),
on(PeoplesActions.loadConversations,(state,{conversations}) => {
  return {...state, conversations: conversations as PeoplesConversationsResponse}
}),
on(PeoplesActions.createConversation,(state,{conversationId}) => {
  state.conversationIDs.push(conversationId)
  return state
})
)