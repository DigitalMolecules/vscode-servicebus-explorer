import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Queue } from "./queue";
import path from 'path';

export class QueueList extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'queuelist.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'queuelist.svg')
	};

	constructor(
		public readonly itemData: IItemData,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly itemCount: number = 0,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = 'Queues';
	}

	public get description(): string {
		return `(${this.itemCount.toLocaleString()})`;
	}

	public async getChildren(): Promise<ExplorerItemBase[]> {
		if (this.itemData.clientInstance) {
			return (await this.itemData.clientInstance.getQueues())
				.map(y =>
					new Queue(this.itemData, y.title)
				);
		}

		return Promise.resolve([]);
	}

	contextValue = 'queuelist';
}