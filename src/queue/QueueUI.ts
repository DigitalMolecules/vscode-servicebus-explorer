import { ExtensionContext, window, QuickPickItem } from "vscode";
import { MultiStepInput } from "../common/multiStepInput";
import { NAMESPACE_CONNECTIONS } from "../common/global";
import ServiceBusClient from "../client/ServiceBusClient";
import { IServiceBusClient } from "../client/IServiceBusClient";
import { IItemData } from "../common/explorerItemBase";
import { Queue } from "./queue";

interface ICreateQueueState {
    name: string;
}

interface IDeleteQueueState {
    confirm: string;
}

export class QueueUI {

    private node: Queue | null = null;
    private title: string = 'NameSpace';

    constructor(
        public readonly context: ExtensionContext
    ) {

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

    private validateNameIsUnique = async (name: string) => {
        if (name.trim() === '') {
            return 'Search parameter is mandatory';
        }
        // else {
        //     var items = this.context.globalState.get<IItemData[]>(NAMESPACE_CONNECTIONS, []);

        //     if ((this.node === null || this.node.data.name !== name.trim()) && items.find(p => p.name === name.trim())) {
        //         return 'Name not unique';
        //     }
        // }
    }

    private inputCreateQueueArguments = async (input: MultiStepInput, state: Partial<ICreateQueueState>) => {
     
     
        state.name = await input.showInputBox({
            title: 'Create Queue',
            step: 1,
            totalSteps: 1,
            value: '',
            prompt: 'Set the name of the queue',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });
    }

    public createQueue = async () => {

        const state = {} as ICreateQueueState;

        await MultiStepInput.run(input => this.inputCreateQueueArguments(input, state));

        return state;
    }

    private inputDeleteQueueArguments = async (input: MultiStepInput, state: Partial<IDeleteQueueState>) => {
     
     
        state.confirm = await input.showInputBox({
            title: 'Delete Queue',
            step: 1,
            totalSteps: 1,
            value: '',
            prompt: 'Type "Yes" to confirm deletion',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });
    }

    public deleteQueue = async () => {

        const state = {} as IDeleteQueueState;

        await MultiStepInput.run(input => this.inputDeleteQueueArguments(input, state));

        return state;
    }
}