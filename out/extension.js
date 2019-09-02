'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const serviceBusProvider_1 = require("./serviceBusProvider");
function activate(context) {
    console.log('Congratulations, your extension "service-bus-explorer" is now active!');
    vscode.window.registerTreeDataProvider('servicebus-namespaces', new serviceBusProvider_1.ServiceBusProvider());
    context.subscriptions.push(vscode.commands.registerCommand('serviceBusExplorer.refreshEntry', () => {
        vscode.window.showInformationMessage('Refresh not implemented!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('serviceBusExplorer.addEntry', () => {
        vscode.window.showInformationMessage('Add not implemented!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('serviceBusExplorer.editEntry', (node) => {
        vscode.window.showInformationMessage('Edit not implemented!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('serviceBusExplorer.deleteEntry', (node) => {
        vscode.window.showInformationMessage('Delete not implemented!');
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map