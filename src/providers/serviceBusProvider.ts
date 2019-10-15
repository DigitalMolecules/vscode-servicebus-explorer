import * as vscode from 'vscode';

// Sdk for JS does not have the management api yet
// https://github.com/Azure/azure-sdk-for-js/issues/3116
//import * as ServiceBus from '@azure/service-bus';

import ServiceBusClient from '../client/ServiceBusClient';
import { ExplorerItemBase, IItemData } from '../common/explorerItemBase';
import { NameSpaceItem } from '../namespace/namespaceItem';
import { NAMESPACE_CONNECTIONS } from '../common/global';

export class ServiceBusProvider implements vscode.TreeDataProvider<ExplorerItemBase> {

	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerItemBase | undefined> = new vscode.EventEmitter<ExplorerItemBase | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerItemBase | undefined> = this._onDidChangeTreeData.event;

	state: vscode.Memento;

	constructor(
		private context: vscode.ExtensionContext) {
		this.state = context.globalState;
	}

	public getTreeItem(element: ExplorerItemBase): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: ExplorerItemBase): Thenable<ExplorerItemBase[]> {
		if (!element) {
			const connections = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

			const namespaces = Promise.all([
				...connections.map(async c => {
					await this.buildTreeItem(c);
					return new NameSpaceItem(c, vscode.TreeItemCollapsibleState.Expanded);
				})
			]);

			return namespaces;
		}
		else {
			return element.getChildren();
		}
	}

	public reBuildTree(node?: ExplorerItemBase | undefined): void {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
		var tasks = items.map(async element => await this.buildTreeItem(element));

		Promise.all(tasks).then(x => {
			this.state.update(NAMESPACE_CONNECTIONS, items);
			this._onDidChangeTreeData.fire(node);
		});
	}

	public refresh(node?: ExplorerItemBase | undefined): void {
		this._onDidChangeTreeData.fire();
	}

	private async buildTreeItem(item: IItemData): Promise<void> {
		try {
			item.error = null;
			item.clientInstance = new ServiceBusClient(item.connection);
			await item.clientInstance.validateAndThrow();
		}
		catch (ex) {
			item.error = ex;
		}
	}

	public async addNamespace(item: IItemData): Promise<void> {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

		await this.buildTreeItem(item);

		items.push(item);

		await this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire();
	}

	public async editNamespace(node: NameSpaceItem, item: IItemData): Promise<void> {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

		items.forEach((p) => {
			if (p.name === node.data.name) {
				p.name = item.name;
				p.connection = item.connection;
			}
		});

		await this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire();
	}

	public deleteNamespace(node: NameSpaceItem) {
		var items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
		items = items.filter(p => p.name !== node.data.name);

		this.state.update(NAMESPACE_CONNECTIONS, items);
		this._onDidChangeTreeData.fire();
	}
}