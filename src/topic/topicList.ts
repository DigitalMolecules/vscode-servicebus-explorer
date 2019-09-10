import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";

export class TopicList extends ExplorerItemBase {

	constructor(
		public readonly itemData: IItemData,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly topicCount: number = 0,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = 'Topics';
	}
	
	public get description(): string {
		return `(${this.topicCount.toLocaleString()})`;
	}

	contextValue = 'topiclist';
}