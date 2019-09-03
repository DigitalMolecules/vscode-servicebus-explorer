import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const NAMESPACE_CONNECTIONS  = 'dm.sbe.connections';
export class ServiceBusProvider implements vscode.TreeDataProvider<ExplorerItemBase> {
	
	private _onDidChangeTreeData: vscode.EventEmitter<ExplorerItemBase | undefined> = new vscode.EventEmitter<ExplorerItemBase | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ExplorerItemBase | undefined> = this._onDidChangeTreeData.event;

	state: vscode.Memento;

	constructor(context: vscode.ExtensionContext){
		this.state = context.workspaceState;
	}
	
	getTreeItem(element: ExplorerItemBase): vscode.TreeItem {
		return element;
	}

    getChildren(element?: ExplorerItemBase): Thenable<ExplorerItemBase[]> {
		
		//On undefined we get the namespaces
		if(!element){ 
			var connections = this.state.get<NameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
			return Promise.resolve(
				[
					... connections.map(c=> new NameSpace(c.name, vscode.TreeItemCollapsibleState.Expanded))
				]
			);
		}
		else if(element instanceof NameSpace){
			return Promise.resolve([
				new QueueList('Queues', vscode.TreeItemCollapsibleState.Collapsed),
				new TopicList('Topics', vscode.TreeItemCollapsibleState.Collapsed),
			]);
		}
		return Promise.resolve([]);
	}

	refresh(): void {
		var items = this.state.get<NameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
		items.forEach(element => {
			///TODO Refresh
		});
		this.state.update(NAMESPACE_CONNECTIONS, items );
		this._onDidChangeTreeData.fire();
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

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'base';

}

export class NameSpace extends ExplorerItemBase {

	constructor(
		label: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		command?: vscode.Command
	) {
		super(label, collapsibleState, command);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return '(0)';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'namespace';

}

export class TopicList extends ExplorerItemBase {

	constructor(
		label: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		command?: vscode.Command
	) {
		super(label, collapsibleState, command);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return '(0)';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'topiclist';

}

export class QueueList extends ExplorerItemBase {

	constructor(
		label: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		command?: vscode.Command
	) {
		super(label, collapsibleState, command);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return '(0)';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'queuelist';

}