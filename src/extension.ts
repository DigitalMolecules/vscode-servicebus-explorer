'use strict';

import * as vscode from 'vscode';
import { ServiceBusProvider, NameSpace } from './serviceBusProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "service-bus-explorer" is now active!');

	vscode.window.registerTreeDataProvider('servicebus-namespaces', new ServiceBusProvider());

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.refreshEntry', () => {
			vscode.window.showInformationMessage('Refresh not implemented!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.addEntry', () => {
			vscode.window.showInformationMessage('Add not implemented!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.editEntry', (node: NameSpace) => {
			vscode.window.showInformationMessage('Edit not implemented!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('serviceBusExplorer.deleteEntry', (node: NameSpace) => {
			vscode.window.showInformationMessage('Delete not implemented!');
		})
	);
}

export function deactivate() { }