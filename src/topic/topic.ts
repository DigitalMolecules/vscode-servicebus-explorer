import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TopicList } from "./topicList";

export class Topic extends TopicList {

	constructor(
		public itemData: IItemData,
		title: string,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(itemData, collapsibleState, 0, command);
		this.label = title;
	}

	contextValue = 'topic';
}