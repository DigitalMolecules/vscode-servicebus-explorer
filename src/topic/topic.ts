import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";

export class Topic extends ExplorerItemBase {

	constructor(
		public readonly itemData: IItemData,
		public readonly title: string,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		public readonly subscriptionCount: number = 0,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	public get description(): string {
		return `(${this.subscriptionCount.toLocaleString()})`;
	}

	contextValue = 'topic';
}