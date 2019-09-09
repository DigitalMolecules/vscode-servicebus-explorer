import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";

export class Subscription extends ExplorerItemBase {

	constructor(
		public itemData: IItemData,
		public label: string,
		public topicName: string,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
		public messageCount: number = 0,
		public deadLettetCount: number = 0,
		command?: Command
	) {
		super(itemData, collapsibleState, command);
	}

	public get description(): string {
		return `(${this.messageCount.toLocaleString()}) (${this.deadLettetCount.toLocaleString()})`;
	}

	contextValue = 'subscription';
}