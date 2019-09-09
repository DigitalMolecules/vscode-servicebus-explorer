import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { QueueList } from "./queueList";

export class Queue extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		title: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	contextValue = 'queue';
}