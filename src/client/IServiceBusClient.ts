import { ISubscription } from "./models/ISubscriptionDetails";
import { IQueue } from "./models/IQueueDetails";
import { ITopic } from "./models/ITopicDetails";
import { IServiceBusAuthHeader } from "../common/serviceBusAuth";
import { ReceivedMessageInfo } from "@azure/service-bus";

export interface IServiceBusClient {
    
    readonly auth: IServiceBusAuthHeader;
    readonly hostName: string;

    getTopics(): Promise<ITopic[]>;
    
    getSubscriptions(topicName: string): Promise<ISubscription[]>;
    
    getQueues(): Promise<IQueue[]>;
    
    validateAndThrow():Promise<void>;

    getSubscriptionDetails(topic:string, subscription: string) : Promise<ISubscription>;

    getMessages(topic:string, subscription: string) : Promise<ReceivedMessageInfo[]>;
}