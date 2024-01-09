import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProfile, ProfileResponseSuccess } from '../../../shared/models/profile.models';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { selectorProfile } from '../../../redux/selectors/profile';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent implements OnInit{
  profileStore$ = this.store.select(selectorProfile)
  isEditMode = false
  isLoading = false
  isProfileLoading = false


@Input() profile: undefined | ProfileResponseSuccess
@Input() responseMessage: undefined | string
@Output() saveEmit = new EventEmitter<string>()
name = new FormControl<string>("",[Validators.required,Validators.maxLength(40)])

constructor(protected store: Store){}

ngOnInit(): void {
  this.profileStore$.subscribe((data) => {
    console.log('profileStore$.subscrib', data)
    this.profile = data.profile
    this.responseMessage = data.responseMessage
    this.isProfileLoading = data.isLoading
    console.log('ProfileViewComponent',data)
    return data
  })
}

toEditMode(){
  this.isEditMode = true
  this.name.setValue((this.profile as ProfileResponseSuccess).name.S)
}

saveProfile(){
  // this.isLoading = true;
  // const updatedProfile: ProfileResponseSuccess = {...this.profile,name: {...this.profile.name},S: this.name.value as string}
  // (this.profile as ProfileResponseSuccess).name.S = this.name.value as string
  // const updatedProfile: ProfileResponseSuccess = JSON.parse(JSON.stringify(this.profile))
  console.log('this.name.value',this.name.value)
  this.saveEmit.emit(this.name.value as string)
  this.isEditMode = !!this.isProfileLoading;

// setTimeout(() => {
//   this.isLoading = false
//   this.isEditMode = false;
// },500)
}

cancel(){ 
  this.isEditMode = false
  this.name.setValue((this.profile as ProfileResponseSuccess).name.S)
}
}
