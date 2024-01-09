export interface IProfile {
  userId: string
  email: string
  createdAt: string | Date
  username: string
}

export interface ProfileRequestHeaders {
  "rs-uid": string
  "rs-email": string
  "Authorization": string
}

export interface ProfileResponseSuccess {
  email: {
    S: string
  }
  name: {
    S: string
  }
  uid: {
    S: string
  }
  createdAt: {
    S: string
  }
}
export interface ProfileResponseError {
  type: string
  messagee: string
}

export interface ProfileState {
  profile: ProfileResponseSuccess
  isLoading: boolean
  responseMessage: string
}