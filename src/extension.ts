import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const definitionProvider = vscode.languages.registerDefinitionProvider('php', {
        provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.Definition | undefined {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }

            const line = document.lineAt(position.line).text;
            const modelMatch = line.match(/\$this->model_(\w+)_(\w+)/);
            
            if (!modelMatch) {
                return undefined;
            }

            const [_, folder, name] = modelMatch;
            const modelPath = findModelFile(folder, name);
            
            if (modelPath) {
                return new vscode.Location(
                    vscode.Uri.file(modelPath),
                    new vscode.Position(0, 0)
                );
            }

            return undefined;
        }
    });

    context.subscriptions.push(definitionProvider);
}

function findModelFile(folder: string, name: string): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return undefined;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const modelPath = path.join(rootPath, 'model', folder, `${capitalizeFirst(name)}.php`);

    if (fs.existsSync(modelPath)) {
        return modelPath;
    }

    return undefined;
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
