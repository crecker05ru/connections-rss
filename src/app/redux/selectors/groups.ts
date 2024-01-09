import { createFeatureSelector } from "@ngrx/store";
import { GroupsState } from "../../shared/models/groups.model";
export const selectorGroups = createFeatureSelector<GroupsState>('groups')