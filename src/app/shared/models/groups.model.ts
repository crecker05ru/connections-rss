import { Observable } from "rxjs"

export interface GroupsSuccessResponse {
  Count: number
  Items: GroupsItem[]
}

export interface GroupsCreateResponse {
  groupID: string
}

export interface GroupsItem {
  id: {
    S: string
  },
  name: {
    S: string
  },
  createdAt: {
    S: string
  },
  createdBy: {
    S: string
  }

}

export interface GroupsResponseExeption {
  type: string
  message: string
}

export interface GroupsState {
  groups: GroupsSuccessResponse
  groupIDs: GroupsCreateResponse[]
  isLoading: boolean
  responseMessage: string
  timer: Observable<number> | undefined
  canUpdate: boolean

}