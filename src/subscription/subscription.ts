import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command, ExtensionContext } from "vscode";
import { ISubscription } from "../client/models/ISubscriptionDetails";
import { MessageWebView } from "../messages/messageWebView";
import path from 'path';
import { URL } from "url";
import { Topic } from "../topic/topic";

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
		public readonly parent: ExplorerItemBase,
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

	public getMessages = async (context: ExtensionContext, deadLetter: boolean = false): Promise<void> => {
		if (!this.itemData.clientInstance) {
			throw new Error("Node without client??!>!!!?!?!?!");
		}

		await new MessageWebView(this.itemData.clientInstance, this).open(context, null, deadLetter);
	}

	public searchMessages = async (context: ExtensionContext, searchArguments: string) => {
		if (!this.itemData.clientInstance) {
			throw new Error("Node without client??!>!!!?!?!?!");
		}
		await new MessageWebView(this.itemData.clientInstance, this).open(context, searchArguments);
	}

	public delete = async () => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.deleteSubscription(this.topicName, this.label);
		}
	}

	public deleteMessage = async (messageId: string, deadLetter: boolean = false, enqueuedSequencenumber?: number, sessionId?: string) => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.deleteSubscriptionMessage(this.topicName, this.label, messageId, deadLetter, enqueuedSequencenumber, sessionId );
		}		
	}

	public purgeMessages = async () => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.purgeSubscriptionMessages(this.topicName, this.label);
		}
	}

	public purgeDeadLetter = async () => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.purgeSubscriptionMessages(this.topicName, this.label, true);
		}
	}
}