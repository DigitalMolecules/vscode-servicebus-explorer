import * as vscode from 'vscode';
import { IServiceBusClient } from '../client/IServiceBusClient';

export interface IItemData {
	name: string;
	connection: string;
	error?: any;
	clientInstance?: IServiceBusClient;
	collapsibleState: vscode.TreeItemCollapsibleState;
}

export class ExplorerItemBase extends vscode.TreeItem {
	protected children: ExplorerItemBase[] = [];

	constructor(
		public readonly itemData: IItemData,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(itemData.name, collapsibleState);
	}

	public get description(): string {
		return this.itemData.error ? this.itemData.error.message : '';
	}

	public getChildren(): Promise<ExplorerItemBase[]> {
		return Promise.resolve([]);
	}

	contextValue = 'base';
}