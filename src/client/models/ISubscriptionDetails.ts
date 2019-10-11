export interface ISubscription{
    content:ISubscriptionContent;
    id:string;
    link:string;
    published: Date;
    title: string;
    updated:Date;
}

export interface ISubscriptionContent{
    SubscriptionDescription: ISubscriptionDescription;
}

export interface ISubscriptionDescription {
    DeadLetteringOnFilterEvaluationExceptions:boolean;
    DeadLetteringOnMessageExpiration:boolean;
    DefaultMessageTimeToLive:string;
    EnableBatchedOperations:boolean;
    LockDuration:string;
    MaxDeliveryCount:number;
    MessageCount:number;
    CountDetails: ICountDetails;
    RequiresSession:boolean;
}

export interface ICountDetails {
    ActiveMessageCount:number;
    DeadLetterMessageCount:number;
    ScheduledMessageCount:number;
    TransferMessageCount:number;
    TransferDeadLetterMessageCount:number;
}