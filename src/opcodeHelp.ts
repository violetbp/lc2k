import * as vscode from 'vscode';


export var Rtype = new vscode.MarkdownString();
export let Itype = new vscode.MarkdownString();
export let Jtype = new vscode.MarkdownString();
export let Otype = new vscode.MarkdownString();

export var op: vscode.MarkdownString[] = [
  new vscode.MarkdownString(),
  new vscode.MarkdownString(),
  new vscode.MarkdownString(),
  new vscode.MarkdownString(),
  new vscode.MarkdownString(),
  new vscode.MarkdownString(),
  new vscode.MarkdownString(),
  new vscode.MarkdownString()
];

Rtype.appendCodeblock("R-type instructions (add, nor):\n\
  bits 24-22: opcode\n\
  bits 21-19: reg A\n\
  bits 18-16: reg B\n\
  bits 15-3:  unused (should all be 0)\n\
  bits 2-0:   destReg");

Itype.appendCodeblock("I-type instructions (lw, sw, beq):\n\
  bits 24-22: opcode\n\
  bits 21-19: reg A  \n\
  bits 18-16: reg B  \n\
  bits 15-0:  offsetField (a 16-bit, 2's complement number with a range of -32768 to 32767)");

Jtype.appendCodeblock("J-type instructions (jalr):\n\
  bits 24-22: opcode\n\
  bits 21-19: reg A\n\
  bits 18-16: reg B\n\
  bits 15-0:  unused (should all be 0)");

Otype.appendCodeblock("O-type instructions (halt, noop):\n\
  bits 24-22: opcode\n\
  bits 21-0:  unused (should all be 0)");


op[0].appendText("Add contents of regA withcontents of regB, store results in destReg.\n\n");
op[1].appendText("Nor contents of regA with contents of regB, store results in destReg.  \
		This is a bitwise nor; each bit is treated independently.\n\n");
op[2].appendText("Load regB from memory. Memory address is formed by adding offsetField with the contents of regA.");
op[3].appendText("Store regB into memory. Memory address is formed by adding offsetField with the contents of regA.");
op[4].appendText("If the contents of regA and regB are the same, then branch to the address PC+1+offsetField, \
		where PC is the address of this beq instruction.");
op[5].appendText("First store PC+1 into regB, where PC is the address of this jalr instruction. \
Then branch to the address contained in regA. Note that this implies if regA and \
regB refer to the same register, the net effect will be jumping to PC+1.\n\n\
Call function = jalr 4 7  \nReturn = jalr 7 4");
op[6].appendText("Increment the PC (as with all instructions), then halt the machine (let the simulator notice that the \
	machine	halted).");
op[7].appendText("Do nothing.");