'use strict';

import * as vscode from 'vscode';
import { ServiceBusProvider } from './providers/serviceBusProvider';
import { NameSpaceItem } from './namespace/namespaceItem';
import { TopicList } from './topic/topicList';
import { QueueList } from './queue/queueList';
import { NameSpace } from './namespace/namespace';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "service-bus-explorer" is now active!');

	const serviceBusProvider = new ServiceBusProvider(context);
	const nameSpace = new NameSpace(context);

	vscode.window.registerTreeDataProvider('servicebus-namespaces', serviceBusProvider);
	
	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.refreshEntry', () => {
			serviceBusProvider.reBuildTree();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.addEntry', async () => {
			var state = await nameSpace.addNamespace();
			serviceBusProvider.addNamespace( { name: state.name, connection: state.connectionString } );
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.editEntry', async (node: NameSpaceItem) => {
			var state = await nameSpace.editNamespace(node);
			serviceBusProvider.editNamespace(node, { name: state.name, connection: state.connectionString } );
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.deleteEntry', (node: NameSpaceItem) => {
			serviceBusProvider.deleteNamespace(node);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.refreshTopicList', (node: TopicList) => {
			vscode.window.showInformationMessage('Refresh Topic List not implemented!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.refreshQueueList', (node: QueueList) => {
			vscode.window.showInformationMessage('Refresh Queue List not implemented!');
		})
	);
}

export function deactivate() { }