import * as vscode from 'vscode';
import { OPCODES, hoverString } from './lc2kOpcodes';

export class Lc2kHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position,
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        let range = document.getWordRangeAtPosition(position);
        let symbol = document.getText(range);
        if (symbol === ".fill") {
            return new vscode.Hover("`.fill` isnt an opcode. It just puts whatever's to the right into the machine code.");
        } else if (OPCODES.hasOwnProperty(symbol)) {
            return new vscode.Hover(hoverString(OPCODES[symbol]));
        }
    }
}
