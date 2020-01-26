import { ExtensionContext, window, QuickPickItem } from "vscode";
import { MultiStepInput, IQuickPickParameters } from "../common/multiStepInput";
import { NAMESPACE_CONNECTIONS } from "../common/global";
import ServiceBusClient from "../client/ServiceBusClient";
import { IServiceBusClient } from "../client/IServiceBusClient";
import { IItemData } from "../common/explorerItemBase";
import { strictEqual } from "assert";
import * as vscode from 'vscode';
import { ITopic } from "../client/models/ITopicDetails";
import { IQueue } from "../client/models/IQueueDetails";
import { Queue } from "../queue/queue";

interface ISendToBusState {
    title: string;
    step: number;
    totalSteps: number;
    selectedNamespace: ISelectedNamespaceItem;
    selectedTopic: ITopic;
    selectedQueue: IQueue;
    client: IServiceBusClient;
}

interface ISelectedNamespaceItem extends QuickPickItem {
    itemData: IItemData;
}


interface ISelectedTopicItem extends QuickPickItem {
    topic: ITopic;
}

interface ISelectedQueueItem extends QuickPickItem {
    queue: IQueue;
}

export class SendToBus {
    state: vscode.Memento;

    constructor(
        public readonly context: ExtensionContext
    ) {
        this.state = context.globalState;
    }

    public sendToBus = async (): Promise<ISendToBusState> => {

        const state = {} as ISendToBusState;

        await MultiStepInput.run(input => this.selectNamespace(input, state));

        window.showInformationMessage(`Sending Message..'`);

        return state;
    }

    private shouldResume() {
        // Could show a notification with the option to resume.
        return new Promise<boolean>((resolve, reject) => {

        });
    }

    private validateConnectionString = async (name: string): Promise<string | undefined> => {
        // ...validate...
        if (name.trim() === '') {
            return 'Connection string must be filled in';
        }
    }

    private selectNamespace = async (input: MultiStepInput, state: Partial<ISendToBusState>) => {
        let items = this.state.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);
        const selectedItem = await input.showQuickPick<ISelectedNamespaceItem, IQuickPickParameters<ISelectedNamespaceItem>>({
            title: 'Select Namespace',
            items: items.map(x => ({ itemData: x, label: x.name } as ISelectedNamespaceItem)),
            step: 1,
            totalSteps: 4,
            shouldResume: this.shouldResume,
            placeholder: ''
        });

        state.selectedNamespace = selectedItem;

        return (input: MultiStepInput) => this.topicsOrQueues(input, state);
    }

    private topicsOrQueues = async (input: MultiStepInput, state: Partial<ISendToBusState>) => {

        let items = [
            {
                name: 'Topics'
            },
            {
                name: 'Queues'
            }
        ];

        const selectedItem: { name: string, label: string } = await input.showQuickPick({
            title: 'Select Namespace',
            items: items.map(x => ({ ...x, label: x.name })),
            step: 1,
            totalSteps: 4,
            shouldResume: this.shouldResume,
            placeholder: ''
        });

        if (selectedItem.name === "Queues") {
            return (input: MultiStepInput) => this.selectQueue(input, state);
        }

        return (input: MultiStepInput) => this.selectTopic(input, state);
    }

    private selectTopic = async (input: MultiStepInput, state: Partial<ISendToBusState>) => {

        let name = '';

        if (!state.selectedNamespace) {
            throw new Error("state.selectedNamespace is null");
        }

        var namespaceClient = new ServiceBusClient(state.selectedNamespace.itemData.connection);

        let items = await namespaceClient.getTopics();

        const selectedItem = await input.showQuickPick<ISelectedTopicItem, IQuickPickParameters<ISelectedTopicItem>>({
            title: 'Select Namespace',
            items: items.map(x => ({ topic: x, label: x.title } as ISelectedTopicItem)),
            step: 1,
            totalSteps: 4,
            shouldResume: this.shouldResume,
            placeholder: ''
        });
        
        state.client = namespaceClient;
        state.selectedTopic = selectedItem.topic;

    }

    private selectQueue = async (input: MultiStepInput, state: Partial<ISendToBusState>) => {

        let name = '';

        if (!state.selectedNamespace) {
            throw new Error("state.selectedNamespace is null");
        }

        var namespaceClient = new ServiceBusClient(state.selectedNamespace.itemData.connection);

        let items = await namespaceClient.getQueues();

        const selectedItem = await input.showQuickPick<ISelectedQueueItem, IQuickPickParameters<ISelectedQueueItem>>({
            title: 'Select Namespace',
            items: items.map(x => ({ queue: x, label: x.title } as ISelectedQueueItem)),
            step: 1,
            totalSteps: 4,
            shouldResume: this.shouldResume,
            placeholder: ''
        });
        
        state.client = namespaceClient;
        state.selectedQueue = selectedItem.queue;
    }

    private validateNameIsUnique = async (name: string) => {
        if (name.trim() === '') {
            return 'Name must be filled in';
        }
        else {
            var items = this.context.globalState.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

            // if ((this.node === null || this.node.data.name !== name.trim()) && items.find(p => p.name === name.trim())) {
            //     return 'Name not unique';
            // }
        }
    }
}