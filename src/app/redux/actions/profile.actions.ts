import { createActionGroup,props } from "@ngrx/store";
import { ProfileResponseSuccess } from "../../shared/models/profile.models";


export const ProfileActions = createActionGroup({
  source: 'profile',
  events: {
    // 'Load profile': props<{data: ProfileRequestHeaders}>()
    'Load profile': props<{profile: ProfileResponseSuccess}>(),
    'Load profile page': props<{profile: ProfileResponseSuccess}>(),
    'Set profile data': props<{profile: ProfileResponseSuccess}>(),
    'Update profile': props<{newName: string}>(),
    'Set response message': props<{responseMessage: string}>(),
    'Clear response message': props<{responseMessage: string}>(),
    'Set loading': props<{isLoading: boolean}>(),
  }
})