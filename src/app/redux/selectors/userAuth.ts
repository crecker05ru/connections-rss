import {createFeatureSelector} from "@ngrx/store"
import { UserAuthState } from "../../shared/models/userAuth.model"

export const selectorUserAuth = createFeatureSelector<UserAuthState>('userAuth')
