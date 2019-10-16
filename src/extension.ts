'use strict';

import { ServiceBusProvider } from './providers/serviceBusProvider';
import { NameSpace } from './namespace/namespace';
import { MessageProvider } from './providers/messageProvider';
import registerCommands from './commands';
import { IDisposable } from './disposable';
import { ExtensionContext, window, workspace } from 'vscode';
import { SubscriptionUI } from './subscription/SubscriptionUI';
import { SendToBus } from './messages/sendToBus';
import { TopicUI } from './topic/TopicUI';
import { QueueUI } from './queue/QueueUI';

export function activate(context: ExtensionContext) {

	const serviceBusProvider = new ServiceBusProvider(context);
	const nameSpace = new NameSpace(context);
	const sendToBus = new SendToBus(context);
	const subscriptionUI = new SubscriptionUI(context);
	const topicUI = new TopicUI(context);
	const queueUI = new QueueUI(context);
	const messageProvider = new MessageProvider();

	const disposables: IDisposable[] = [];
	
	disposables.push(window.registerTreeDataProvider('servicebus-namespaces', serviceBusProvider));
	disposables.push(workspace.registerTextDocumentContentProvider('servicebusmessage', messageProvider));
	disposables.push(...registerCommands(context, serviceBusProvider, nameSpace, subscriptionUI, topicUI, queueUI, sendToBus));	

	context.subscriptions.push(...disposables);
}

export function deactivate() { }