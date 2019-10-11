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

    getMessages(topic: string, subscription: string, searchArguments: string | null): Promise<ReceivedMessageInfo[]>;

<<<<<<< HEAD
    getMessages(topic:string, subscription: string, searchArguments: string | null) : Promise<ReceivedMessageInfo[]>;

    createSubscription(topic:string, subscription: string) : Promise<ISubscription>;
=======
    sendMessage(topic: string, body: any, contentType: string): Promise<void>;
>>>>>>> bcc2a545112a84aa6cf04675241f825a9e13ddff
}