import vscode from 'vscode';
import { MessageStoreInstance } from '../common/global';
import { format } from '../messages/formatter';

export class MessageProvider implements vscode.TextDocumentContentProvider {

    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
        // var message  = this.client.getMessage('', '', uri.path);
        const result = uri.query.split('&').find(x => x.startsWith('messageid'));

        if (result) {
            const messageId = result.split('=') ? result.split('=')[1] : '';
            const message = MessageStoreInstance.getMessage(messageId);
            
            if(message && message.body){
                let stringBody = '';
                if(typeof message.body === 'object'){
                    stringBody = JSON.stringify(message.body);
                }
                else{
                    stringBody = message.body;
                }
                
                return  format(stringBody);
            }
            
            return '';
        }
        else{
            
            return ''; 
        }
    }
}