import { ExtensionContext, window, QuickPickItem } from "vscode";
import { MultiStepInput } from "../common/multiStepInput";
import { NAMESPACE_CONNECTIONS } from "../common/global";
import ServiceBusClient from "../client/ServiceBusClient";
import { IServiceBusClient } from "../client/IServiceBusClient";
import { IItemData } from "../common/explorerItemBase";
import { Topic } from "./topic";

interface ICreateTopicState {
    name: string;
}

interface IDeleteTopicState {
    confirm: string;
}

export class TopicUI {

    private node: Topic | null = null;
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

    private inputCreateTopicArguments = async (input: MultiStepInput, state: Partial<ICreateTopicState>) => {
     
     
        state.name = await input.showInputBox({
            title: 'Create Topic',
            step: 1,
            totalSteps: 1,
            value: '',
            prompt: 'Set the name of the topic',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });
    }

    public createTopic = async () => {

        const state = {} as ICreateTopicState;

        await MultiStepInput.run(input => this.inputCreateTopicArguments(input, state));

        return state;
    }

    private inputDeleteTopicArguments = async (input: MultiStepInput, state: Partial<IDeleteTopicState>) => {
     
     
        state.confirm = await input.showInputBox({
            title: 'Delete Topic',
            step: 1,
            totalSteps: 1,
            value: '',
            prompt: 'Type "Yes" to confirm deletion',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });
    }

    public deleteTopic = async () => {

        const state = {} as IDeleteTopicState;

        await MultiStepInput.run(input => this.inputDeleteTopicArguments(input, state));

        return state;
    }
}