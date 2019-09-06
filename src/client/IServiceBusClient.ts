export interface IServiceBusClient {
    
    getTopics(): Promise<[any]>;
    getQueues(): Promise<[any]>;
    
    validateAndThrow():Promise<void>;

    getHostName(): string;
}