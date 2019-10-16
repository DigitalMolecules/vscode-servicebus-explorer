import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import path from 'path';
import { QueueList } from "./queueList";

export class Queue extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'queue.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'queue.svg')
	};

	constructor(
		public readonly itemData: IItemData,
		public readonly title: string,
		public readonly parent: QueueList,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
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

	public deleteQueue = async () => {
		if (this.itemData.clientInstance && this.label) {
			await this.itemData.clientInstance.deleteQueue(this.label);
		}
	}

	contextValue = 'queue';
}