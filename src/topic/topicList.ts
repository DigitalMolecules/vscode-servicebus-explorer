import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";
import path from 'path';

export class TopicList extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'topiclist.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'topiclist.svg')
	};

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

	public async getChildren(): Promise<ExplorerItemBase[]> {
		if (this.itemData.clientInstance) {
			return (await this.itemData.clientInstance.getTopics())
				.map(y =>
					new Topic(this.itemData, y.title)
				);
		} else {
			return [];
		}
	}

	contextValue = 'topiclist';
}