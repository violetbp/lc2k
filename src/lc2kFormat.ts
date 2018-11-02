import * as vscode from 'vscode';
import {TextDecoder} from 'util';

export class Lc2kFormatter implements vscode.DocumentRangeFormattingEditProvider, vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
                                 token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    console.log("Formatting");
    const config = vscode.workspace.getConfiguration('lc2k');
    const enable = config.get('format.enable');
    if (!enable) {
      return [];
    }
    const fillOffset = +config.get('format.filloffset');
    const jalrOffset = +config.get('format.jalroffset');
    const addNewLine = config.get('format.addNewlineAtEOF');


    var edits = [];
    var regex;
    for (let i = 0; i < document.lineCount; i++) {
      // console.log(i);

      let line = document.lineAt(i);
      let text = line.text;



      var OpcodeRegex = /(?:[^\s]*\s+)(add|nor|nand|lw|sw|beq|jalr|noop|halt|\.fill)(?:.*)/g;

      let opcode = text.replace(OpcodeRegex, "$1");
      console.log("opcode: " + opcode);



      // var regex = /\s+/g;
      // console.log(text.search(regex));
      // text = text.replace("halt", "a");

      // text = text.replace(regex, "\t");
      var newText;
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
          newText = text.replace(regex, "$1\t$2\t$3\t$4\t$5");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;

        case ".fill":
          regex = /^([^\s]*)\s+(\.fill)\s+([^\s]+)\s+(.*)?/g;
          newText = text.replace(regex, "$1\t$2\t$3\t" + "\t".repeat(fillOffset) + "$4");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;

        case "halt":
        case "noop":
          regex = /^([^\s]*)\s+(halt|noop)\s+(.*)?/g;
          newText = text.replace(regex, "$1\t$2\t" + "\t".repeat(jalrOffset) + "$3");
          edits.push(vscode.TextEdit.replace(line.range, newText));
          break;


        default: { break; }
      }


      edits.push(vscode.TextEdit.replace(line.range, text));
    }

    // for (let i = 0; i < document.lineCount; i++) {
    //   console.log(edits[i].newtext);
    // }
    return edits;

    console.log(addNewLine);
    // last line not empty or whitespace and feature enabled //
    const lastLine = document.lineAt(document.lineCount - 1);
    if (!lastLine.isEmptyOrWhitespace && addNewLine) {
      console.log('editing');
      return [vscode.TextEdit.insert(lastLine.range.end, '\n')];
    }



    // let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    // return this.provideDocumentRangeFormattingEdits(document, fullRange, options, token);
    /*
     * So,
     * for each line
     * find opcode to know how far to go
     * replace whitespace with tabs
     * OPTION TO [set whitespace at the end of shorter lines]
     * option to increase amout for .fill
     * option to turn of entirely should be built in
    */
  }
  provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions,
                                      token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    return [];
  }
}