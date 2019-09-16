import { IMessageStore } from "./IMessageStore";

export class MessageStore implements IMessageStore {
    cache: any = {};
    setMessage(messageId: string, message: any): void {
        this.cache[messageId] = message;
    }
    getMessage(messageId: string) {
        return this.cache[messageId];
    }
}