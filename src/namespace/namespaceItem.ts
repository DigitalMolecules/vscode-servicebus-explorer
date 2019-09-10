import { QuickPickItem, TreeItemCollapsibleState, Command } from "vscode";
import { ExplorerItemBase, IItemData } from "../common/explorerItemBase";
import { IServiceBusClient } from "../client/IServiceBusClient";

export class NameSpaceItem extends ExplorerItemBase {

	constructor(
		public readonly data: IItemData,
		public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Expanded,
		public readonly command?: Command
	) {
		super(data, collapsibleState, command);
	}
	
	contextValue = 'namespace';
}