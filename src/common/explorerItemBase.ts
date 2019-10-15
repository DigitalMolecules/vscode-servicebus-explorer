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

	public getChildren(): Promise<ExplorerItemBase[]> {
		throw new Error("Not implemented.");
	}

	public collapse(): void {
		if (this.collapsibleState === vscode.TreeItemCollapsibleState.None) {
			return;
		}

		if (this.children) {
			 this.children.forEach(c => c.collapse());
		}		

		this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		
		// There is a bug: Simply updating TreeItemCollapsibleState will not update the UI. This is a hack below to force UI update ( add or remove space ) 
		if (this.itemData.name.substr(0, this.itemData.name.length) === ' ') {
			this.itemData.name = this.itemData.name.trim();	
		} else {
			this.itemData.name = this.itemData.name + ' ';
		}
	}

	contextValue = 'base';
}