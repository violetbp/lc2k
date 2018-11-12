// import vscode = require('vscode');
// import Hover = require('hover');
import * as vscode from 'vscode';
// import Hodver = require('./opcodeHelp');

import * as v from './opcodeHelp';


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
        return new vscode.Hover("ADD: opcode 000\n\n" + v.op[0].value + v.Rtype.value);
      }
      case "nor": {
        return new vscode.Hover("NOR: opcode 001\n\n" + v.op[1].value + v.Rtype.value);
      }
      case "lw": {
        return new vscode.Hover("LW: opcode 010\n\n" + v.op[2].value + v.Itype.value);
      }
      case "sw": {
        return new vscode.Hover("SW: opcode 011\n\n" + v.op[3].value + v.Itype.value);
      }
      case "beq": {
        return new vscode.Hover("BEQ: opcode 100\n\n" + v.op[4].value + v.Itype.value);
      }
      case "jalr": {
        return new vscode.Hover("JALR: opcode 101\n\n(jump and link register)\n\n" + v.op[5].value + v.Jtype.value);
      }
      case "halt": {
        return new vscode.Hover("HALT: opcode 110\n\n" + v.op[6].value + v.Otype.value);
      }
      case "noop": {
        return new vscode.Hover("NOOP: opcode 111\n\n" + v.op[7].value + v.Otype.value);
      }
      case ".fill": {
        return new vscode.Hover(".fill isnt an opcode...it just puts whatevers to the right into the machine code");
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
