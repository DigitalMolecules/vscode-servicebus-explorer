import { TreeItemCollapsibleState, ExtensionContext, Command, window } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { Subscription } from "../subscription/subscription";
import { ISubscription } from "../client/models/ISubscriptionDetails";
import path from 'path';
import { TopicList } from "./topicList";

export class Topic extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'topic.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'topic.svg')
	};

	constructor(
		public readonly itemData: IItemData,
		public readonly title: string,
		public readonly parent: TopicList,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed,
		public readonly subscriptionCount: number = 0,
		public readonly command?: Command
	) {
		super(itemData, collapsibleState, command);
		this.label = title;
	}

	public get description(): string {
		return `(${this.subscriptionCount.toLocaleString()})`;
	}

	public async getChildren(): Promise<ExplorerItemBase[]> {
		this.children = [];

		if (this.itemData.clientInstance) {
			const mapToSubscription = async (subs: any[]): Promise<Subscription[]> => {
				if (!subs || !Array.isArray(subs)) {
					return [];
				}

				subs = subs.map(async (y: { title: string; }) => {
					if (this.itemData.clientInstance) {
						const subDetails: ISubscription = await this.itemData.clientInstance.getSubscriptionDetails(this.label || '', y.title);
						return new Subscription(this.itemData, subDetails, this.label || '', this);
					}
					return null;
				});

				return await Promise.all(subs);
			};

			this.children = await (this.itemData.clientInstance.getSubscriptions(this.label || '')
				.then(mapToSubscription));
		}

		return Promise.resolve(this.children);
	}

	public createSubscription = async (newSubscriptionName: string) => {
		if (this.itemData.clientInstance) {
			await this.itemData.clientInstance.createSubscription(this.label || '', newSubscriptionName);
		}
	}

	public delete = async () => {
		if (this.itemData.clientInstance && this.label) {
			await this.itemData.clientInstance.deleteTopic(this.label);
		}
	}

	contextValue = 'topic';
}