'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Lc2kDefinitionProvider } from './lc2kDeclaration';
import { Lc2kHoverProvider } from './lc2kDeclaration';


const LC2K_MODE: vscode.DocumentFilter = { language: 'lc2k', scheme: 'file' };


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
   
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "weeeee" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    /*context.subscriptions.push( 
        vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    })
    );*/

    let disposable1 = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });
    let disposable2 = vscode.languages.registerHoverProvider(LC2K_MODE, new Lc2kHoverProvider());

    context.subscriptions.push(disposable1);
    context.subscriptions.push(disposable2);
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            LC2K_MODE, new Lc2kDefinitionProvider()));
}

// this method is called when your extension is deactivated
export function deactivate() {
}