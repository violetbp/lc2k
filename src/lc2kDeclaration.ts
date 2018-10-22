// import vscode = require('vscode');
// import Hover = require('hover');
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




export class Lc2kHoverProvider implements vscode.HoverProvider {
  public provideHover(document: vscode.TextDocument, position: vscode.Position,
                      token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
	let range = document.getWordRangeAtPosition(position);
	let symbol = document.getText(range);
    switch (symbol) {
      case "add": {
        return new vscode.Hover("opcode 000");
      }
      case "nor": {
        return new vscode.Hover("opcode 001");
      }
      case "lw": {
        return new vscode.Hover("opcode 010");
      }
      case "sw": {
        return new vscode.Hover("opcode 011\n\ntest\ntest");
      }
      case "beq": {
        return new vscode.Hover("opcode 100");
      }
      case "jalr": {
        return new vscode.Hover("opcode 101");
      }
      case "halt": {
        return new vscode.Hover("opcode 110");
      }
      case "noop": {
        return new vscode.Hover("opcode 111");
      }

      default: { break; }
    }
  }
}


export class Lc2kDefinitionProvider implements vscode.DefinitionProvider {
  public provideDefinition(document: vscode.TextDocument, position: vscode.Position,
                           token: vscode.CancellationToken):  // ProviderResult<Definition | DefinitionLink[]>{
      Thenable<vscode.Location> {
    return new Promise<vscode.Location>((resolve, reject) => {
      let range = document.getWordRangeAtPosition(position);
      let symbol = document.getText(range);
      console.log(symbol);
      if (symbol === "add") {
        console.log("ayay");

        let pos = new vscode.Position(position.line, 5);

        resolve(new vscode.Location(document.uri, pos));

      } else {
        reject(null);
      }

    });


    // let definitionResource = vscode.Uri.file(document.fileName);

    // return new vscode.Location(definitionResource, pos);
  }
}
