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
    defaultmessagetimetolive:string;
    maxsizeinmegabyte:number;
    requiresduplicatedetection:boolean;
    duplicatedetectionhistorytimewindow:string;
    enablebatchedoperations:boolean;
    sizeinbytes:number;
}