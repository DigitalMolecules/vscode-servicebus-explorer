import * as vscode from 'vscode';
import { IServiceBusClient } from '../client/IServiceBusClient';

export interface IItemData {
	name: string;
	connection: string;
	error?: any;
	clientInstance?: IServiceBusClient;
}

export class ExplorerItemBase extends vscode.TreeItem {

	constructor(
		public readonly itemData: IItemData,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(itemData.name, collapsibleState);
	}

	public get tooltip(): string {
		return `${this.label}`;
	}
	
	public get description(): string {
		return this.itemData.error ? 'ERROR' : '(0)';
	}

	contextValue = 'base';
}