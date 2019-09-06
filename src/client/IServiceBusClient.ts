export interface IServiceBusClient {
    
    getTopics(): Promise<[any]>;
    
    getSubscriptions(topicName: string): Promise<any>;
    
    getQueues(): Promise<[any]>;
    
    validateAndThrow():Promise<void>;

    getHostName(): string;
}