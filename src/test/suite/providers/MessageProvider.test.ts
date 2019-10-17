import * as assert from 'assert';
import { before } from 'mocha';
import * as vscode from 'vscode';
import { MessageProvider } from  "../../../providers/messageProvider";
import { MessageStore } from  "../../../messages/MessageStore";
import { MessageStoreInstance } from '../../../common/global';


suite('MessageProvider Test Suite', () => {
	const body = { root: { "node": "data" } };
	const messageid="TestMessageId";
	
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
		var testmsg: any={};
		testmsg.body=body;
		MessageStoreInstance.setMessage("TestMessageId",testmsg);
	});

	test('Test Provide Text Document Content', () => {
		let messageProvider=new MessageProvider();
		let testUri = vscode.Uri.parse(`http://www.msft.com/some/path?query&messageid=TestMessageId`);

		let result= messageProvider.provideTextDocumentContent(testUri);

		let resultObject = JSON.parse(result);

		assert.equal(resultObject.root.node ,body.root.node);
 	});
});