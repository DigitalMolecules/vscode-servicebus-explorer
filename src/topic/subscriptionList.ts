import { ExplorerItemBase } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";

export class SubscriptionList extends ExplorerItemBase {

	constructor(
		public namespaceItem: Topic,
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

	contextValue = 'subscriptionlist';
}