export interface IServiceBusClient {
    
    getTopics(): Promise<[any]>;
    
    getSubscriptions(): Promise<any>;
    
    getQueues(): Promise<[any]>;
    
    validateAndThrow():Promise<void>;

    getHostName(): string;
}