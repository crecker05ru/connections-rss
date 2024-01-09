import { createReducer,on } from "@ngrx/store";
import { GroupsState } from "../../shared/models/groups.model";
import { GroupsActions } from "../actions/groups.actions";

export const initialState: GroupsState = {
groups:{
  Count: 0,
  Items: []
},
isLoading: false,
responseMessage: '',
groupIDs: [],
timer: undefined,
canUpdate: true
}

export const groupsReducer = createReducer(
  initialState,
  on(GroupsActions.setCanUpdate,(state,{canUpdate}) => {
    return {...state, canUpdate}
  }),
  on(GroupsActions.setTimer,(state,{timer}) => {
    return {...state,timer}
  }),
  on(GroupsActions.setLoading,(state,{isLoading})=> {
    return {...state, isLoading}
  }),
  on(GroupsActions.setResponseMessage,(state,{responseMessage}) => {
    return {...state, responseMessage}
  }),
  on(GroupsActions.loadGroups,(state,{groups}) => {
    return {...state,groups }
  }),
  on(GroupsActions.createGroup,(state,{groupId}) => {
    // return {...state,groupIDs}
    let newItem = {
      id: {
        S: groupId.groupID
      },
      name: {
        S: 'My name'
      },
      createdAt: {
        S: 'now'
      },
      createdBy: {
        S: 'me'
      }
    }
    // return {...state, groupIDs: {...state.groupIDs.concat([groupId])},groups: {...state.groups,Items: {...state.groups.Items.concat(newItem)}}}
    return state
  }),
  on(GroupsActions.deleteGroup,(state,{groupId}) => {
    // return {...state, groupIDs: {...state.groupIDs.filter((group) => group.groupID !== groupId)},groups: {...state.groups,Items: {...state.groups.Items.filter((item) => item.id.S !== groupId)}}}
    return state
  }),
)