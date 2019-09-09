import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";

export class Topic extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		title: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		public subscriptionCount: number = 0,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	public get description(): string {
		return `(${this.subscriptionCount.toLocaleString()})`;
	}

	contextValue = 'topic';
}