export interface GroupDialogMessagesResponse {
  Count?: number | undefined
  Items: GroupDialogMessagesItem[]
}
export interface GroupDialogMessagesItem {
  authorID: {
    S: string
},
message: {
  S: string
},
createdAt: {
S: string | Date
}
}