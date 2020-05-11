import { TreeItemCollapsibleState, Command, ExtensionContext } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import path from 'path';
import { QueueList } from "./queueList";
import { MessageWebView } from "../messages/messageWebView";

export class Queue extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'queue.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'queue.svg')
	};

	constructor(
		public readonly itemData: IItemData,
		public readonly title: string,
		public readonly parent: QueueList,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
		public readonly messageCount: number = 0,
		public readonly deadLettetCount: number = 0,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	public get description(): string {
		return `(${this.messageCount.toLocaleString()}) (${this.deadLettetCount.toLocaleString()})`;
	}

	public delete = async () => {
		if (this.itemData.clientInstance && this.label) {
			await this.itemData.clientInstance.deleteQueue(this.label);
		}
	}

	public getMessages = async (context: ExtensionContext, deadLetter: boolean = false): Promise<void> => {
		if (!this.itemData.clientInstance) {
			throw new Error("Node without client??!>!!!?!?!?!");
		}

		await new MessageWebView(this.itemData.clientInstance, this).open(context, null, deadLetter);		
	}

	public deleteMessage = async (messageId: string, deadLetter: boolean = false, enqueuedSequencenumber?: number, sessionId?: string) => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.deleteQueueMessage(this.title, messageId, deadLetter, enqueuedSequencenumber, sessionId );
		}		
	}	

	public purgeMessages = async () => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.purgeQueueMessages(this.title);
		}
	}

	contextValue = 'queue';
}