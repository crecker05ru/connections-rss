import { createFeatureSelector } from "@ngrx/store";
import { GroupDialogsState } from "../reducers/groupDialog.reducer";

export const selectGroupDialog = createFeatureSelector<GroupDialogsState>('groupDialog')