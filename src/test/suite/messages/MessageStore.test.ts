import * as assert from 'assert';
import { before } from 'mocha';
import * as vscode from 'vscode';
import { MessageStore } from  "../../../messages/MessageStore";

// suite('MessageStore Test Suite', () => {
// 	before(() => {
// 		vscode.window.showInformationMessage('Start all tests.');
// 	});

	 

 




	suite('Extension Test Suite', () => {
		before(() => {
			vscode.window.showInformationMessage('Start all tests.');
		});
	
		test('MessageStore Test Suite', () => {
			let messageStore=new MessageStore();
				  
			messageStore.setMessage("TestMessageId","TestMessage");
			  let result = messageStore.getMessage("TestMessageId");
			 
			assert.equal(result, "TestMessage");
		});
	});