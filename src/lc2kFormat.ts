import * as vscode from 'vscode';

export class Lc2kFormatter implements vscode.DocumentRangeFormattingEditProvider, vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
                                 token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    // call it on the entire range
    let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    return this.provideDocumentRangeFormattingEdits(document, fullRange, options, token);
  }


  provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions,
                                      token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    // console.log("Formatting");
    const config = vscode.workspace.getConfiguration('lc2k');
    const enable = config.get('format.enable');
    if (!enable) {
      return [];
    }

    const fillOffset = config.get('format.fillOffset');
    const jTypeOffset = config.get('format.jTypeOffset');
    const oTypeOffset = config.get('format.oTypeOffset');
    const irTypeOffset = config.get('format.irTypeOffset');
    // const addNewLine = config.get('format.addNewlineAtEOF');

    // console.log({irTypeOffset, oTypeOffset, jTypeOffset, fillOffset});

    let edits = [];


    for (let i = range.start.line; i < range.end.line; i++) {
      let line = document.lineAt(i);
      let text = line.text;
      let OpcodeRegex = /(?:[^\s]*\s+)(add|nor|nand|lw|sw|beq|jalr|noop|halt|\.fill)(?:.*)/g;

      let opcode = text.replace(OpcodeRegex, "$1");
      // console.log("opcode: " + opcode);
      // TODO add option to indent automatically on detecting opcode (with number after) at beginning of line
      // TODO add option for spaces to seperate registers
      switch (opcode) {
        case "add":
        case "nor":
        case "lw":
        case "sw":
        case "beq": {
          let regex = /^([^\s]*)\s+(add|nor|nand|lw|sw|beq)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)(\s+)?(.*)?/g;
          let offset = (irTypeOffset !== null ? "\t".repeat(+irTypeOffset + 1) : "$6");
          let newText = text.replace(regex, "$1\t$2\t$3\t$4\t$5" + offset + "$7").trimRight();
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;
        }

        case "jalr": {
          let regex = /^([^\s]*)\s+(jalr)\s+([^\s]+)\s+([^\s]+)(\s+)?(.*)?/g;
          let offset = (jTypeOffset !== null ? "\t".repeat(+jTypeOffset + 1) : "$5");
          let newText = text.replace(regex, "$1\t$2\t$3\t$4" + offset + "$6").trimRight();
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;
        }

        case ".fill": {
          let regex = /^([^\s]*)\s+(\.fill)\s+([^\s]+)(\s+)?(.*)?/g;
          let offset = (fillOffset !== null ? "\t".repeat(+fillOffset + 1) : "$4");
          let newText = text.replace(regex, "$1\t$2\t$3" + offset + "$5").trimRight();
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;
        }

        case "halt":
        case "noop": {
          let regex = /^([^\s]*)\s+(halt|noop)(\s+)?(.*)?/g;
          let offset = (oTypeOffset !== null ? "\t".repeat(+oTypeOffset + 1) : "$3");
          let newText = text.replace(regex, "$1\t$2" + offset + "$4").trimRight();
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;
        }

        default: { break; }
      }
    }

    // last line not empty or whitespace and feature enabled //
    // const lastLine = document.lineAt(document.lineCount - 1);
    // if (!lastLine.isEmptyOrWhitespace && addNewLine) {
    //   return [vscode.TextEdit.insert(lastLine.range.end, '\n')];
    // }
    return edits;
  }
}