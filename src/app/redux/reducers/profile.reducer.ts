import { createReducer, on } from "@ngrx/store";
import { IProfile, ProfileResponseSuccess, ProfileState } from "../../shared/models/profile.models";
import { ProfileActions } from "../actions/profile.actions";

export const initialState: ProfileState = {
  profile: {
    uid: {S: ''},
    email: {S: ''},
    createdAt: {S: ''},
    name: {S: ''}
  },
  isLoading: false,
  responseMessage: ''

}

export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loadProfile,(state, {profile}) => {
    return {...state, profile}
  }),
  on(ProfileActions.setProfileData,(state,{profile}) => {
    console.log('state,profile',state,profile)
    return {...state, profile}
  }),
  on(ProfileActions.loadProfilePage,(state,{profile}) => {
    return {...state, profile}
  }),
  on(ProfileActions.updateProfile,(state,{newName}) => {
    // return {...state,profile:{...state.profile}, name: {...state.profile.name,S: newName}}
    return {...state,profile: {...state.profile,name: {...state.profile.name,S: newName}}}
  }),
  on(ProfileActions.setResponseMessage,(state,{responseMessage}) => {
    return {...state,responseMessage}
  }),
  on(ProfileActions.setLoading,(state,{isLoading}) => {
    return {...state,isLoading}
  })
  )