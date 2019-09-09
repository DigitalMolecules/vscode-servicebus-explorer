import vscode from 'vscode';
import { Subscription } from '../topic/subscription';

export class MessageWebView {

    panel: vscode.WebviewPanel | undefined;

    async getMessages(): Promise<any[]> {
        return [
            1,
            2
        ];
    }

    async renderMessages(title: string, messages: any[] ): Promise<void> {
        if(!this.panel){
            return;
        }

        const messageTable: string = 
        
            messages.map(x=>
                `
                    <tr>
                        <td>
                            Message 1
                        </td>
                        <td>
                            <button onclick="showMessage()">Get Messages</button>
                        </td>
                    </tr>
                `
            )
            .reduce( (p, c)=> p+=c , '');

        this.panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
		</head>
		<body>
                <h1>Messages (${title})</h1>
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
                    ${messageTable}
                </table>
			</body>
			
			`;

    }

    async open(context: vscode.ExtensionContext, node: Subscription) : Promise<void> {

        this.panel = vscode.window.createWebviewPanel(
            'messagelist', // Identifies the type of the webview. Used internally
            `Messages (${node.label})`, // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true
            }
        );

        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'serviceBusExplorer.showMessage':
                        vscode.commands.executeCommand('serviceBusExplorer.showMessage');
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        const messages = await this.getMessages();

        await this.renderMessages(node.label, messages);

        this.panel.onDidDispose(() => {

        }, null, context.subscriptions);
    }

}