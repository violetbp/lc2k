import * as vscode from 'vscode';

export class Lc2kFormatter implements vscode.DocumentRangeFormattingEditProvider, vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
                                 token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    return [];
  }

  provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions,
                                      token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    return [];
  }
}