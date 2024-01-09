import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {  catchError,  exhaustMap,  map, of, switchMap } from "rxjs";
import { PeoplesService } from "../../core/services/peoples.service";
import { PeoplesConversationsResponse, PeoplesSuccessResponse } from "../../shared/models/peoples.model";
import { PeoplesActions } from "../actions/peoples.actions";
import { ConversationService } from "../../core/services/conversation.service";
import { ConversationMessagesResponse } from "../../shared/models/conversation.model";
import { ConversationActions } from "../actions/conversation.actions";

const cache = new Map()
export const onLoadPeoples$ = createEffect(
  (actions$ = inject(Actions),peoplesService = inject(PeoplesService)) => {
    return actions$.pipe(
    ofType('Peoples section load'),
    switchMap((action) => {
      console.log("ofType('Peoples section load')")
      const serialAction = JSON.stringify(action)
      
      const callable = peoplesService.getUsers()
      const reqPayload = action

      if(cache.has(serialAction)){
        console.log('if(cache.has(serialAction))')
        const cached: PeoplesSuccessResponse = cache.get(serialAction)
        return of(PeoplesActions.loadUsers({peoples: cached}))
      } else {
  console.log('else(!cache.has(serialAction))')
      return callable.pipe(
        map((answer) => {
          cache.set(serialAction,answer)
          return PeoplesActions.loadUsers({peoples: answer as PeoplesSuccessResponse})
        }),
        catchError((error: {message: string}) => of())
      )
      }
    }))
  },{functional: true}
)

export const onLoadPeoplesConversations$ = createEffect(
  (actions$ = inject(Actions),peoplesService = inject(PeoplesService)) => {
    return actions$.pipe(
    ofType('Peoples conversations load'),
    switchMap((action) => {
      console.log("ofType('Peoples section load')")
      const serialAction = JSON.stringify(action)
      
      const callable = peoplesService.getConversations()
      const reqPayload = action

      if(cache.has(serialAction)){
        console.log('if(!cache.has(serialAction))')
        const cached: PeoplesConversationsResponse = cache.get(serialAction)
        return of(PeoplesActions.loadConversations({conversations: cached}))
      } else {
  console.log('else(!cache.has(serialAction))')
      return callable.pipe(
        map((answer) => {
          cache.set(serialAction,answer)
          return PeoplesActions.loadConversations({conversations: answer as PeoplesConversationsResponse})
        }),
        catchError((error: {message: string}) => of())
      )
      }
    }))
  },{functional: true}
)

export const onLoadConversationMessages$ = createEffect(
  (actions$ = inject(Actions),conversationService = inject(ConversationService)) => {
    return actions$.pipe(
    ofType('Conversation messages load'),
    exhaustMap((action) => {
      const serialAction = JSON.stringify(action)
      
      const callable = conversationService.getMessages({conversationID: action?.id})
      
      if(cache.has(serialAction)){
        console.log('if(cache.has(serialAction))')
        const cached: ConversationMessagesResponse = cache.get(serialAction)
        return of(ConversationActions.getMessages({conversationMessages: cached}))
      } else {

  console.log('else(!cache.has(serialAction))')

      return callable.pipe(
        map((answer) => {
          cache.set(serialAction,answer)
          // conversationService.createCountdown()
          return ConversationActions.getMessages({conversationMessages: answer as  ConversationMessagesResponse})
        }),
        catchError((error: {message: string}) => of())
      )

      }

    }))
  },{functional: true}
)