import { createFeatureSelector } from "@ngrx/store";
import { IProfile, ProfileResponseSuccess, ProfileState } from "../../shared/models/profile.models";

export const selectorProfile = createFeatureSelector<ProfileState>('profile')