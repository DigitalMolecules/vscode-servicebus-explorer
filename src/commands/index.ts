import { IDisposable } from "../disposable";
import { ServiceBusProvider } from "../providers/serviceBusProvider";
import { commands, window, Uri, workspace, ExtensionContext, TreeItemCollapsibleState } from "vscode";
import { NameSpace } from "../namespace/namespace";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TopicList } from "../topic/topicList";
import { QueueList } from "../queue/queueList";
import { Subscription } from "../subscription/subscription";
import { SubscriptionUI } from "../subscription/SubscriptionUI";
import { SendToBus } from "../messages/sendToBus";
import { Topic } from "../topic/topic";
import { ExplorerItemBase } from "../common/explorerItemBase";
import { TopicUI } from "../topic/TopicUI";
import { Queue } from "../queue/queue";
import { QueueUI } from "../queue/QueueUI";

export default function registerCommands(
	context: ExtensionContext, 
	serviceBusProvider: ServiceBusProvider, 
	nameSpace: NameSpace, 
	subscriptionUI: SubscriptionUI, 
	topicUI: TopicUI,
	queueUI: QueueUI, 
	sendToBus: SendToBus): IDisposable[] {
	return [
		commands.registerCommand('serviceBusExplorer.refreshEntry', () => serviceBusProvider.reBuildTree()),

		commands.registerCommand('serviceBusExplorer.addEntry', async () => {
			var state = await nameSpace.addNamespace();
		    await serviceBusProvider.addNamespace({ name: state.name, connection: state.connectionString, collapsibleState: TreeItemCollapsibleState.Collapsed });
		}),

		commands.registerCommand('serviceBusExplorer.editEntry', async (node: NameSpaceItem) => {
			var state = await nameSpace.editNamespace(node);
			await serviceBusProvider.editNamespace(node, { name: state.name, connection: state.connectionString, collapsibleState: state.collapsibleState });
		}),

		commands.registerCommand('serviceBusExplorer.deleteEntry', (node: NameSpaceItem) => serviceBusProvider.deleteNamespace(node)),

		commands.registerCommand('serviceBusExplorer.refreshTopicList', (node: TopicList) => serviceBusProvider.reBuildTree(node)),

		commands.registerCommand('serviceBusExplorer.refreshQueueList', (node: QueueList) => serviceBusProvider.reBuildTree(node)),

		commands.registerCommand('serviceBusExplorer.getSubscriptionMessages', async (node: Subscription) => await node.getSubscriptionMessages(context)),
		
		commands.registerCommand('serviceBusExplorer.searchMessage', async (node: Subscription) => {
			var state = await subscriptionUI.searchMessages();
			await node.searchMessages(context, state.searchArguments);
		}),

		commands.registerCommand('serviceBusExplorer.showMessage', async (topic: string, subscription: string, message: any) => {
			let uri = Uri.parse(`servicebusmessage:message_${message.messageId}.json?topic=${topic}&subscription=${subscription}&messageid=${message.messageId}`);
			let doc = await workspace.openTextDocument(uri); // calls back into the provider
			await window.showTextDocument(doc, { preview: false });
		}),

		commands.registerCommand('serviceBusExplorer.sendToBus', async () => {
			if (window.activeTextEditor) {
				const documentText = window.activeTextEditor.document.getText();
				var destination = await sendToBus.sendToBus();
				await destination.client.sendMessage(destination.selectedTopic.title, documentText, 'application/json');
				window.showInformationMessage('Message sent successfully');
			}
			else {
				window.showErrorMessage('Only implemented for active document');
			}

		}),		
		
		commands.registerCommand('serviceBusExplorer.createSubscription', async (node: Topic) => {
			var state  = await  subscriptionUI.createSubscription();
			await node.createSubscription(state.name);
			serviceBusProvider.reBuildTree(node);
		}),

		commands.registerCommand('serviceBusExplorer.deleteSubscription', async (node: Subscription) => {
			var state  = await subscriptionUI.deleteSubscription();

			if (state.confirm.toUpperCase() === "YES") {
				await node.deleteSubscription();
				serviceBusProvider.reBuildTree(node.parent);
			}
			else {
				window.showErrorMessage('Deletion has not been confirmed as "Yes" was not typed');
			}
		}),

		commands.registerCommand('serviceBusExplorer.createTopic', async (node: TopicList) => {
			var state  = await  topicUI.createTopic();
			await node.createTopic(state.name);
			serviceBusProvider.reBuildTree(node);
		}),

		commands.registerCommand('serviceBusExplorer.deleteTopic', async (node: Topic) => {
			var state  = await topicUI.deleteTopic();

			if (state.confirm.toUpperCase() === "YES") {
				await node.deleteTopic();
				serviceBusProvider.reBuildTree(node.parent);
			}
			else {
				window.showErrorMessage('Deletion has not been confirmed as "Yes" was not typed');
			}
		}),

		commands.registerCommand('serviceBusExplorer.createQueue', async (node: QueueList) => {
			var state  = await  queueUI.createQueue();
			await node.createQueue(state.name);
			serviceBusProvider.reBuildTree(node);
		}),

		commands.registerCommand('serviceBusExplorer.deleteQueue', async (node: Queue) => {
			var state  = await queueUI.deleteQueue();

			if (state.confirm.toUpperCase() === "YES") {
				await node.deleteQueue();
				serviceBusProvider.reBuildTree(node.parent);
			}
			else {
				window.showErrorMessage('Deletion has not been confirmed as "Yes" was not typed');
			}
		}),

		commands.registerCommand('serviceBusExplorer.toggleCollapseAll', async (node: NameSpaceItem) => {
			//node.collapse();
			//node.itemData.collapsibleState = TreeItemCollapsibleState.Expanded;

			//serviceBusProvider.refresh(node);

			await serviceBusProvider.toggleCollapse(node, node.itemData);
		})
	];
}