import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { Store } from '@ngrx/store';
import { selectorGroups } from '../../../redux/selectors/groups';
import { GroupsSuccessResponse } from '../../../shared/models/groups.model';
import { GroupItemComponent } from '../group-item/group-item.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { selectorProfile } from '../../../redux/selectors/profile';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { Observable, map, takeWhile, tap, timer } from 'rxjs';
import { ToastMessagesComponent } from '../../../shared/UI/toast-messages/toast-messages.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-section',
  standalone: true,
  imports: [GroupItemComponent,CommonModule,RouterLink,ModalComponent,ToastMessagesComponent,ReactiveFormsModule],
  templateUrl: './group-section.component.html',
  styleUrl: './group-section.component.scss'
})
export class GroupSectionComponent implements OnInit  {
  name = new FormControl<string>("",[Validators.required,Validators.maxLength(30),Validators.pattern(/^[\w\s-]+$/)])
  groupsStore$ = this.store.select(selectorGroups)
  profileStore$ = this.store.select(selectorProfile)
  // countdown$ = timer(0,1000).pipe(
  //   map(n => 60 - n),
  //   takeWhile(n => n >= 0),
  //   tap((data) => {
  //     if(data === 0){
  //       this.canUpdate = true
  //     }
  //   })
  // )
  countdown$: Observable<number> | undefined
  userId = ''
  groupIdForDelete = ''
  groups: GroupsSuccessResponse | undefined
  isGroupLoading = false
  canUpdate = true
  public responseMessage: string | undefined
  constructor(
    private groupsService: GroupsService,
    protected modalService: ModalService,
    private store: Store,
    public router: Router,
  ){}
ngOnInit(): void {
  this.store.dispatch({type:'Groups section load'})
  this.userId = JSON.parse(localStorage.getItem('response') || '')?.uid
  // this.groupsService.getGroups().subscribe()
  this.groupsStore$.subscribe((data) => {
    console.log('data in groupsStore$',data)
    this.groups = data.groups
    this.isGroupLoading = data.isLoading
    this.responseMessage = data.responseMessage
    this.countdown$ = data.timer
    this.canUpdate = data.canUpdate
    // this.countdown$?.subscribe((data) => {
    //   if(data === 0){
    //     this.canUpdate = true
    //   }
    // })
    console.log('this.canUpdate',this.canUpdate)
    console.log('this.isGroupLoading',this.isGroupLoading)
    console.log('data.groups',data.groups)
    console.log('GroupSectionComponent data',data)
    
  })
  // this.profileStore$.subscribe((data) => {
  //   console.log('data.profile in  group section',data.profile)
  // })
}

update(){
  // this.canUpdate = false
  this.groupsService.updateGroups().subscribe((data) =>{
  })
}

createGroup(modalId:string){
  this.modalService.open(modalId)
}

deleteGroup(Id: string){
  this.modalService.open('group-section-modal')
  this.groupIdForDelete = Id
}

confirmDelete(){
this.groupsService.deleteGroup(this.groupIdForDelete).subscribe((data) => {
this.modalService.close()
this.groupIdForDelete = ''
})  
}

confirmCreate(){
  this.groupsService.create(this.name.value as string).subscribe((data) => {
    this.modalService.close()
  })
}
}
