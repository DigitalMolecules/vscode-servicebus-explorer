import vscode from 'vscode';

export class MessageProvider implements vscode.TextDocumentContentProvider {

    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
        
        return `
{
    "lets":"pretend",
    "this": {
        "is": [
            "a", 
            "fancy",
            "message"
        ]
    }
}
        `;
    }
}