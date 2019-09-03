import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const NAMESPACE_CONNECTIONS  = 'dm.sbe.connections';
export class ServiceBusProvider implements vscode.TreeDataProvider<NameSpace> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<NameSpace | undefined> = new vscode.EventEmitter<NameSpace | undefined>();
	readonly onDidChangeTreeData: vscode.Event<NameSpace | undefined> = this._onDidChangeTreeData.event;

	state: vscode.Memento;

	constructor(context: vscode.ExtensionContext){
		this.state = context.workspaceState;
	}
	
	getTreeItem(element: NameSpace): vscode.TreeItem {
		return element;
	}

    getChildren(element?: NameSpace): Thenable<NameSpace[]> {
		if(!element){
			var connections = this.state.get<NameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
			return Promise.resolve(
				[
					... connections.map(c=> new NameSpace(c.name, "1", vscode.TreeItemCollapsibleState.Collapsed))
				]
			);
		}
		return Promise.resolve([]);
	}

	refresh(): void {
		
	}

	addNamespace(item: NameSpaceData){
		var items = this.state.get<NameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
		items.push(item);
		this.state.update(NAMESPACE_CONNECTIONS, items );
		this._onDidChangeTreeData.fire();
	}
}

interface NameSpaceData{
	name: string;
	connection: string;
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