import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";

export class Subscription extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		public label: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
	}

	public get tooltip(): string {
		return `${this.label}`;
	}

	public get description(): string {
		return '(0)';
	}

	contextValue = 'subscription';
}