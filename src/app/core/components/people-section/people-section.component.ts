import { Component, OnInit } from '@angular/core';
import { PeoplesService } from '../../services/peoples.service';
import { Store } from '@ngrx/store';
import { selectorPeoples } from '../../../redux/selectors/peoples';
import { PeoplesConversationsCreate, PeoplesConversationsResponse, PeoplesSuccessResponse } from '../../../shared/models/peoples.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, map, takeWhile, tap, timer } from 'rxjs';
import { ToastMessagesComponent } from '../../../shared/UI/toast-messages/toast-messages.component';
import { ActiveConversationDirective } from '../../../shared/directives/activeConversation.directive';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-people-section',
  standalone: true,
  imports: [CommonModule,RouterLink,ToastMessagesComponent,ActiveConversationDirective],
  templateUrl: './people-section.component.html',
  styleUrl: './people-section.component.scss'
})
export class PeopleSectionComponent implements OnInit{
  peoplesStore$ = this.store.select(selectorPeoples)
  countdown$: Observable<number> | undefined | number | any
  peoples: PeoplesSuccessResponse | undefined
  conversations: PeoplesConversationsResponse | undefined
  conversationIDs = ['']
  companionIDs = ['']
  isPeoplesLoading = false
  canUpdate = true
  responseMessage = ''
  constructor(
    private peoplesService: PeoplesService,
    private store: Store,
    private router: Router,
    protected conversationService: ConversationService
  ){}

  ngOnInit(): void {
    this.store.dispatch({type:'Peoples section load'})
    this.store.dispatch({type:'Peoples conversations load'})
    // this.peoplesService.getUsers().subscribe()
    // this.peoplesService.getConversations().subscribe()
    this.peoplesStore$.subscribe((data) => {
      console.log('data in peoplesStore$',data)
      if((data.peoples as PeoplesSuccessResponse).Items.length < 1){
        console.log('data data.peoples as PeoplesSuccessResponse).Items.length < 1',data)
      }
        this.peoples = data.peoples
        this.isPeoplesLoading = data.isLoading
        this.conversations = data.conversations as PeoplesConversationsResponse
        this.responseMessage = data.responseMessage
        this.companionIDs = (data.conversations as PeoplesConversationsResponse)?.Items.map((item) => item.companionID.S)
        this.conversationIDs = (data.conversations as PeoplesConversationsResponse)?.Items.map((conversation) => conversation.id.S)
        this.countdown$ = (data.timer as Observable<number>)
        this.canUpdate = data.canUpdate
        console.log('this.conversationIDs',this.conversationIDs)
        console.log('this.companionIDs',this.companionIDs)

    })
  }

  update(){
    // this.peoplesService.getUsers().subscribe((data) => {
    //   this.canUpdate = false
    //   this.countdown$ = timer(0,1000).pipe(
    //     map(n => 60 - n),
    //     takeWhile(n => n >= 0),
    //     tap((data) => {
    //       if(data === 0){
    //         this.canUpdate = true
    //       }
    //     })
    //   )
    //   // setTimeout(() => this.canUpdate = true, 60000)
    // })
    this.peoplesService.updateUsers().subscribe((data) => {

    })

  }
  
  deleteConversation(uid: string){
    this.conversationService.delete(uid)
  }

  onUserClick(companionId: string){
    const activeConversation = this.conversations?.Items.find((id) => id.companionID.S === companionId)
    console.log('this.conversations?.Items.find((id) => id.companionID.S === companionId)',this.conversations?.Items.find((id) => id.companionID.S === companionId))
    if(!activeConversation){
      this.peoplesService.createConversation(companionId).subscribe((data) => {
        this.router.navigateByUrl(`conversation/${(data as PeoplesConversationsCreate).conversationID}`);
      })
    }else {
      this.router.navigateByUrl(`conversation/${activeConversation.id.S}`);

    }
  }
}


