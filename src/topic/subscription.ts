import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command, window, ExtensionContext } from "vscode";
import { ISubscription } from "../client/models/ISubscriptionDetails";
import * as path from 'path';
import { MessageWebView } from "../messages/messageWebView";

export class Subscription extends ExplorerItemBase {

	public label: string;
	public messageCount: number = 0;
	public deadLettetCount: number = 0;

	constructor(
		public readonly itemData: IItemData,
		public readonly subscription: ISubscription,
		public readonly topicName: string,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = subscription.title;
		this.messageCount = subscription.content.SubscriptionDescription.MessageCount;
	}

	public get description(): string {
		return `(${this.messageCount.toLocaleString()}) (${this.deadLettetCount.toLocaleString()})`;
	}

	public getSubscriptionMessages(context: ExtensionContext) {
		if(!this.itemData.clientInstance){
			throw new Error("Node without client??!>!!!?!?!?!");
		}
		new MessageWebView(this.itemData.clientInstance).open(context, this);
	}
	
	contextValue = 'subscription';
}