import { MessageStore } from "../messages/MessageStore";
import { window } from "vscode";

export const NAMESPACE_CONNECTIONS = 'dm.sbe.connections';

export const MessageStoreInstance = new MessageStore();

export const confirmDialog = async (message?: string) : Promise<boolean> => {
    let result = await window.showWarningMessage(message || "Please confirm", {  modal: true }, "Ok");

    return result === "Ok";
};