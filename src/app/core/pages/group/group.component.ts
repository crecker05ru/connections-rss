import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Observable, map, takeWhile, tap, timer } from 'rxjs';
import { GroupsService } from '../../services/groups.service';
import { Store } from '@ngrx/store';
import { GroupDialogService } from '../../services/groupDialog.service';
import { selectGroupDialog } from '../../../redux/selectors/groupDialog';
import { GroupDialogMessagesItem, GroupDialogMessagesResponse } from '../../../shared/models/groupDialog.model';
import { ToastMessagesComponent } from '../../../shared/UI/toast-messages/toast-messages.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { selectorGroups } from '../../../redux/selectors/groups';
import { GroupsItem, GroupsSuccessResponse } from '../../../shared/models/groups.model';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { selectorPeoples } from '../../../redux/selectors/peoples';
import { PeoplesSuccessResponse } from '../../../shared/models/peoples.model';
export interface PeopleData {
  uid?: string,
  name?: string,
  message?: string,
  createdAt?: string | Date,
  authorID?: string
}

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [RouterLink,CommonModule,ToastMessagesComponent,ReactiveFormsModule,ModalComponent,SortPipe],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})

export class GroupComponent implements OnInit{
  groupDialogStore$ = this.store.select(selectGroupDialog) 
  peoplesStore$ = this.store.select(selectorPeoples)
  groupsStore$ = this.store.select(selectorGroups)
  messages: GroupDialogMessagesResponse | undefined
  peoples: PeoplesSuccessResponse | undefined
  peoplesData: PeopleData[] | undefined
  Items: GroupDialogMessagesItem[] | undefined
  groups : undefined | GroupsSuccessResponse
  isMessagesLoading = false
  groupID: string | undefined 
  filteredByUserGroups : undefined | GroupsItem[]
  responseMessage = ''
  isMyGroup = false
  message = new FormControl('',Validators.required)
  countdown$ : Observable<number> | undefined
  canUpdate = true
  userId = ''
  sinceDate = this.groupDialogService.sinceDate
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private groupService: GroupsService,
    protected groupDialogService: GroupDialogService,
    protected modalService: ModalService,
    private store: Store
  ){}

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('response') || '')?.uid

    this.groupID = this.route.snapshot.paramMap.get('groupID') as string
    this.store.dispatch({type:'Groups section load'})
    this.store.dispatch({type: 'Groups dialogs load',id: this.groupID})
    this.store.dispatch({type:'Peoples section load'})
    // this.groupDialogService.initialMessages({groupID: this.groupID,since: 0})?.subscribe()
    // this.countdown$ = this.groupDialogService.countdown$
    // console.log('this.groupDialogService.countdown$',this.groupDialogService.countdown$)
    this.groupDialogStore$.subscribe((data) => {
      this.responseMessage = data.responseMessage
      this.messages = data.messages
      this.Items = this.messages?.Items.slice().sort((a,b) => {
        if(Number(a.createdAt.S) < Number(b.createdAt.S)) {
          return -1
        }
        else if(Number(a.createdAt.S) > Number(b.createdAt.S)) {
          return 1
        }
        else {return 0}
      })
      this.isMessagesLoading = data.isLoading
      this.countdown$ = data.timer
      this.canUpdate = data.canUpdate
      console.log('data.timer',data.timer)
    })
    this.peoplesStore$.subscribe((data) => {
        this.peoples = data.peoples
        // this.peoplesData = (data.peoples as PeoplesSuccessResponse)?.Items.map((people) => {
        //   let user = (this.messages as GroupDialogMessagesResponse).Items.find((message) => message.authorID === people.uid)
        //     return {
        //       uid: people.uid.S,
        //       name: people.name.S,
        //       message: user?.message.S,
        //       createdAt: user?.createdAt.S,
        //       authorID: user?.authorID.S
        //     }
        // })
        this.peoplesData = (this.messages as GroupDialogMessagesResponse)?.Items.map((message) => {
          const user = (data.peoples as PeoplesSuccessResponse)?.Items.find(people => people.uid.S === message.authorID.S)
                      return {
              uid: user?.uid.S,
              name: user?.name.S,
              message: message?.message.S,
              createdAt: message?.createdAt.S,
              authorID: message?.authorID.S
            }
        } ).sort((a,b) => {
          if(Number(a.createdAt) < Number(b.createdAt)) {
            return -1
          }
          else if(Number(a.createdAt) > Number(b.createdAt)) {
            return 1
          }
          else {return 0}
        })
    })
    // this.groupsStore$.subscribe((data) => {
    //   this.groups = data.groups
    //   this.filteredByUserGroups = data.groups.Items.filter((item) => item.createdBy.S === this.userId)
    //   if(this.filteredByUserGroups.length > 0){
    //     this.isMyGroup = true
    //   }
    // })

    if(!this.groups) {
      // this.groupService.getGroups().subscribe()
    }
  }

  backClick() {
    this.location.back();
  }

  update(){
  //   this.groupService.getGroups().subscribe((data) =>{
  //     this.canUpdate = false
  // this.countdown$ = timer(0,1000).pipe(
  //   map(n => 60 - n),
  //   takeWhile(n => n >= 0),
  //   tap((data) => {
  //     if(data === 0){
  //       this.canUpdate = true
  //     }
  //   })
  // )
  // setTimeout(() => this.canUpdate = true, 60000)
  //   })
  this.groupDialogService.updateMessages({groupID:this.groupID,since: Number(this.groupDialogService.sinceDate)})?.subscribe((data) => {
    this.groupDialogService.createCountdown()
  //         this.canUpdate = false
  // this.countdown$ = timer(0,1000).pipe(
  //   map(n => 60 - n),
  //   takeWhile(n => n >= 0),
  //   tap((data) => {
  //     if(data === 0){
  //       this.canUpdate = true
  //     }
  //   })
  // )
  // setTimeout(() => this.canUpdate = true, 60000)
  })
  
  }

  delete(id: string){
    this.modalService.open(id)
  }

  confirmDelete(){
    this.groupService.deleteGroup(this.groupID as string).subscribe()

  }
  sendMessage(){
    this.groupDialogService.sendMessage(this.groupID as string,this.message.value as string).subscribe((data) => {
    this.groupDialogService.updateMessages({groupID:this.groupID,since: Number(this.groupDialogService.sinceDate)}).subscribe()
    })
    this.message.setValue('')
  }
}
