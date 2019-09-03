import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ServiceBusProvider implements vscode.TreeDataProvider<NameSpace> {

	onDidChangeTreeData?: vscode.Event<any>;    
	state: vscode.Memento;

	constructor(context: vscode.ExtensionContext){
		this.state = context.workspaceState;
	}
	
	getTreeItem(element: NameSpace): vscode.TreeItem {
		return element;
	}

    getChildren(element?: NameSpace): Thenable<NameSpace[]> {
		if(element == null){
			var connections = this.state.get('dm.sbe.connections', []);
			return Promise.resolve(
				[
					... connections.map(c=> new NameSpace("Label1", "1", vscode.TreeItemCollapsibleState.Collapsed))
				]
			);
		}
		return Promise.resolve([]);
	}
}

export class NameSpace extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}-${this.version}`;
	}

	get description(): string {
		return this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

}