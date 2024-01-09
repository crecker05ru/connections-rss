export interface UserSignupData {
  email: string
  name: string
  password: string
}

export interface UserSigninData {
  email: string
  password: string
}

export interface UserAuthErrorResponse {
  type: string
  message: string
}

export interface UserAuthLoginResponse {
  token: string
  uid: string
}

export interface UserAuthToken extends UserAuthLoginResponse{
  email: string
}

export interface UserAuthState {
  name: string
  email: string
  isLogged: boolean
  isLoading: boolean
  responseMessage: string
}