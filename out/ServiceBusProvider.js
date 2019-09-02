"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
class ServiceBusProvider {
    getTreeItem(element) {
        throw new Error("Method not implemented.");
    }
    getChildren(element) {
        throw new Error("Method not implemented.");
    }
}
exports.ServiceBusProvider = ServiceBusProvider;
class Dependency extends vscode.TreeItem {
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
exports.Dependency = Dependency;
//# sourceMappingURL=ServiceBusProvider.js.map