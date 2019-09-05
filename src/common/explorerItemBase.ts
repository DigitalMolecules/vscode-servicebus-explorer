import * as vscode from 'vscode';


export class ExplorerItemBase extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	public get tooltip(): string {
		return `${this.label}`;
	}
	
	public get description(): string {
		return 'description';
	}

	contextValue = 'base';

}