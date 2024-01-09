import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Store } from '@ngrx/store';
import { selectorProfile } from '../../../redux/selectors/profile';
import { CommonModule } from '@angular/common';
import { ProfileViewComponent } from '../../components/profile-view/profile-view.component';
import { IProfile, ProfileResponseSuccess } from '../../../shared/models/profile.models';
import { selectorUserAuth } from '../../../redux/selectors/userAuth';
import { AuthService } from '../../services/auth.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ProfileViewComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  profileStore$ = this.store.select(selectorProfile)
  userAuthStore$ = this.store.select(selectorUserAuth)
  profileErrorMessage = this.profileService.httpMessage
  public profile: ProfileResponseSuccess | undefined
  public responseMessage: string | undefined
  public isProfileLoading: boolean | undefined
  public isUserAuthLoading: boolean | undefined
  public isLogged: boolean | undefined
  constructor(
    public profileService: ProfileService,
    public authService: AuthService,
  private store: Store,
  public router: Router
  ){}

  ngOnInit(): void {
    // this.store.dispatch({type: 'Profile page loaded'})

    // this.profileService.loadedProfilePage().subscribe()
    this.store.dispatch({type: 'Profile page loaded'})
    this.profileStore$.subscribe((data) => {
      console.log('profileStore$.subscrib', data)
      this.profile = data.profile
      this.responseMessage = data.responseMessage
      this.isProfileLoading = data.isLoading
      return data
    })
    this.userAuthStore$.subscribe((data) => {
      this.isUserAuthLoading = data.isLoading
      this.isLogged = data.isLogged
      this.responseMessage = data.responseMessage
    })


    setTimeout(() => {
      console.log('this.profileService.profile',this.profileService.profile)
      console.log('this.profile',this.profile)
      console.log('this.profileStore$',this.profileStore$)
    },2000)
  }

  onSave(newName: string){
    console.log('newName',newName)
    this.profileService.editProfile(newName).subscribe()
  }

  logout(){
    this.authService.logout().subscribe((data) => {
      if(!this.isLogged){
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 1200);
      }
      // if(data.ok){
      //           setTimeout(() => {
      //     this.router.navigateByUrl('/signin');
      //   }, 1200);
      // }
    })
  }

}
