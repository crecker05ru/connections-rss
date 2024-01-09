import { createReducer, on } from "@ngrx/store"
import { UserAuthActions } from "../actions/userAuth.actions"
import { UserAuthState } from "../../shared/models/userAuth.model"


export const initialState: UserAuthState =  {
  name: '',
  email: '',
  isLogged: !!localStorage.getItem('response') || false,
  isLoading: false,
  responseMessage: ''
}

export const userAuthReducer = createReducer(
  initialState,
  on(UserAuthActions.signin,(state, {userData}) => {
    return {...state,userData}
  }),
  on(UserAuthActions.logOut,(state) => {
    return {...state,isLogged: false}
  }),
  on(UserAuthActions.setResponseMessage,(state,{responseMessage}) => {
    return {...state,responseMessage}
  }),
  on(UserAuthActions.setIsLoading,(state,{isLoading}) => {
    return {...state,isLoading}
  })
)