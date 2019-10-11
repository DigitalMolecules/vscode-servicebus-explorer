import { TreeItemCollapsibleState, ExtensionContext, Command, window } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { Subscription } from "./subscription";
import { ISubscription } from "../client/models/ISubscriptionDetails";
import path from 'path';

export class Topic extends ExplorerItemBase {

	iconPath = {
		light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'topic.svg'),
		dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'topic.svg')
	};

	constructor(
		public readonly itemData: IItemData,
		public readonly title: string,
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
		if (this.itemData.clientInstance) {
			const mapToSubscription = async (subs: any[]): Promise<Subscription[]> => {

				if (!subs || !Array.isArray(subs)) {
					return [];
				}

				subs = subs.map(async (y: { title: string; }) => {
					if (this.itemData.clientInstance) {
						const subDetails: ISubscription = await this.itemData.clientInstance.getSubscriptionDetails(this.label || '', y.title);
						return new Subscription(this.itemData, subDetails, this.label || '');
					}
					return null;
				});

				return await Promise.all(subs);
			};

			return await (this.itemData.clientInstance.getSubscriptions(this.label || '')
				.then(mapToSubscription));
		}

		return Promise.resolve([]);
	}

	public createSubscription = async (context: ExtensionContext, newSubscriptionName: string) => {
		window.showErrorMessage(`Cannot create subscription ${newSubscriptionName} function not implemented`);
	}

	contextValue = 'topic';
}