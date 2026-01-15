// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("dhristi.openVisualizer", () => {
      const panel = vscode.window.createWebviewPanel(
        "dhristiVisualizer",
        "Dhristi – Python Visualizer",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getHtml();
    })
  );
}

function getHtml() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: sans-serif;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Dhristi is alive</h1>
        <p>Your VS Code extension UI is working.</p>
      </body>
    </html>
  `;
}


// This method is called when your extension is deactivated
export function deactivate() {}
