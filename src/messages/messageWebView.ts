import vscode from 'vscode';
import { Subscription } from '../topic/subscription';
import { IServiceBusClient } from '../client/IServiceBusClient';
import { parse, stringify } from 'flatted';

export class MessageWebView {

    constructor(private client: IServiceBusClient) {
    }

    panel: vscode.WebviewPanel | undefined;

    private messages: any[] = [];

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
                    const messageData = stringify(x);
                    messages[x.messageId] = messageData;
                    return `
                    <tr>
                        <td>
                            ${x.messageId}
                        </td>
                        <td>
                            ${x.contentType}
                        </td>
                        <td>
                            <button onclick="showMessage('${topic}', '${subscription}', '${x.messageId}')">Open</button>
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
                    <table>
                        ${messageTable}
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
                var msg = parse(messages[message.messageId]);
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