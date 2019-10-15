import * as vscode from 'vscode';
import { IServiceBusClient } from '../client/IServiceBusClient';
import path from 'path';
import { ServiceBusProvider } from '../providers/serviceBusProvider';

export interface IItemData {
	name: string;
	connection: string;
	error?: any;
	clientInstance?: IServiceBusClient;
}

export class ExplorerItemBase extends vscode.TreeItem {
	protected children: ExplorerItemBase[] = [];

	constructor(
		public readonly itemData: IItemData,
		public collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(itemData.name, collapsibleState);
	}

	public get description(): string {
		return this.itemData.error ? this.itemData.error.message : '';
	}

	public getChildren(refresh: boolean = true): Promise<ExplorerItemBase[]> {
		throw new Error("Not implemented.");
	}

	public collapse(): void {
		if (this.collapsibleState === vscode.TreeItemCollapsibleState.None) {
			return;
		}

		if (this.children) {
			 this.children.forEach(c => c.collapse());
		}		

		this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
		this.label = 'Hello';
	}

	contextValue = 'base';
}