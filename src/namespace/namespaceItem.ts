import { TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { ITopic } from "../client/models/ITopicDetails";
import { IQueue } from "../client/models/IQueueDetails";
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
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Expanded,
		public readonly command?: Command
	) {
		super(data, collapsibleState, command);
	}

	public getChildren(): Promise<ExplorerItemBase[]> {

		var topics = Promise.resolve<ITopic[]>([]);
		var queues = Promise.resolve<IQueue[]>([]);

		if (this.data.clientInstance && !this.data.error) {
			topics = this.data.clientInstance.getTopics();
			queues = this.data.clientInstance.getQueues();
		}

		return Promise.all([queues, topics])
			.then(x => [
				new QueueList(this.data, TreeItemCollapsibleState.Collapsed, x[0].length || 0),
				new TopicList(this.data, TreeItemCollapsibleState.Collapsed, x[1].length || 0)
			]
		);
	}

	contextValue = 'namespace';
}