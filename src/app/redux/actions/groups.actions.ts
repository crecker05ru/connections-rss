import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { GroupsCreateResponse, GroupsSuccessResponse } from "../../shared/models/groups.model";
import { Observable } from "rxjs";

export const GroupsActions = createActionGroup({
  source: 'groups',
  events: {
    'Set canUpdate': props<{canUpdate: boolean}>(),
    'Set timer': props<{timer: Observable<number>}>(),
    'Set loading': props<{isLoading: boolean}>(),
    'Set response message': props<{responseMessage: string}>(),
    'Load groups': props<{groups:GroupsSuccessResponse}>(),
    'Create group': props<{groupId: GroupsCreateResponse}>(),
    'Delete group': props<{groupId: string}>()
  }
})