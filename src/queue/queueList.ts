import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";


export class QueueList extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = 'Queues';
	}

	contextValue = 'queuelist';
}