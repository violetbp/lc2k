import * as vscode from 'vscode';
import {TextDecoder} from 'util';

export class Lc2kFormatter implements vscode.DocumentRangeFormattingEditProvider, vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
                                 token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
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
    const fillOffset = +config.get('format.filloffset');
    const jalrOffset = +config.get('format.jalroffset');
    const noopOffset = +config.get('format.noopoffset');
    const addNewLine = config.get('format.addNewlineAtEOF');
    // console.log("jalr offset: " + jalrOffset);
    // console.log("jalr offset: " + fillOffset);

    var edits = [];
    var regex;
    var newText;
    var offset;
    for (let i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let text = line.text;
      var OpcodeRegex = /(?:[^\s]*\s+)(add|nor|nand|lw|sw|beq|jalr|noop|halt|\.fill)(?:.*)/g;

      let opcode = text.replace(OpcodeRegex, "$1");
      // console.log("opcode: " + opcode);

      switch (opcode) {
        case "add":
        case "nor":
        case "lw":
        case "sw":
        case "beq":
          regex = /^([^\s]*)\s+(add|nor|nand|lw|sw|beq)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)?/g;
          newText = text.replace(regex, "$1\t$2\t$3\t$4\t$5\t$6");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;

        case "jalr":
          regex = /^([^\s]*)\s+(jalr)\s+([^\s]+)\s+([^\s]+)\s+(.*)?/g;
          offset = ((jalrOffset !== 1) ? "\t".repeat(jalrOffset) : "");
          newText = text.replace(regex, "$1\t$2\t$3\t$4\t" + offset + "$5");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;

        case ".fill":
          regex = /^([^\s]*)\s+(\.fill)\s+([^\s]+)\s+(.*)?/g;
          offset = ((fillOffset !== 1) ? "\t".repeat(fillOffset) : "");
          newText = text.replace(regex, "$1\t$2\t$3\t" + offset + "$4");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;

        case "halt":
        case "noop":
          regex = /^([^\s]*)\s+(halt|noop)\s+(.*)?/g;
          offset = ((noopOffset !== 1) ? "\t".repeat(noopOffset) : "");
          newText = text.replace(regex, "$1\t$2\t" + offset + "$3");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;

        default: { break; }
      }
    }

    // last line not empty or whitespace and feature enabled //
    const lastLine = document.lineAt(document.lineCount - 1);
    if (!lastLine.isEmptyOrWhitespace && addNewLine) {
      return [vscode.TextEdit.insert(lastLine.range.end, '\n')];
    }
    return edits;
  }
}