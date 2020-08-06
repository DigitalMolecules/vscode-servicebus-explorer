import vscode from 'vscode';
import { Subscription } from '../subscription/subscription';
import { IServiceBusClient } from '../client/IServiceBusClient';
import { MessageStoreInstance } from '../common/global';
import { ReceivedMessageInfo } from '@azure/service-bus';
import { ExplorerItemBase } from '../common/explorerItemBase';
import { Queue } from '../queue/queue';

export class MessageWebView {

    private panel: vscode.WebviewPanel | undefined;

    constructor(
        private client: IServiceBusClient,
        public readonly node: ExplorerItemBase) {
    }

    async renderMessages(topic: string | null, subscription: string | null, queue: string | null, messages: any[]): Promise<void> {
        if (!this.panel) {
            return;
        }

        const messageTable: string =
            messages.length > 0 ?
                messages.map((x) => {
                    MessageStoreInstance.setMessage(x.messageId, x);
                    return `
                    <tr>
                        <td data-message-id="${x.messageId}">
                            ${x.messageId}
                        </td>
                        <td data-content-type="${x.contentType || ''}">
                            ${x.contentType || ''}
                        </td>
                        <td data-content-type="${x.label || ''}">
                            ${x.label || ''}
                        </td>
                        <td data-content-type="${x.enqueuedSequenceNumber || ''}">
                            ${x.enqueuedSequenceNumber || ''}
                        </td>
                        <td>
                            ${ x.enqueuedTimeUtc.toLocaleString() || ''}
                        </td>
                        <td>
                            <div class="dropdown">
                                <button class="button">Open &hellip;</button>
                                <div class="dropdown-content">
                                    <ul>
                                        <li>
                                            <a onclick="showMessage('${topic}', '${subscription}', '${queue}', '${x.messageId}', '${x.enqueuedSequenceNumber}')" title="Open raw message">Open raw</a>
                                        </li>
                                        <li>
                                            <a onclick="showZippedMessage('${topic}', '${subscription}', '${queue}', '${x.messageId}', '${x.enqueuedSequenceNumber}')" title="Unzip and open message">Open zipped</a>
                                        </li>
                                    </ul>
                                </div>
                            </div> 
                        </td>
                        <td>
                            <button class="button" onclick="deleteMessage('${topic}', '${subscription}', '${queue}', '${x.messageId}', '${x.enqueuedSequenceNumber}')">Delete</button>
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
                <title>Message List</title>
                <style>

                    body {
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-background);
                        font-family: var(--vscode-font-family);
                        font-weight: var(--vscode-font-weight);
                        font-size: var(--vscode-font-size);
                    }

                    th, td {
                        padding-bottom: 4px;
                        text-align: left;
                    }

                    .button{
                        color: var(--vscode-button-foreground);
                        background-color: var(--vscode-button-background);
                        padding: 0.3rem 1rem 0.3rem 1rem;
                        cursor: pointer;
                        border-radius: 4px;
                        opacity: 0.6;
                        transition: 0.3s;
                        border: none;
                        text-decoration: none;
                    }

                    .button:hover:{
                        opacity: 0.1;
                        color: var(--vscode-button-hoverBackground);
                    }

                    .dropdown {
                        background-color: var(--vscode-editor-background);
                        border: var(--vscode-dropdown-border);
                        color: var(--vscode-dropdown-foreground);
                        position: relative;
                        display: block;
                        white-space: no-wrap;
                    }

                    .dropdown ul {
                        list-style-type: none;
                        margin: 0;
                        padding: 0;
                    }

                    .dropdown li {
                        margin: 0.5rem 0;
                    }

                    .dropdown a {
                        cursor: pointer;
                    }
 
                    .dropdown-content {
                        display: none;
                        position: absolute;
                        background-color: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: var(--vscode-inputOption-activeBorder);
                        min-width: 5rem;
                        padding: 0.5rem 1rem;
                        z-index: 1;
                        border-radius: 4px;
                    }

                    .dropdown:hover .dropdown-content {
                        display: block;
                    }

                    input {
                        box-sizing: border-box;
                    }
                    
                    .input{
                        background-color: var(--vscode-input-background);
                        border: var(--vscode-input-border);
                        color: var(--vscode-input-foreground);
                        width: calc(100% - 2rem);
                        padding: 0.5rem 0.8rem 0.5rem 0.8rem;
                        margin: 0px;
                    }

                    .input:active {
                        background-color: var(--vscode-inputOption-activeBackground);
                        border: var(--vscode-inputOption-activeBorder);
                    }

                    .hidden{
                        display:none;
                    }

                </style>
            </head>
            <body>
                    <h1>Messages (${subscription ? subscription : queue})</h1>
                    <script >
                        const vscode = acquireVsCodeApi();
                        function showMessage(topic, subscription, queue, messageId, enqueuedSequenceNumber){
                            vscode.postMessage({
                                command: 'serviceBusExplorer.showMessage',
                                topic: topic,
                                subscription: subscription,
                                queue: queue,
                                messageId: messageId,
                                enqueuedSequenceNumber: enqueuedSequenceNumber
                            })
                        }

                        function showZippedMessage(topic, subscription, queue, messageId, enqueuedSequenceNumber) {
                            vscode.postMessage({
                                command: 'serviceBusExplorer.showZippedMessage',
                                topic: topic,
                                subscription: subscription,
                                queue: queue,
                                messageId: messageId,
                                enqueuedSequenceNumber: enqueuedSequenceNumber
                            })
                        }

                        function deleteMessage(topic, subscription, queue, messageId, enqueuedSequenceNumber){
                            vscode.postMessage({
                                command: 'serviceBusExplorer.deleteMessage',
                                topic: topic,
                                subscription: subscription,
                                queue: queue,
                                messageId: messageId,
                                enqueuedSequenceNumber: enqueuedSequenceNumber
                            })
                        }

                        function filter(){
                            var messageId = filter_messageId.value;
                            
                            var nodesToHide = [];
                            var nodesToShow = [];
                            if(!messageId || messageId.length === 0){
                                nodesToShow = document.querySelectorAll('td[data-message-id]');
                            }
                            else{
                                nodesToHide = document.querySelectorAll('td:not([data-message-id="' + messageId + '"])');
                                nodesToShow = document.querySelectorAll('td[data-message-id="' + messageId + '"]');    
                            }
                          
                            nodesToHide.forEach(function(x) {
                              
                              x.parentNode.classList.add('hidden');
                            });
                            
                            nodesToShow.forEach(function(x) { 
                              x.parentNode.classList.remove('hidden');
                            });
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
                                <th style="text-align:left">
                                    Label
                                </th>
                                <th style="text-align:left">
                                    Enqueued Sequencenumber
                                </th>
                                <th style="text-align:left">
                                    TimeStamp
                                </th>
                                <th/>
                            </tr>
                            <tr>
                                <th style="text-align:left">
                                   <input id="filter_messageId" class="input" onchange="filter()" /> 
                                </th>
                                <th style="text-align:left">
                                    <input id="filter_contentType" class="input" onchange="filter()" /> 
                                </th>
                                <th style="text-align:left">
                                    <input id="filter_label" class="input" onchange="filter()" /> 
                                </th>
                                <th colspan=4/>
                            </tr>
                        </thead>
                        <tbody>
                            ${messageTable}
                        </tbody>
                    </table>
                </body>      
        `;
    }

    async open(context: vscode.ExtensionContext, searchArguments: string | null, deadLetter: boolean = false): Promise<void> {

        let messages: ReceivedMessageInfo[] = [];
        let title = "";

        if (this.node instanceof Subscription) {
            const subscription: Subscription = this.node;
            messages = await this.client.getSubscriptionMessages(subscription.topicName, subscription.label, searchArguments, deadLetter);
            title = `${subscription.topicName} - (${subscription.label})`;
        }
        else if (this.node instanceof Queue) {
            const queue: Queue = this.node;
            messages = await this.client.getQueueMessages(queue.title, searchArguments, deadLetter);
            title = `(${queue.label})`;
        }

        this.panel = vscode.window.createWebviewPanel(
            'messagelist', // Identifies the type of the webview. Used internally
            title, // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true
            }
        );

        this.panel.webview.onDidReceiveMessage(
            message => {
                // Find message by id and sequence number
                var msg = messages.find(x => x.messageId === message.messageId && x.enqueuedSequenceNumber?.toString() === message.enqueuedSequenceNumber);
                
                if (msg) {
                    switch (message.command) {
                        case 'serviceBusExplorer.showMessage':
                            vscode.commands.executeCommand('serviceBusExplorer.showMessage', message.topic, message.subscription, message.queue, msg);
                            return;

                        case 'serviceBusExplorer.showZippedMessage':
                            vscode.commands.executeCommand('serviceBusExplorer.showZippedMessage', message.topic, message.subscription, message.queue, msg);
                            return;

                        case 'serviceBusExplorer.deleteMessage':
                            vscode.commands.executeCommand('serviceBusExplorer.deleteMessage', this.node, msg, deadLetter)
                                .then(() => {
                                    if (msg) {
                                        // Remove the message from the list of messages.
                                        const index = messages.indexOf(msg);
                                        messages.splice(index, 1);
                                        if (this.node instanceof Subscription) {
                                            let subscription: Subscription = this.node;
                                            this.renderMessages(subscription.topicName, subscription.label, null, messages);
                                        }
                                
                                        if (this.node instanceof Queue) {
                                            let queue: Queue = this.node;
                                            this.renderMessages(null, null, queue.title, messages);
                                        }
                                    }
                                });
                            return;
                    }
                }
            },
            undefined,
            context.subscriptions
        );

        if (this.node instanceof Subscription) {
            let subscription: Subscription = this.node;
            await this.renderMessages(subscription.topicName, subscription.label, null, messages);
        }

        if (this.node instanceof Queue) {
            let queue: Queue = this.node;
            await this.renderMessages(null, null, queue.title, messages);
        }

        this.panel.onDidDispose(() => {
        }, null, context.subscriptions);
    }
}