import vscode from 'vscode';
import { Subscription } from '../topic/subscription';
import { IServiceBusClient } from '../client/IServiceBusClient';
import { MessageStoreInstance } from '../common/global';

export class MessageWebView {

    private panel: vscode.WebviewPanel | undefined;

    constructor(
        private client: IServiceBusClient) {
    }

    async getMessages(topic: string, subscription: string): Promise<any[]> {
        return await this.client.getMessages(topic, subscription);
    }

    async renderMessages(topic: string, subscription: string, messages: any[]): Promise<void> {
        if (!this.panel) {
            return;
        }

        const messageTable: string =
            messages.length > 0 ?
                messages.map(x => {
                    MessageStoreInstance.setMessage(x.messageId, x);
                    return `
                    <tr>
                        <td>
                            ${x.messageId}
                        </td>
                        <td>
                            ${x.contentType || ''}
                        </td>
                        <td>
                            <button class="button" onclick="showMessage('${topic}', '${subscription}', '${x.messageId}')">Open</button>
                        </td>
                    </tr>
                `;
                })
                    .reduce((p, c) => p += c, '')
                :
                `
                <tr>
                    <td>
                        No messages found
                    </td>
                </tr>
                `
            ;



        this.panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
                <style>
                    .button{
                        color: var(--vscode-button-foreground);
                        background-color: var(--vscode-button-background);
                        padding: 1rem 2rem 1rem 2rem;
                        border: none;
                    }
                    .button:hover:{
                        background-color: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>
            <body>
                    <h1>Messages (${subscription})</h1>
                    <script >
                        const vscode = acquireVsCodeApi();
                        function showMessage(topic, subscription, messageId){
                            vscode.postMessage({
                                command: 'serviceBusExplorer.showMessage',
                                topic: topic,
                                subscription: subscription,
                                messageId: messageId
                            })
                        }
                    </script>
                    <table style="width:100%" >
                        <thead>
                            <tr>
                                <th style="text-align:left">
                                    Message Id
                                </th>
                                <th style="text-align:left">
                                    Content Type
                                </th>
                                <th>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            ${messageTable}
                        </tbody>
                    </table>
                </body>
                
        `;

    }

    async open(context: vscode.ExtensionContext, node: Subscription): Promise<void> {

        const messages = await this.getMessages(node.topicName, node.label);

        this.panel = vscode.window.createWebviewPanel(
            'messagelist', // Identifies the type of the webview. Used internally
            `${node.topicName} - (${node.label})`, // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true
            }
        );

        this.panel.webview.onDidReceiveMessage(
            message => {
                var msg = messages.find(x=>x.messageId === message.messageId);
                switch (message.command) {
                    case 'serviceBusExplorer.showMessage':
                        vscode.commands.executeCommand('serviceBusExplorer.showMessage', message.topic, message.subscription, msg);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        await this.renderMessages(node.topicName, node.label, messages);

        this.panel.onDidDispose(() => {

        }, null, context.subscriptions);
    }
}