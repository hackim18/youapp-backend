export interface MessageReceivedEvent {
  messageId: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  content: string;
}
