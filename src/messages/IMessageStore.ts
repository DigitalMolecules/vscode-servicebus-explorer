export interface IMessageStore {

    setMessage(messageId: string, message: any): void;
    
    getMessage(messageId: string): any;
}