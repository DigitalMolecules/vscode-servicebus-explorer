import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";

export class Topic extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		title: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	contextValue = 'topic';
}