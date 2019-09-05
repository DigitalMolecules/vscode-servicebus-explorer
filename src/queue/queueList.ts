import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";


export class QueueList extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		collapsibleState: TreeItemCollapsibleState,
		public itemCount: number = 0,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = 'Queues';
	}

	public get description(): string {
		return `(${this.itemCount.toLocaleString()})`;
	}

	contextValue = 'queuelist';
}