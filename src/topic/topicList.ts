import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";

export class TopicList extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		collapsibleState: TreeItemCollapsibleState,
		public itemCount: number = 0,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = 'Topics';
	}
	
	public get description(): string {
		return `(${this.itemCount})`;
	}

	contextValue = 'topiclist';
}