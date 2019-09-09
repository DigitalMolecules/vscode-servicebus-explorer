import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";

export class Subscription extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		public label: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		public itemCount: number = 0,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
	}

	public get description(): string {
		return `(${this.itemCount.toLocaleString()})`;
	}

	contextValue = 'subscription';
}