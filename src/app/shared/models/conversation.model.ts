export interface ConversationMessagesResponse {
  Count: number
  Items: ConversationMessagesItem[]
}
export interface ConversationMessagesItem {
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