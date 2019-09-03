interface IServiceBusClient {
    getTopics(): [];
    validateAndThrow():Promise<void>;
}