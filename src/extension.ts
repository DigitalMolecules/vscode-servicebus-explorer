'use strict';

import * as vscode from 'vscode';
import { ServiceBusProvider } from './providers/serviceBusProvider';
import { NameSpaceItem } from './namespace/namespaceItem';
import { TopicList } from './topic/topicList';
import { QueueList } from './queue/queueList';
import { NameSpace } from './namespace/namespace';
import { MessageProvider } from './providers/messageProvider';
import { Subscription } from './topic/subscription';
import { MessageWebView } from './messages/messageWebView';

export function activate(context: vscode.ExtensionContext) {

	const stuffToDispose = context.subscriptions;

	const serviceBusProvider = new ServiceBusProvider(context);
	const nameSpace = new NameSpace(context);
	const messageProvider = new MessageProvider();


	stuffToDispose.push(vscode.window.registerTreeDataProvider('servicebus-namespaces', serviceBusProvider));
	stuffToDispose.push(vscode.workspace.registerTextDocumentContentProvider('servicebusmessage', messageProvider));


	//TODO: move this to a command file

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.refreshEntry', () => {
			serviceBusProvider.reBuildTree();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.addEntry', async () => {
			var state = await nameSpace.addNamespace();
			serviceBusProvider.addNamespace({ name: state.name, connection: state.connectionString });
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.editEntry', async (node: NameSpaceItem) => {
			var state = await nameSpace.editNamespace(node);
			serviceBusProvider.editNamespace(node, { name: state.name, connection: state.connectionString });
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

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.getSubscriptionMessages', async (node: Subscription) => {
			if(!node.itemData.clientInstance){
				throw new Error("Node without client??!>!!!?!?!?!");
			}
			new MessageWebView(node.itemData.clientInstance).open(context, node);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.showMessage', async (node: Subscription) => {
			let uri = vscode.Uri.parse('servicebusmessage:message02.json');
			let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
			await vscode.window.showTextDocument(doc,
				{
					preview: false,
				}
			);
		})
	);


}

export function deactivate() { }