import vscode, { window } from 'vscode';
import { MessageStoreInstance } from '../common/global';
import { format } from '../messages/formatter';

const { unzip } = require('zlib');
const { promisify } = require('util');
const do_unzip = promisify(unzip);

export class GzipMessageProvider implements vscode.TextDocumentContentProvider {

    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const result = uri.query.split('&').find(x => x.startsWith('messageid'));

        if (result) {
            const messageId = result.split('=') ? result.split('=')[1] : '';
            const message = MessageStoreInstance.getMessage(messageId);

            if(message && message.body && Buffer.isBuffer(message.body)) {
                return do_unzip(message.body)
                    .then((unzipedBuffer: Buffer) => {
                        const unzippedString = unzipedBuffer.toString();
                        try {
                            // If we can parse the string it is a json message so we format when returning
                            JSON.parse(unzippedString);
                            return format(unzippedString);
                        } catch {
                            window.showInformationMessage('Could not parse unzipped message to object, returning message as is.');
                            return unzippedString;
                        }
                    })
                    .catch((err: Error) => {
                        window.showErrorMessage(err.message);
                        return Promise.resolve('Could not parse message.');
                    });
            } else {
                return Promise.resolve('Message body is not a buffer.');
            }
        } else {
            return Promise.resolve('Could not find message.');
        }
    }
}
