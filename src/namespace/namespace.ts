import { ExtensionContext, window, QuickPickItem, TreeItemCollapsibleState } from "vscode";
import { MultiStepInput } from "../common/multiStepInput";
import { NAMESPACE_CONNECTIONS } from "../common/global";
import ServiceBusClient from "../client/ServiceBusClient";
import { IServiceBusClient } from "../client/IServiceBusClient";
import { NameSpaceItem } from "./namespaceItem";
import { IItemData } from "../common/explorerItemBase";

interface IState {
    title: string;
    step: number;
    totalSteps: number;
    connectionString: string;
    name: string;
    runtime: QuickPickItem;
    collapsibleState: TreeItemCollapsibleState;
}

export class NameSpace {

    private node: NameSpaceItem | null = null;
    private title: string = 'NameSpace';

    constructor(
        public readonly context: ExtensionContext
    ) {

    }

    public addNamespace = async (): Promise<IState> => {
        this.title = 'Add Namespace';
        this.node = null;

        const state = {} as IState;
        state.collapsibleState = TreeItemCollapsibleState.Collapsed;
        await MultiStepInput.run(input => this.inputConnnectionString(input, state));

        window.showInformationMessage(`Adding Namespace  '${state.name}'`);

        return state;
    }

    public editNamespace = async (node: NameSpaceItem): Promise<IState> => {
        this.title = 'Edit Namespace';
        this.node = node;

        const state = {} as IState;
        state.collapsibleState = node.collapsibleState;
        await MultiStepInput.run(input => this.inputConnnectionString(input, state));
        window.showInformationMessage(`Editing Namespace  '${state.name}'`);
        return state;
    }

    private shouldResume(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
        });
    }

    private validateConnectionString = async (name: string): Promise<string | undefined> => {
        if (name.trim() === '') {
            return 'Connection string must be filled in';
        }

        var items = this.context.globalState.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

        if ((this.node === null || this.node.data.connection !== name.trim()) && items.find(p => p.connection === name.trim())) {
             return 'Connection string already exists';
        }
    }

    private inputConnnectionString = async (input: MultiStepInput, state: Partial<IState>) => {
        state.connectionString = await input.showInputBox({
            title: this.title,
            step: 1,
            totalSteps: 2,
            value: state.connectionString || this.node === null ? '' : this.node.data.connection,
            prompt: 'Enter the connection string to the namespace',
            validate: this.validateConnectionString,
            shouldResume: this.shouldResume
        });

        return (input: MultiStepInput) => this.inputName(input, state);
    }

    private inputName = async (input: MultiStepInput, state: Partial<IState>) => {

        let name = '';

        if (this.node === null) {
            const serviceBusClient = new ServiceBusClient(state.connectionString || '') as IServiceBusClient;
            name = serviceBusClient.hostName;
        } else {
            name = this.node.data.name;
        }

        state.name = await input.showInputBox({
            title: this.title,
            step: 2,
            totalSteps: 2,
            value: name,
            prompt: 'Choose a name for the namespace',
            validate: this.validateName,
            shouldResume: this.shouldResume
        });
    }

    private validateName = async (name: string): Promise<string | undefined> => {
        if (name.trim() === '') {
            return 'Name must be filled in';
        }

        var items = this.context.globalState.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

        if ((this.node === null || this.node.data.name !== name.trim()) && items.find(p => p.name === name.trim())) {
            return 'Name already exists';
        }
    }
}