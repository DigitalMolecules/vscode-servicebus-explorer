import { ISubscription } from "./models/ISubscriptionDetails";
import { IQueue } from "./models/IQueueDetails";
import { ITopic } from "./models/ITopicDetails";
import { IServiceBusAuthHeader } from "../common/serviceBusAuth";

export interface IServiceBusClient {
    
    readonly auth: IServiceBusAuthHeader;
    readonly hostName: string;

    getTopics(): Promise<ITopic[]>;
    
    getSubscriptions(topicName: string): Promise<ISubscription[]>;
    
    getQueues(): Promise<IQueue[]>;
    
    validateAndThrow():Promise<void>;

    getSubscriptionDetails(topic:string, subscription: string) : Promise<ISubscription>;

    getMessages(topic:string, subscription: string) : Promise<any[]>;
}