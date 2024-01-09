import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectorPeoples } from '../../../redux/selectors/peoples';
import { PeoplesService } from '../../services/peoples.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ToastMessagesComponent } from '../../../shared/UI/toast-messages/toast-messages.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, takeWhile, tap, timer } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { GroupDialogMessagesResponse } from '../../../shared/models/groupDialog.model';
import { selectorGroups } from '../../../redux/selectors/groups';
import { selectGroupDialog } from '../../../redux/selectors/groupDialog';
import { ConversationMessagesItem, ConversationMessagesResponse } from '../../../shared/models/conversation.model';
import { PeoplesSuccessResponse } from '../../../shared/models/peoples.model';
import { ConversationService } from '../../services/conversation.service';
import { selectConversation } from '../../../redux/selectors/conversation';
export interface PeopleData {
  uid?: string,
  name?: string,
  message?: string,
  createdAt?: string | Date,
  authorID?: string
}

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [RouterLink,ModalComponent,ToastMessagesComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnInit{
  peoplesStore$ = this.store.select(selectorPeoples)
  conversationStore$ = this.store.select(selectConversation)
  conversationMessages: ConversationMessagesResponse | undefined 
  conversationID: string | undefined 
  conversationIDs: string[] | undefined
  groupDialogStore$ = this.store.select(selectGroupDialog) 
  groupsStore$ = this.store.select(selectorGroups)
  messages: ConversationMessagesResponse | undefined
  Items: ConversationMessagesItem[] | undefined
  peoples: PeoplesSuccessResponse | undefined
  peoplesData: PeopleData[] | undefined
  isMessagesLoading = false
  responseMessage = ''
  message = new FormControl('',Validators.required)
  countdown$ : Observable<number> | undefined
  canUpdate = this.conversationService.canUpdate
  userId = ''
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store,
    protected peopleService: PeoplesService,
    protected modalService: ModalService,
    protected conversationService: ConversationService,
    protected router: Router
  ){}

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('response') || '')?.uid
    this.conversationID = this.route.snapshot.paramMap.get('conversationID') as string
    this.store.dispatch({type:'Peoples section load'})
    this.store.dispatch({type: 'Conversation messages load',id: this.conversationID})
    // this.conversationService.getMessages({conversationID:this.conversationID}).subscribe()
    this.conversationStore$.subscribe((data) => {
    this.conversationMessages = data.conversationMessages
    this.responseMessage = data.responseMessage
    this.isMessagesLoading = data.isLoading
    this.countdown$ = data.timer
    this.canUpdate = data.canUpdate
    // this.countdown$?.subscribe((data) => {
    //   if(data === 0){
    //     this.canUpdate = true
    //   }
    // })
    this.Items = this.messages?.Items.slice().sort((a,b) => {
      if(Number(a.createdAt.S) < Number(b.createdAt.S)) {
        return -1
      }
      else if(Number(a.createdAt.S) > Number(b.createdAt.S)) {
        return 1
      }
      else {return 0}
    })
    })
    if(this.conversationIDs?.indexOf(this.conversationID) === -1){
      this.peopleService.createConversation(this.conversationID)
    }
    // this.peoplesStore$.subscribe((data) => {
    //   this.conversationIDs = data.conversationIDs
    //   this.peoples = data.peoples
    // })

    this.peoplesStore$.subscribe((data) => {
      this.peoples = data.peoples
      this.peoplesData = (this.conversationMessages as ConversationMessagesResponse)?.Items.map((message) => {
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
  console.log('this.peoplesData',this.peoplesData)
  console.log('this.conversationMessages',this.conversationMessages)

  }

  backClick() {
    this.location.back();
  }


  update(){
  this.conversationService.updateMessages({conversationID: this.conversationID,since: Number(this.conversationService.sinceDate)}).subscribe((data) =>{
    this.conversationService.createCountdown()
  })
  
  }

  delete(id: string){
    this.modalService.open(id)
  }

  confirmDelete(){
    // this.groupService.deleteGroup(this.groupID as string).subscribe()
    this.conversationService.delete(this.conversationID as string).subscribe((data) => {
      this.modalService.close()
      setTimeout(() => {
        this.router.navigateByUrl(`/`);
      }, 500);
    })

  }
  sendMessage(){
    // this.groupDialogService.sendMessage(this.groupID as string,this.message.value as string).subscribe()
    // this.groupDialogService.getMessages({groupID: this.groupID,since: 0})
    this.conversationService.sendMessage(this.conversationID as string,this.message.value as string).subscribe((data) => {
      this.conversationService.updateMessages({conversationID: this.conversationID,since: Number(this.conversationService.sinceDate)}).subscribe()
    })
    this.message.setValue('')
    // this.update()
  }
}
