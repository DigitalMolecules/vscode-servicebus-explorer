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
		public collapsibleState: TreeItemCollapsibleState,// = TreeItemCollapsibleState.None,
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
		this.children = [];

		if (this.itemData.clientInstance) {
			let queues = (await this.itemData.clientInstance.getQueues())
				.map(y =>
					new Queue(this.itemData, y.title, TreeItemCollapsibleState.Collapsed)
				);

			this.children = queues;
		}

		return Promise.resolve(this.children);

	}

	contextValue = 'queuelist';
}