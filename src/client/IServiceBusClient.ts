import { ISubscription } from "./models/ISubscriptionDetails";

export interface IServiceBusClient {
    
    getTopics(): Promise<any[]>;
    
    getSubscriptions(topicName: string): Promise<ISubscription[]>;
    
    getQueues(): Promise<any[]>;
    
    validateAndThrow():Promise<void>;

    getHostName(): string;

    getSubscriptionDetails(topic:string, subscription: string) : Promise<ISubscription>;

    getMessages(topic:string, subscription: string) : Promise<any[]>;
}