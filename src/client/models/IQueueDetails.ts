export interface IQueue{
    content:IQueueContent;
    id:string;
    link:string;
    published: Date;
    title: string;
    updated:Date;
}

export interface IQueueContent{
    QueueDescription: IQueueDescription;
}

export interface IQueueDescription {
    LockDuration: string;
    MaxSizeInMegabytes: string;
    RequiresDuplicateDetection: string;
    RequiresSession: string;
    DefaultMessageTimeToLive: string;
    DeadLetteringOnMessageExpiration: string;
    DuplicateDetectionHistoryTimeWindow: string;
    MaxDeliveryCount: string;
    EnableBatchedOperations: string;
    SizeInBytes: number;
    MessageCount: number;
}