import vscode from 'vscode';
import { stringify } from 'flatted';
import { MessageStoreInstance } from '../common/global';

export class MessageProvider implements vscode.TextDocumentContentProvider {

    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
        // var message  = this.client.getMessage('', '', uri.path);
        const result = uri.query.split('&').find(x => x.startsWith('messageid'));

        if (result) {
            const messageId = result.split('=') ? result.split('=')[1] : '';
            const message = MessageStoreInstance.getMessage(messageId);
            
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