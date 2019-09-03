import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Sdk for JS does not have the management api yet
// https://github.com/Azure/azure-sdk-for-js/issues/3116
//import * as ServiceBus from '@azure/service-bus';

import ServiceBusClient from './client/ServiceBusClient';

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
					... connections.map(c=> new NameSpace(c, vscode.TreeItemCollapsibleState.Expanded))
				]
			);
		}
		else if(element instanceof NameSpace){
			return Promise.resolve([
				new QueueList(element, 'Queues', vscode.TreeItemCollapsibleState.Collapsed),
				new TopicList(element, 'Topics', vscode.TreeItemCollapsibleState.Collapsed),
			]);
		}
		else if(element instanceof TopicList){
			var tl = element as TopicList;
			if(tl.namespace.data.clientInstance){
				return tl.namespace.data.clientInstance.getTopics()
				.then(x=> x.map(y=>new Topic(tl, y.name, vscode.TreeItemCollapsibleState.Collapsed)) );					
			}
		}
		return Promise.resolve([]);
	}

	refresh(): void {
		var items = this.state.get<NameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
		var tasks = items.map(async element => {
			
			try{
				element.error = null;
				element.clientInstance = new ServiceBusClient(element.connection);
				await element.clientInstance.validateAndThrow();

			}
			catch(ex){
				element.error = ex;
			}
			
		});
		Promise.all(tasks).then(x=>{
			this.state.update(NAMESPACE_CONNECTIONS, items );
			this._onDidChangeTreeData.fire();
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
	error?: any;
	clientInstance?: IServiceBusClient;
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
		public data: NameSpaceData,
		collapsibleState: vscode.TreeItemCollapsibleState,
		command?: vscode.Command
	) {
		super(data.name, collapsibleState, command);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return this.data.error ? 'ERROR' : '(0)';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'namespace';

}

export class TopicList extends ExplorerItemBase {

	constructor(
		public namespace: NameSpace,
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

export class Topic extends ExplorerItemBase {

	constructor(
		public parentList: TopicList,
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
		public namespace: NameSpace,
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