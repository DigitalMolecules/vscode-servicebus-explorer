import vscode from 'vscode';
import { IServiceBusClient } from '../client/IServiceBusClient';
import { IMessageStore } from '../messages/IMessageStore';
import { stringify } from 'flatted';

export class MessageProvider implements vscode.TextDocumentContentProvider {

    constructor(private messageStore: IMessageStore){

    }
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
        // var message  = this.client.getMessage('', '', uri.path);
        const result = uri.query.split('&').find(x => x.startsWith('messageid'));
        if (result) {
            const messageId = result.split('=') ? result.split('=')[1] : '';
            const message = this.messageStore.getMessage(messageId);
            if(message){
            return  stringify(message.body);
            }
            return '';
        }
        else{
            
            return ''; 
        }
    }
}