import { ExplorerItemBase } from "../common/explorerItemBase";
import { NameSpace } from "../namespace/namespace";
import { TreeItemCollapsibleState, Command } from "vscode";

export class TopicList extends ExplorerItemBase {

	constructor(
		public namespace: NameSpace,
		label: string,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(label, collapsibleState, command);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return '(0)';
	}

	contextValue = 'topiclist';
}