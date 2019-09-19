import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";

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