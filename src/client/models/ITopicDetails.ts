export interface ITopic{
    content:ITopicContent;
    id:string;
    link:string;
    published: Date;
    title: string;
    updated:Date;
}

export interface ITopicContent{
    TopicDescription: ITopicDescription;
}

export interface ITopicDescription {
    DefaultMessageTimeToLive:string;
    MaxSizeInMegabytes:number;
    RequiresDuplicateDetection:boolean;
    DuplicateDetectionHistoryTimeWindow:string;
    EnableBatchedOperations:boolean;
    SizeInBytes:number;
}