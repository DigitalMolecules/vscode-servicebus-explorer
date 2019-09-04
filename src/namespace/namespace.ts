import { ExtensionContext, window, QuickPickItem } from "vscode";
import { INameSpaceData, NameSpaceItem } from "./namespaceItem";
import { MultiStepInput } from "../common/multiStepInput";
import { NAMESPACE_CONNECTIONS } from "../common/global";

interface IState {
	title: string;
	step: number;
	totalSteps: number;
	connectionString: string;
	name: string;
	runtime: QuickPickItem;
}

export class NameSpace {
    
    private node: NameSpaceItem | null = null;
    private title: string = 'NameSpace';

	constructor(
        public readonly context: ExtensionContext
	){

    }
    
    public async addNamespace(): Promise<IState> {
        this.title = 'Add Namespace';
        this.node = null;

        const state = {} as IState;
        await MultiStepInput.run(input => this.inputConnnectionString(input, state));
        window.showInformationMessage(`Adding Namespace  '${state.name}'`);
        return state;
    }

    public async editNamespace(node: NameSpaceItem): Promise<IState> {
        this.title = 'Edit Namespace';
        this.node = node;

        const state = {} as IState; 
        await MultiStepInput.run(input => this.inputConnnectionString(input, state)); 
        window.showInformationMessage(`Editing Namespace  '${state.name}'`);    
        return state;
    }

	private shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {

		});
    }

    private async validateConnectionString(name: string): Promise<string | undefined> {
        // ...validate...
        if (name.trim() === '') {
            return 'Connection string must be filled in';
        }
    }

    private async inputConnnectionString(input: MultiStepInput, state: Partial<IState>) {
        state.connectionString = await input.showInputBox({
            title: this.title,
            step: 1,
            totalSteps: 2,
            value: typeof state.connectionString === 'string' ? state.connectionString : this.node === null ? '': this.node.data.connection,
            prompt: 'Paste the connection string to the namespace',
            validate: this.validateConnectionString,
            shouldResume: this.shouldResume
        });
    
        return (input: MultiStepInput) => this.inputName(input, state);
    }
    
    private async inputName(input: MultiStepInput, state: Partial<IState>) {
        // TODO: Remember current value when navigating back.
        state.name = await input.showInputBox({
            title: this.title,
            step: 2,
            totalSteps: 2,
            value: state.name || this.node === null ? '': this.node.data.name,
            prompt: 'Choose a name for the namespace',
            validate: this.validateNameIsUnique,
            shouldResume: this.shouldResume
        });
    }

    private async validateNameIsUnique(name: string) {
        // ...validate...
        if (name.trim() === '') {
            //return {isValid: false, message: 'Name must be filled in'};
            return 'Name must be filled in';
    
        }
        else {
            var items = this.context.workspaceState.get<INameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
            
            if (items.find(p => p.name === name.trim())) {
                //await new Promise(resolve => setTimeout(resolve, 1000));
                return 'Name not unique';
            }
        }
    }
}