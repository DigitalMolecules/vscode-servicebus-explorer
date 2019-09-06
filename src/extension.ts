'use strict';

import * as vscode from 'vscode';
import { ServiceBusProvider } from './providers/serviceBusProvider';
import { NameSpaceItem } from './namespace/namespaceItem';
import { TopicList } from './topic/topicList';
import { QueueList } from './queue/queueList';
import { NameSpace } from './namespace/namespace';
import { MessageProvider } from './providers/messageProvider';
import { Subscription } from './topic/subscription';

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

			
			const panel = vscode.window.createWebviewPanel(
				'messagelist', // Identifies the type of the webview. Used internally
				`Messages (${node.label})`, // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{
					enableScripts: true
				} 
			);

			panel.webview.onDidReceiveMessage(
				message => {
				  switch (message.command) {
					case 'serviceBusExplorer.showMessage':
					  vscode.window.showErrorMessage(message.text);
					  return;
				  }
				},
				undefined,
				context.subscriptions
			  );

			panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
						<h1>Messages (${node.label})</h1>
						<script >
							const vscode = acquireVsCodeApi();
							function showMessage(){
								vscode.postMessage({
									command: 'serviceBusExplorer.showMessage',
									text: 'Potatoes'
								})
							}
						</script>
						<table>
							<tr>
								<td>
									Message 1
								</td>
								<td>
									<button onclick="showMessage()">Get Messages</button>
								</td>
							</tr>
						</table>
			</body>
			
			`;

			panel.onDidDispose(()=>{

			}, null, stuffToDispose );

		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.showMessage', async (node: Subscription) => {
			let uri = vscode.Uri.parse('servicebusmessage:message01');
			let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
			await vscode.window.showTextDocument(doc, { preview: false });
		})
	);


}

export function deactivate() { }