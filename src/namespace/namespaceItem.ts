import { QuickPickItem, TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase } from "../common/explorerItemBase";
import { IServiceBusClient } from "../client/IServiceBusClient";

export interface INameSpaceData {
	name: string;
	connection: string;
	error?: any;
	clientInstance?: IServiceBusClient;
}

export class NameSpaceItem extends ExplorerItemBase {

	constructor(
		public data: INameSpaceData,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(data.name, collapsibleState, command);
	}

	public get description(): string {
		return this.data.error ? 'ERROR' : '(0)';
	}

	contextValue = 'namespace';
}