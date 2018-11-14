'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Lc2kDefinitionProvider } from './lc2kDeclaration';
import { Lc2kFormatter } from './lc2kFormat';
import { Lc2kHoverProvider } from './hoverInfo';

const LC2K_MODE: vscode.DocumentFilter = {
  language: 'lc2k',
  scheme: 'file'
};


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // set variables for providers
  let hoverprovider = vscode.languages.registerHoverProvider(LC2K_MODE, new Lc2kHoverProvider());
  let formatter = vscode.languages.registerDocumentFormattingEditProvider(LC2K_MODE, new Lc2kFormatter());
  let formatter2 = vscode.languages.registerDocumentRangeFormattingEditProvider(LC2K_MODE, new Lc2kFormatter());
  let defProvider = vscode.languages.registerDefinitionProvider(LC2K_MODE, new Lc2kDefinitionProvider());

  // register them
  context.subscriptions.push(formatter);
  context.subscriptions.push(formatter2);
  context.subscriptions.push(hoverprovider);
  context.subscriptions.push(defProvider);
}

// this method is called when your extension is deactivated
export function deactivate() { }
