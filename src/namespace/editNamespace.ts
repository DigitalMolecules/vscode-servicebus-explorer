import { window, ExtensionContext } from 'vscode';
import { MultiStepInput } from '../multiStepInput';
import { State, NameSpace, NameSpaceData } from './namespace';
import { NAMESPACE_CONNECTIONS } from '../common/global';

export async function editNamespace(node: NameSpace, context: ExtensionContext): Promise<State> {
	const title = 'Edit Namespace';

	async function pickConnnectionString(input: MultiStepInput, state: Partial<State>) {
		
		state.connectionString = await input.showInputBox({
			title,
			step: 1,
			totalSteps: 2,
			value: typeof state.connectionString === 'string' ? state.connectionString : node.data.connection,
			prompt: 'Paste the connection string to the namespace',
			validate: validateConnectionString,
			shouldResume: shouldResume
		});

		return (input: MultiStepInput) => inputName(input, state);
	}

	async function inputName(input: MultiStepInput, state: Partial<State>) {
		// TODO: Remember current value when navigating back.
		state.name = await input.showInputBox({
			title,
			step: 2,
			totalSteps: 2,
			value: state.name || node.data.name,
			prompt: 'Choose a name for the namespace',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => pickConnnectionString(input, state));
		return state as State;
	}

	const state = await collectInputs();

	window.showInformationMessage(`Editing Namespace  '${state.name}'`);

	return state;

	async function validateConnectionString(name: string): Promise<string | undefined> {
		// ...validate...
		if (name.trim() === '') {
			return 'Connection string must be filled in';
		}
	}

	async function validateNameIsUnique(name: string) {
		// ...validate...
		if (name.trim() === '') {
			//return {isValid: false, message: 'Name must be filled in'};
			return 'Name must be filled in';

		}
		else {
			var items = context.workspaceState.get<NameSpaceData[]>(NAMESPACE_CONNECTIONS, []);
			if (items.find(p => p.name === name.trim())) {
				//await new Promise(resolve => setTimeout(resolve, 1000));
				return 'Name not unique';
			}
		}
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {

		});
	}
}