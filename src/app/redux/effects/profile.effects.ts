import { inject } from '@angular/core';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../core/services/profile.service';
import { ProfileActions } from '../actions/profile.actions';
import { ProfileResponseSuccess,IProfile } from '../../shared/models/profile.models';
import { Store } from '@ngrx/store';
const cache = new Map()

// export const loadProfile = createEffect(
//   (actions$ = inject(Actions),profileService = inject(ProfileService)) => {
//     return actions$.pipe(
//       ofType('Profile page loaded'),
//       exhaustMap(() => {
//         return profileService.loadProfile().pipe(
//           map((data) => 
//           {
//             const profile:IProfile = {
//               userId: (data as ProfileResponseSuccess).uid,
//               username: (data as ProfileResponseSuccess).name,
//               createdAt: (data as ProfileResponseSuccess).createdAt,
//               email: (data as ProfileResponseSuccess).email
//             }
//             ProfileActions.loadProfile({profile})
//           },
//           catchError((error:{message: string}) => error.message)
//           )
//         )
//       })
//     )
//   },{functional: true}
// )


export const displayErrorAlert = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType('Profile Error'),
      tap(({ errorMsg }) => alert(errorMsg))
    );
  },
  { functional: true, dispatch: false }
);

export const onLoadPeoples$ = createEffect(
  (actions$ = inject(Actions),profileService = inject(ProfileService),store = inject(Store)) => {
    return actions$.pipe(
    ofType('Profile page loaded'),
    switchMap((action) => {
      console.log("ofType('Peoples section load')")
      const serialAction = JSON.stringify(action)
      
      const callable = profileService.loadedProfilePage()
      const reqPayload = action

      if(cache.has(serialAction)){
        console.log('if(cache.has(serialAction))')
        const cached: ProfileResponseSuccess = cache.get(serialAction)
        store.dispatch(ProfileActions.setLoading({isLoading: false})) 
        return of(ProfileActions.setProfileData({profile: cached}))
      } else {
  console.log('else(!cache.has(serialAction))')
      return callable.pipe(
        map((answer) => {
          cache.set(serialAction,answer)
          store.dispatch(ProfileActions.setLoading({isLoading: false})) 
          return ProfileActions.setProfileData({profile: answer as ProfileResponseSuccess})
        }),
        catchError((error: {message: string}) => of())
      )
      }
    }))
  },{functional: true}
)