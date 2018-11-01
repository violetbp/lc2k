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
    const fillOffset = config.get('format.filloffset');
    const jalrOffset = config.get('format.jalroffset');
    const addNewLine = config.get('format.addNewlineAtEOF');

    const line = document.lineAt(1);



    /*const lastLine1 = document.lineAt(document.lineCount - 1);
    let test = [
      // vscode.TextEdit.setEndOfLine(vscode.EndOfLine.LF),
      vscode.TextEdit.insert(line.range.end, '\n'),
      // vscode.TextEdit.insert(lastLine1.range.end, '\n'),
      vscode.TextEdit.insert(lastLine1.range.end, '\n'),
      vscode.TextEdit.insert(lastLine1.range.start, "HELLO")
      vscode.TextEdit.
    ];
    return test;*/
    var edits = [];

    for (let i = 0; i < document.lineCount; i++) {
      // console.log(i);

      let line = document.lineAt(i);
      let text = line.text;


      var OpcodeRegex = /^(?:[^\\s]*)\\s+(noop|halt)/g;
      // var OpcodeRegex = /^(?:[^\\s]*)\\s+(noop|halt)/g;

      let matches = text.match(OpcodeRegex);
      // console.log(text + ":");

      if (!matches || matches.length === 0) {
        continue;
      }

      matches.forEach(element => { console.log("  " + element); });



      let opcode = matches[0];

      if (opcode === "add") {
      }



      // var regex = /^(\w+)\s+(\w+)/g;
      // console.log(text.search(regex));
      // text.replace(regex, "$1\t$2");
      var regex = /\s+/g;
      // console.log(text.search(regex));
      // text = text.replace("halt", "a");

      text = text.replace(regex, "\t");


      // text = "hello!";
      edits.push(vscode.TextEdit.replace(line.range, text));

      // if (line.text.match("add|nor|lw|sw|beq|jalr|halt|noop|.fill")[0] === ".fill") {
      // add offset
      // fillOffset
      // }
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