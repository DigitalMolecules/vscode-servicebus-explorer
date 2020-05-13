import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { QueueList } from "../queue/queueList";
import { TopicList } from "../topic/topicList";
import path from 'path';

export class NameSpaceItem extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'namespace.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'namespace.svg')
	};

	constructor(
		public readonly data: IItemData,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		public readonly command?: Command
	) {
		super(data, collapsibleState, command);
	}

	public async getChildren(): Promise<ExplorerItemBase[]> {
		this.children = [];

		if (this.data.clientInstance && !this.data.error) {
			let topics = await this.data.clientInstance.getTopics();
			let queues = await this.data.clientInstance.getQueues();

			this.children.push(new QueueList(this.data, queues.length ? this.collapsibleState : TreeItemCollapsibleState.None, queues.length || 0));
			this.children.push(new TopicList(this.data, topics.length ? this.collapsibleState : TreeItemCollapsibleState.None, topics.length || 0));
		}

		return Promise.resolve(this.children);
	}

	contextValue = 'namespace';
}