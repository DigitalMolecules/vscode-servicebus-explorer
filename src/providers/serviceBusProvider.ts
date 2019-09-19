import * as vscode from 'vscode';

// Sdk for JS does not have the management api yet
// https://github.com/Azure/azure-sdk-for-js/issues/3116
//import * as ServiceBus from '@azure/service-bus';

import ServiceBusClient from '../client/ServiceBusClient';
import { ExplorerItemBase, IItemData } from '../common/explorerItemBase';
import { NameSpaceItem } from '../namespace/namespaceItem';
import { NAMESPACE_CONNECTIONS } from '../common/global';
import { TopicList } from '../topic/topicList';
import { QueueList } from '../queue/queueList';
import { Topic } from '../topic/topic';
import { Queue } from '../queue/queue';
import { Subscription } from '../topic/subscription';
import { ISubscription } from '../client/models/ISubscriptionDetails';
import { ITopic } from '../client/models/ITopicDetails';
import { IQueue } from '../client/models/IQueueDetails';
import { IMessageStore } from '../messages/IMessageStore';

export class ServiceBusProvider implements vscode.TreeDataProvider<ExplorerItemBase> {

	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerItemBase | undefined> = new vscode.EventEmitter<ExplorerItemBase | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerItemBase | undefined> = this._onDidChangeTreeData.event;

	state: vscode.Memento;

	constructor(
		private context: vscode.ExtensionContext) {

		this.state = context.workspaceState;
		this.reBuildTree();
	}

	public getTreeItem(element: ExplorerItemBase): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: ExplorerItemBase): Thenable<ExplorerItemBase[]> {
		if (!element) {
			var connections = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
			return Promise.resolve(
				[
					...connections.map(c => new NameSpaceItem(c, vscode.TreeItemCollapsibleState.Expanded))
				]
			);
		}
		else {
			return element.getChildren();
		}
	}

	public reBuildTree(node?: ExplorerItemBase | undefined): void {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
		var tasks = items.map(async element => {

			try {
				element.error = null;
				element.clientInstance = new ServiceBusClient(element.connection);
				await element.clientInstance.validateAndThrow();
			}
			catch (ex) {
				element.error = ex;
			}

		});

		Promise.all(tasks).then(x => {
			this.state.update(NAMESPACE_CONNECTIONS, items);
			this._onDidChangeTreeData.fire(node);
		});

		this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire(node);
	}

	public addNamespace(item: IItemData) {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
		items.push(item);

		this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire();
	}

	public editNamespace(node: NameSpaceItem, item: IItemData) {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

		items.forEach((p) => {
			if (p.name === node.data.name) {
				p.name = item.name;
				p.connection = item.connection;
			}
		});

		this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire();
	}

	public deleteNamespace(node: NameSpaceItem) {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
		items = items.filter(p => p.name !== node.data.name);

		this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire();
	}
}