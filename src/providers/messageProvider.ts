import vscode from 'vscode';
import { IServiceBusClient } from '../client/IServiceBusClient';

export class MessageProvider implements vscode.TextDocumentContentProvider {
    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
       // var message  = this.client.getMessage('', '', uri.path);
        return '';
    }
}