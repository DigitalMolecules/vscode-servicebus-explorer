import { QuickPickItem, TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { IServiceBusClient } from "../client/IServiceBusClient";

export class NameSpaceItem extends ExplorerItemBase {

	constructor(
		public data: IItemData,
		collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Expanded,
		command?: Command
	) {
		super(data, collapsibleState, command);
	}
	
	contextValue = 'namespace';
}