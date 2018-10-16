//import vscode = require('vscode');
//import Hover = require('hover');
import * as vscode from 'vscode';
import { ProviderResult } from 'vscode';
import { Definition } from 'vscode';
import { DefinitionLink } from 'vscode';
import { HoverProvider } from 'vscode';
import { Hover } from 'vscode';



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
    public provideDefinition(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): //ProviderResult<Definition | DefinitionLink[]>{
        Thenable<vscode.Location> {
			
			return new Promise<vscode.Location>((resolve, reject) => {
				let range = document.getWordRangeAtPosition(position);
				let symbol = document.getText(range);
				console.log(symbol);
				if(symbol === "add"){
					console.log("ayay");

					let pos = new vscode.Position(position.line, 5);
					
					resolve(new vscode.Location(document.uri, pos));
					  
				}
				
			  });
			
			
			//let definitionResource = vscode.Uri.file(document.fileName);
			
            //return new vscode.Location(definitionResource, pos);
            
        
    }
}
