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

    validateAndThrow(): Promise<void>;

    getSubscriptionDetails(topic: string, subscription: string): Promise<ISubscription>;

    getSubscriptionMessages(topic: string, subscription: string, searchArguments: string | null, deadLetter: boolean): Promise<ReceivedMessageInfo[]>;

    getQueueMessages(queue: string, searchArguments: string | null, deadLetter: boolean): Promise<ReceivedMessageInfo[]>;

    deleteSubscriptionMessage(topic: string, subscription: string, messageId: string, deadLetter: boolean, enqueuedSequencenumber?: number, sessionId?: string): Promise<void>;

    deleteQueueMessage(queue: string, messageId: string, deadLetter: boolean, enqueuedSequencenumber?: number, sessionId?: string): Promise<void>;

    createSubscription(topic:string, subscription: string) : Promise<ISubscription>;

    deleteSubscription(topic:string, subscription: string) : Promise<ISubscription>;

    createTopic(topic:string) : Promise<ITopic>;

    deleteTopic(topic:string) : Promise<ITopic>;
    
    createQueue(queue:string) : Promise<IQueue>;

    deleteQueue(queue:string) : Promise<IQueue>;

    sendTopicMessage(topic: string, body: any, contentType: string): Promise<void>;

    sendQueueMessage(queue: string, body: any, contentType: string): Promise<void>;

    purgeSubscriptionMessages(topic: string, subscription: string, deadLetter?: boolean): Promise<void>;

    purgeQueueMessages(queue: string, deadLetter?: boolean): Promise<void>;

}