import { Routes } from '@angular/router';
import { MainPageComponent } from './core/pages/main-page/main-page.component';
import { SignupComponent } from './core/pages/signup/signup.component';
import { SigninComponent } from './core/pages/signin/signin.component';
import { ProfileComponent } from './core/pages/profile/profile.component';
import { GroupComponent } from './core/pages/group/group.component';
import { ConversationComponent } from './core/pages/conversation/conversation.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,canActivate: [loginGuard]
  },
  {path: 'signup',component: SignupComponent},
  {path: 'signin',component: SigninComponent},
  {path: 'profile',component: ProfileComponent,canActivate: [loginGuard]},
  {path: 'group/:groupID',component: GroupComponent,canActivate: [loginGuard]},
  {path: 'conversation/:conversationID',component: ConversationComponent,canActivate: [loginGuard]},
  {path: '**',component: NotFoundComponent}
];
