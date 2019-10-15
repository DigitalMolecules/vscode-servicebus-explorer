import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";

export class Queue extends ExplorerItemBase {

	constructor(
		public readonly itemData: IItemData,
		public readonly title: string,
		public collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
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

	contextValue = 'queue';
}