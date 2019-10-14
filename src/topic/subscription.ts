import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command, ExtensionContext } from "vscode";
import { ISubscription } from "../client/models/ISubscriptionDetails";
import { MessageWebView } from "../messages/messageWebView";
import path from 'path';
import { URL } from "url";
import { Topic } from "./topic";

export class Subscription extends ExplorerItemBase {

	contextValue = 'subscription';

	public label: string;
	public messageCount: number = 0;
	public deadLetterCount: number = 0;

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'subscription.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'subscription.svg')
	};

	constructor(
		public readonly itemData: IItemData,
		public readonly subscription: ISubscription,
		public readonly topicName: string,
		public readonly parent: Topic,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = subscription.title;
		this.messageCount = subscription.content.SubscriptionDescription.CountDetails.ActiveMessageCount;
		this.deadLetterCount = subscription.content.SubscriptionDescription.CountDetails.DeadLetterMessageCount;
	}

	public get description(): string {

		return `(${this.messageCount.toLocaleString()}) (${this.deadLetterCount.toLocaleString()})`;
	}

	public getSubscriptionMessages = async (context: ExtensionContext): Promise<void> => {

		if (!this.itemData.clientInstance) {
			throw new Error("Node without client??!>!!!?!?!?!");
		}

		await new MessageWebView(this.itemData.clientInstance).open(context, this, null);
	}

	public searchMessages = async (context: ExtensionContext, searchArguments: string) => {
		if (!this.itemData.clientInstance) {
			throw new Error("Node without client??!>!!!?!?!?!");
		}
		await new MessageWebView(this.itemData.clientInstance).open(context, this, searchArguments);
	}

	public deleteSubscription = async (context: ExtensionContext) => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.deleteSubscription(this.topicName, this.label);
		}
	}
}