
export interface Document {
  id: string;
  name: string;
  content: string;
}

export interface Chunk {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  embedding?: number[];
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  sources?: Chunk[];
}
