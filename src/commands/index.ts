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
import { withUsernamePasswordWithAuthResponse } from "@azure/ms-rest-nodeauth/dist/lib/login";
import { confirmDialog } from "../common/global";

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

		commands.registerCommand('serviceBusExplorer.getSubscriptionMessages', async (node: Subscription) => await node.getMessages(context)),

		commands.registerCommand('serviceBusExplorer.getQueueMessages', async (node: Queue) => await node.getMessages(context)),

		commands.registerCommand('serviceBusExplorer.searchMessage', async (node: Subscription) => {
			var state = await subscriptionUI.searchMessages();
			await node.searchMessages(context, state.searchArguments);
		}),

		commands.registerCommand('serviceBusExplorer.showMessage', async (topic: string | null, subscription: string | null, queue: string | null, message: any) => {
			var uri;

			if (topic && subscription) {
				uri = Uri.parse(`servicebusmessage:message_${message.messageId}.json?topic=${topic}&subscription=${subscription}&messageid=${message.messageId}`);
			}

			if (queue) {
				uri = Uri.parse(`servicebusmessage:message_${message.messageId}.json?queue=${queue}&messageid=${message.messageId}`);
			}

			if (uri) {
				let doc = await workspace.openTextDocument(uri); // calls back into the provider
				await window.showTextDocument(doc, { preview: false });
			}
			else {
				throw new Error("No subscription or queue defined");
			}
		}),

		commands.registerCommand('serviceBusExplorer.purgeSubscriptionMessages', async (node: Subscription) => {
			if ((await confirmDialog())) {
				await node.purgeMessages();
			}
		}),

		commands.registerCommand('serviceBusExplorer.purgeQueueMessages', async (node: Queue) => {
			if ((await confirmDialog())) {
				await node.purgeMessages();
			}
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
			var state = await subscriptionUI.createSubscription();
			await node.createSubscription(state.name);
			serviceBusProvider.refresh(node);
		}),

		commands.registerCommand('serviceBusExplorer.deleteSubscription', async (node: Subscription) => {
			if ((await confirmDialog())) {
				await node.delete();
				serviceBusProvider.refresh(node.parent);
			}
		}),

		commands.registerCommand('serviceBusExplorer.createTopic', async (node: TopicList) => {
			var state = await topicUI.createTopic();
			await node.createTopic(state.name);
			serviceBusProvider.refresh(node);
		}),

		commands.registerCommand('serviceBusExplorer.deleteTopic', async (node: Topic) => {
			if ((await confirmDialog())) {
				await node.delete();
				serviceBusProvider.refresh(node);
			}
		}),

		commands.registerCommand('serviceBusExplorer.createQueue', async (node: QueueList) => {
			var state = await queueUI.createQueue();
			await node.createQueue(state.name);
			serviceBusProvider.refresh(node);
		}),

		commands.registerCommand('serviceBusExplorer.deleteQueue', async (node: Queue) => {
			if ((await confirmDialog())) {
				await node.delete();
				serviceBusProvider.refresh(node.parent);
			}
		}),

		commands.registerCommand('serviceBusExplorer.toggleCollapseAll', async (node: NameSpaceItem) => {
			await serviceBusProvider.toggleCollapse(node, node.itemData);
		})
	];
}