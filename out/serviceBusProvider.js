"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
class ServiceBusProvider {
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return Promise.resolve([new NameSpace("Label1", "1", vscode.TreeItemCollapsibleState.Collapsed)]);
    }
}
exports.ServiceBusProvider = ServiceBusProvider;
class NameSpace extends vscode.TreeItem {
    constructor(label, version, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.version = version;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
        };
        this.contextValue = 'dependency';
    }
    get tooltip() {
        return `${this.label}-${this.version}`;
    }
    get description() {
        return this.version;
    }
}
exports.NameSpace = NameSpace;
//# sourceMappingURL=serviceBusProvider.js.map