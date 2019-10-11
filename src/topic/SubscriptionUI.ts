import { ExtensionContext, window, QuickPickItem } from "vscode";
import { MultiStepInput } from "../common/multiStepInput";
import { NAMESPACE_CONNECTIONS } from "../common/global";
import ServiceBusClient from "../client/ServiceBusClient";
import { IServiceBusClient } from "../client/IServiceBusClient";
import { IItemData } from "../common/explorerItemBase";
import { Subscription } from "./subscription";

interface ISearchMessageState {
    title: string;
    step: number;
    totalSteps: number;
    searchArguments: string;
    //runtime: QuickPickItem;
}

interface ICreateSubscriptionState {
    name: string;
}

export class SubscriptionUI {

    private node: Subscription | null = null;
    private title: string = 'NameSpace';

    constructor(
        public readonly context: ExtensionContext
    ) {

    }

    public searchMessages = async (): Promise<ISearchMessageState> => {
        this.title = 'Add Namespace';
        this.node = null;

        const state = {} as ISearchMessageState;

        await MultiStepInput.run(input => this.inputSearchArguments(input, state));

        //window.showInformationMessage(`Adding Namespace  '${state.name}'`);

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

    private inputSearchArguments = async (input: MultiStepInput, state: Partial<ISearchMessageState>) => {
     
     
        state.searchArguments = await input.showInputBox({
            title: this.title,
            step: 2,
            totalSteps: 2,
            value: '',
            prompt: 'Search for messages',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });

            //maybe return second step to select search options
        //return (input: MultiStepInput) => this.inputName(input, state);
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

    private inputCreateSubscriptionArguments = async (input: MultiStepInput, state: Partial<ICreateSubscriptionState>) => {
     
     
        state.name = await input.showInputBox({
            title: 'Create Subscription',
            step: 1,
            totalSteps: 1,
            value: '',
            prompt: 'Set the name of the subscription',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });
    }

    public createSubscription = async () => {

        const state = {} as ICreateSubscriptionState;

        await MultiStepInput.run(input => this.inputCreateSubscriptionArguments(input, state));

        return state;
    }
}