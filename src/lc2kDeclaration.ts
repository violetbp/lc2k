import * as vscode from 'vscode';

export interface Lc2kDefinitionInformation {
  file: string;
  line: number;
  column: number;
  doc: string;
  declarationlines: string[];
  name: string;
  toolUsed: string;
}

export class Lc2kDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(document: vscode.TextDocument, position: vscode.Position,
    token: vscode.CancellationToken):  // ProviderResult<Definition | DefinitionLink[]>{
    Thenable<vscode.Location> {
    return new Promise<vscode.Location>((resolve, reject) => {
      let range = document.getWordRangeAtPosition(position);
      let symbol = document.getText(range);
      // console.log(symbol);
      if (false) {  // symbol === "add") {
        // console.log("ayay");

        let pos = new vscode.Position(position.line, 5);
        resolve(new vscode.Location(document.uri, pos));
      } else {
        reject(null);
      }
    });
  }
}
