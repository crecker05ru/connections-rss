import { createActionGroup,emptyProps,props } from "@ngrx/store";
import { UserSigninData, UserSignupData } from "../../shared/models/userAuth.model";


export const UserAuthActions = createActionGroup({
  source: 'userAuth',
  events: {
    'Signin': props<{userData: UserSigninData}>(),
    'Signup': props<{userData: UserSignupData}>(),
    'Log out': emptyProps(),
    'Set response message': props<{responseMessage: string}>(),
    'Set is loading': props<{isLoading: boolean}>()
  }
})