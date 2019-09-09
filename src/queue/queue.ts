import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { QueueList } from "./queueList";

export class Queue extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		title: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
		public messageCount: number = 0,
		public deadLettetCount: number = 0,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	public get description(): string {
		return `(${this.messageCount.toLocaleString()}) (${this.deadLettetCount.toLocaleString()})`;
	}

	contextValue = 'queue';
}