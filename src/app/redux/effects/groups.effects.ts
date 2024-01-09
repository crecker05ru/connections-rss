import { inject } from '@angular/core';
import { GroupsService } from '../../core/services/groups.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { GroupsActions } from '../actions/groups.actions';
import { GroupsSuccessResponse } from '../../shared/models/groups.model';
import { HttpResponseBase } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { GroupDialogMessagesResponse } from '../../shared/models/groupDialog.model';
import { GroupDialogActions } from '../actions/groupDialog.actions';
import { GroupDialogService } from '../../core/services/groupDialog.service';

const cache = new Map();
export const onLoadGroup$ = createEffect(
  (
    actions$ = inject(Actions),
    groupsService = inject(GroupsService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType('Groups section load'),
      switchMap((action) => {
        console.log("ofType('Groups section load')");
        const serialAction = JSON.stringify(action);
        const callable = groupsService.getGroups();
        if (cache.has(serialAction)) {
          console.log('if(cache.has(serialAction))');
          const cached: GroupsSuccessResponse = cache.get(serialAction);
          return of(GroupsActions.loadGroups({ groups: cached }));
        } else {
          console.log('else(!cache.has(serialAction))');

          return callable.pipe(
            map((answer) => {
              cache.set(serialAction, answer);
              // groupsService.createCountdown();
              return GroupsActions.loadGroups({
                groups: answer as GroupsSuccessResponse,
              });
            }),
            catchError((error: { message: string }) => of())
          );
        }
      })
    );
  },
  { functional: true }
);

export const onLoadGroupDialogs$ = createEffect(
  (
    actions$ = inject(Actions),
    groupDialogService = inject(GroupDialogService)
  ) => {
    return actions$.pipe(
      ofType('Groups dialogs load'),
      exhaustMap((action) => {
        const serialAction = JSON.stringify(action);

        const callable = groupDialogService.getMessages({
          groupID: action?.id,
        });

        if (cache.has(serialAction)) {
          console.log('if(cache.has(serialAction))');
          const cached: GroupDialogMessagesResponse = cache.get(serialAction);
          return of(GroupDialogActions.getMessages({ messages: cached }));
        } else {
          console.log('else(!cache.has(serialAction))');

          return callable.pipe(
            map((answer) => {
              cache.set(serialAction, answer);
              return GroupDialogActions.getMessages({
                messages: answer as GroupDialogMessagesResponse,
              });
            }),
            catchError((error: { message: string }) => of())
          );
        }
      })
    );
  },
  { functional: true }
);
