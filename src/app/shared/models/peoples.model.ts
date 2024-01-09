import { Observable } from "rxjs"

export interface PeoplesSuccessResponse {
  Count: number
  Items: PeoplesItem[]
}

export interface PeoplesConversationsResponse {
  Count: number
  Items: PeoplesConversationsItem[]
}

export interface PeoplesConversationsCreate {
  conversationID: string
}

export interface PeoplesItem {
  name: {
    S: string
  },
  uid: {
    S: string
  }
}

export interface PeoplesConversationsItem {
  id: {
    S: string
  },
  companionID: {
    S: string
  }
}

export interface PeoplesResponseExeption {
  type: string
  message: string
}

export interface PeoplesState {
  peoples: PeoplesSuccessResponse
  isLoading: boolean
  responseMessage: string
  conversationIDs: string[],
  conversations: PeoplesConversationsResponse | null
  timer: Observable<number> | undefined | number
  canUpdate: boolean
}