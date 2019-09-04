import * as vscode from 'vscode';


export class ExplorerItemBase extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}`;
	}
	
	get description(): string {
		return 'description';
	}

	contextValue = 'base';

}