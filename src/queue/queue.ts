import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { QueueList } from "./queueList";

export class Queue extends QueueList {

	constructor(
		public itemData: IItemData,
		title: string,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(itemData, collapsibleState, 0, command);
		this.label = title;
	}

	contextValue = 'queue';
}