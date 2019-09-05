import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";

export class TopicList extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = 'Topics';
	}

	contextValue = 'topiclist';
}