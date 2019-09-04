import { ExplorerItemBase } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";

export class TopicList extends ExplorerItemBase {

	constructor(
		public namespaceItem: NameSpaceItem,
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

	contextValue = 'topiclist';
}