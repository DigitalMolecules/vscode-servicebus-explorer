import { TopicList } from "./topicList";
import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase } from "../common/explorerItemBase";

export class Topic extends ExplorerItemBase {

	constructor(
		public parentList: TopicList,
		label: string,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(label, collapsibleState, command);
	}

	public get tooltip(): string {
		return `${this.label}`;
	}

	public get description(): string {
		return '(0)';
	}

	contextValue = 'topic';
}