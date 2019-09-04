import { QuickPickItem, TreeItemCollapsibleState, Command} from "vscode";
import { ExplorerItemBase } from "../common/explorerItemBase";

export interface State {
	title: string;
	step: number;
	totalSteps: number;
	connectionString: string;
	name: string;
	runtime: QuickPickItem;
}

export interface NameSpaceData {
	name: string;
	connection: string;
	error?: any;
	clientInstance?: IServiceBusClient;
}

export class NameSpace extends ExplorerItemBase {

	constructor(
		public data: NameSpaceData,
		collapsibleState: TreeItemCollapsibleState,
		command?: Command
	) {
		super(data.name, collapsibleState, command);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return this.data.error ? 'ERROR' : '(0)';
	}

	contextValue = 'namespace';
}