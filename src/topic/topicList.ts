import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { TreeItemCollapsibleState, Command } from "vscode";
import { Topic } from "./topic";
import path from 'path';
import { ITopic } from "../client/models/ITopicDetails";
import { ISubscription } from "../client/models/ISubscriptionDetails";

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
			let topicDetails = await this.itemData.clientInstance.getTopics();			
			let topics:ExplorerItemBase[] = [];

			for(var i = 0; i < topicDetails.length; i++) {
				var subscriptions:ISubscription[] =	await this.itemData.clientInstance.getSubscriptions(topicDetails[i].title || '');
				topics.push(new Topic(this.itemData, topicDetails[i].title, TreeItemCollapsibleState.Collapsed, subscriptions.length));
			}

			return topics;
		} else {
			return [];
		}
	}

	contextValue = 'topiclist';
}