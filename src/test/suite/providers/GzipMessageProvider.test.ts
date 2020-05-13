import * as assert from 'assert';
import { before } from 'mocha';
import * as vscode from 'vscode';
import { GzipMessageProvider } from  "../../../providers/gzipMessageProvider";
import { MessageStoreInstance } from '../../../common/global';

suite('GzipMessageProvider Test Suite', () => {
	const { deflate } = require('zlib');
	const { promisify } = require('util');
	const do_zip = promisify(deflate);

	const body = { root: { "node": "data" } };
	const messageid = "TestMessageId";
	const messageProvider = new GzipMessageProvider();
	
	before(async () => {
		vscode.window.showInformationMessage('Start all tests.');
		
		await do_zip(JSON.stringify(body))
			.then((buffer: Buffer) => {
				var testmsg: any = {};
				testmsg.body = buffer;
				MessageStoreInstance.setMessage(messageid, testmsg);
			})
			.catch((err: Error) => {
				assert.fail('Could not init test: ' + err);
			});
	});

	test('Should provide text document content from zipped document', async () => {
		const testUri = vscode.Uri.parse(`servicebusmessagegzip:some/path?messageid=${messageid}`);

		const result = await messageProvider.provideTextDocumentContent(testUri);

		const resultObject = JSON.parse(result);

		assert.equal(resultObject.root.node, body.root.node);
	 });
	 
	 test('Should  Provide empty text document content if missing message id', async () => {
		const testUri = vscode.Uri.parse(`servicebusmessagegzip:some/path?messageid=`);

		const result = await messageProvider.provideTextDocumentContent(testUri);

		assert.equal(result,"");
	 });
});
