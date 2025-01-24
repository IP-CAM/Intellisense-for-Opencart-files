import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface OpenCartPaths {
    admin: string;
    catalog: string;
    system: string;
}

export function activate(context: vscode.ExtensionContext) {
    const definitionProvider = vscode.languages.registerDefinitionProvider('php', {
        provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.Definition | undefined {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }

            const line = document.lineAt(position.line).text;
            const modelMatch = line.match(/\$this->model_(\w+)_(\w+)->(\w+)/);
            
            if (!modelMatch) {
                return undefined;
            }

            const [_, folder, name, functionName] = modelMatch;
            const modelPath = findModelFile(folder, name, document.uri);
            
            if (modelPath) {
                // Read model file content
                const fileContent = fs.readFileSync(modelPath, 'utf-8');
                const lines = fileContent.split('\n');
                
                // Find the line with function declaration
                const functionLineIndex = lines.findIndex(line => 
                    line.includes(`function ${functionName}`) || 
                    line.includes(`function &${functionName}`)
                );
                
                if (functionLineIndex !== -1) {
                    const functionLine = lines[functionLineIndex];
                    const characterPosition = functionLine.indexOf(`${functionName}`);
                    
                    return new vscode.Location(
                        vscode.Uri.file(modelPath),
                        new vscode.Position(functionLineIndex, characterPosition)
                    );
                }

                // Fallback to file start if function not found
                return new vscode.Location(
                    vscode.Uri.file(modelPath),
                    new vscode.Position(0, 0)
                );
            }

            return undefined;
        }
    });

    context.subscriptions.push(definitionProvider);

    const hoverProvider = vscode.languages.registerHoverProvider('php', {
        provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }

            const line = document.lineAt(position.line).text;
            const modelMatch = line.match(/\$this->model_(\w+)_(\w+)->(\w+)/);
            
            if (!modelMatch) {
                return undefined;
            }

            const [_, folder, name, functionName] = modelMatch;
            const modelPath = findModelFile(folder, name, document.uri);
            
            if (modelPath) {
                try {
                    const fileContent = fs.readFileSync(modelPath, 'utf-8');
                    const lines = fileContent.split('\n');
                    
                    // Find the function declaration
                    const functionLineIndex = lines.findIndex(line => 
                        line.includes(`function ${functionName}`) || 
                        line.includes(`function &${functionName}`)
                    );
                    
                    if (functionLineIndex !== -1) {
                        const className = name.charAt(0).toUpperCase() + name.slice(1);
                        const fullClassName = `Model${folder.charAt(0).toUpperCase()}${folder.slice(1)}${className}`;
                        
                        const functionDeclaration = lines[functionLineIndex].trim();
                        
                        let docLines = [];
                        let params = [];
                        let returnType = '';
                        let i = functionLineIndex - 1;
                        
                        while (i >= 0 && (lines[i].trim().startsWith('*') || lines[i].trim().startsWith('/'))) {
                            const line = lines[i].trim();
                            if (line.includes('@param')) {
                                params.unshift(line.replace('* @param', '').trim());
                            } else if (line.includes('@return')) {
                                returnType = line.replace('* @return', '').trim();
                            }
                            i--;
                        }

                        const markdownContent = new vscode.MarkdownString();
                        markdownContent.supportHtml = true;
                        markdownContent.supportThemeIcons = true;
                        
                        markdownContent.appendMarkdown(`## ${fullClassName}::${functionName}\n\n`);
                        
                        if (params.length > 0) {
                            markdownContent.appendMarkdown('### Parameters\n');
                            markdownContent.appendMarkdown('| Type | Name |\n|------|------|\n');
                            params.forEach(param => {
                                const [type, name] = param.split(' ');
                                markdownContent.appendMarkdown(`| \`${type}\` | \`${name}\` |\n`);
                            });
                            markdownContent.appendMarkdown('\n');
                        }
                        
                        if (returnType) {
                            markdownContent.appendMarkdown(`### Returns\n\`${returnType}\`\n\n`);
                        }
                        
                        markdownContent.appendCodeblock(functionDeclaration, 'php');
                        
                        return new vscode.Hover(markdownContent);
                    }
                } catch (error) {
                    console.error('Error reading model file:', error);
                }
            }

            return undefined;
        }
    });

    context.subscriptions.push(hoverProvider);
}

function findModelFile(folder: string, name: string, currentFileUri: vscode.Uri): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return undefined;
    }

    const config = vscode.workspace.getConfiguration('opencartIntellisense');
    const paths: OpenCartPaths = config.get('paths') || {
        admin: 'admin',
        catalog: 'catalog',
        system: 'system'
    };

    // Determine if we're in admin or catalog based on the current file path
    const currentFilePath = currentFileUri.fsPath;
    const isAdmin = currentFilePath.includes(paths.admin);
    const basePath = isAdmin ? paths.admin : paths.catalog;

    const rootPath = workspaceFolders[0].uri.fsPath;
    const possiblePaths = [
        // Try in current context (admin/catalog)
        path.join(rootPath, basePath, 'model', folder, `${name}.php`),
        // Try in system, will use for library
        // path.join(rootPath, paths.system, 'model', folder, `${name}.php`),
        // Try in opposite context
        path.join(rootPath, isAdmin ? paths.catalog : paths.admin, 'model', folder, `${name}.php`),
        // Try in base path
        path.join(rootPath, 'model', folder, `${name}.php`),
    ];

    for (const modelPath of possiblePaths) {
        if (fs.existsSync(modelPath)) {
            return modelPath;
        }
    }

    return undefined;
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
