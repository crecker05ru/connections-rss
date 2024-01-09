import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { userAuthReducer } from './redux/reducers/userAuth.reducer';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { WithTokenInterceptorProvider } from './shared/providers/withToken.provider';
import { profileReducer } from './redux/reducers/profile.reducer';
import { WithTokenInterceptor } from './shared/http/withToken-interceptor';
import { groupsReducer } from './redux/reducers/groups.reducer';
import { peoplesReducer } from './redux/reducers/peoples.reducer';
import { groupDialogReducer } from './redux/reducers/groupDialog.reducer';
import { conversationReducer } from './redux/reducers/conversation.reducer';
import * as GroupsEffects  from './redux/effects/groups.effects';
import * as PeoplesEffects from './redux/effects/peoples.effects';
import * as ProfileEffects from './redux/effects/profile.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: WithTokenInterceptor, multi: true}, 
    provideRouter(routes), 
    provideStore({
        userAuth: userAuthReducer,
        profile: profileReducer,
        groups: groupsReducer,
        peoples: peoplesReducer,
        groupDialog: groupDialogReducer,
        conversation: conversationReducer
    }), 
    provideEffects(GroupsEffects,PeoplesEffects,ProfileEffects)
  ],
};
