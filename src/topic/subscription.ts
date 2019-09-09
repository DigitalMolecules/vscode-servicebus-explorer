import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";
import { ISubscription } from "../client/models/ISubscriptionDetails";

export class Subscription extends ExplorerItemBase {

	public label: string;
	public messageCount: number = 0;
	public deadLettetCount: number = 0;

	constructor(
		public itemData: IItemData,
		public subscription: ISubscription,
		public topicName: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = subscription.title;
		this.messageCount = subscription.content.SubscriptionDescription.MessageCount;
	}

	public get description(): string {
		return `(${this.messageCount.toLocaleString()}) (${this.deadLettetCount.toLocaleString()})`;
	}

	contextValue = 'subscription';
}