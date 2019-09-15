import { ISubscription } from "./models/ISubscriptionDetails";
import { IQueue } from "./models/IQueueDetails";
import { ITopic } from "./models/ITopicDetails";

export interface IServiceBusClient {
    
    getTopics(): Promise<ITopic[]>;
    
    getSubscriptions(topicName: string): Promise<ISubscription[]>;
    
    getQueues(): Promise<IQueue[]>;
    
    validateAndThrow():Promise<void>;

    getHostName(): string;

    getSubscriptionDetails(topic:string, subscription: string) : Promise<ISubscription>;

    getMessages(topic:string, subscription: string) : Promise<any[]>;
    
    getMessage(topic:string, subscription: string, messageId: string) : any;
    
}