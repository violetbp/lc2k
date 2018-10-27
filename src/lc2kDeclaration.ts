import * as vscode from 'vscode';
import { MarkdownString } from 'vscode';

export interface Lc2kDefinitionInformation {
  file: string;
  line: number;
  column: number;
  doc: string;
  declarationlines: string[];
  name: string;
  toolUsed: string;
}

interface Lc2kOpcode {
  name: string;
  opcode: string;
  type: vscode.MarkdownString;
  spec: vscode.MarkdownString;
}

function hoverString(op: Lc2kOpcode): MarkdownString {
  return new MarkdownString(`\`${op.name}\`: opcode \`${op.opcode}\`\n\n`)
    .appendMarkdown(op.spec.value)
    .appendMarkdown(op.type.value);
}

export const RType = new MarkdownString().appendCodeblock(`R-type instructions (add, nor):
  bits 24-22: opcode
  bits 21-19: reg A
  bits 18-16: reg B
  bits 15-3:  unused (should all be 0)
  bits 2-0:   destReg`);
export const IType = new MarkdownString().appendCodeblock(`I-type instructions (lw, sw, beq):
  bits 24-22: opcode
  bits 21-19: reg A
  bits 18-16: reg B
  bits 15-0:  offsetField (a 16-bit, 2's complement number with a range of -32768 to 32767)`);
export const JType = new MarkdownString().appendCodeblock(`J-type instructions (jalr):
  bits 24-22: opcode
  bits 21-19: reg A
  bits 18-16: reg B
  bits 15-0:  unused (should all be 0)`);
export const OType = new MarkdownString().appendCodeblock(`O-type instructions (halt, noop):
  bits 24-22: opcode
  bits 21-0:  unused (should all be 0)`);

const OPCODES: { [name: string]: Lc2kOpcode } = {
  "add": {
    name: "add",
    opcode: "000",
    type: RType,
    spec: new MarkdownString("Add contents of regA withcontents of regB, store results in destReg."),
  },
  "nor": {
    name: "nor",
    opcode: "001",
    type: RType,
    spec: new MarkdownString(`Nor contents of regA with contents of regB, store results in destReg.
This is a bitwise nor; each bit is treated independently.`),
  },
  "lw": {
    name: "lw",
    opcode: "010",
    type: IType,
    spec: new MarkdownString("Load regB from memory. Memory address is formed by adding offsetField with the contents of regA."),
  },
  "sw": {
    name: "sw",
    opcode: "011",
    type: IType,
    spec: new MarkdownString("Store regB into memory. Memory address is formed by adding offsetField with the contents of regA."),
  },
  "beq": {
    name: "beq",
    opcode: "100",
    type: IType,
    spec: new MarkdownString(`If the contents of regA and regB are the same,
  then branch to the address PC + 1 + offsetField,
    where PC is the address of this beq instruction.`),
  },
  "jalr": {
    name: "jalr",
    opcode: "101",
    type: JType,
    spec: new MarkdownString(`First store PC + 1 into regB, where PC is the address of this jalr instruction.
Then branch to the address contained in regA.Note that this implies if regA and
regB refer to the same register, the net effect will be jumping to PC + 1.

Call function = jalr 4 7  \nReturn = jalr 7 4`),
  },
  "halt": {
    name: "halt",
    opcode: "110",
    type: OType,
    spec: new MarkdownString(`Increment the PC(as with all instructions), then halt the machine(let the simulator notice that the
	machine	halted).`)
  },
  "noop": {
    name: "noop",
    opcode: "111",
    type: OType,
    spec: new MarkdownString("Do nothing."),
  },
};

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
