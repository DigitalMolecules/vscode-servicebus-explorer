export interface IServiceBusClient {
    getTopics(): Promise<[any]>;
    getSubscriptions(): Promise<any>;
    validateAndThrow():Promise<void>;
}