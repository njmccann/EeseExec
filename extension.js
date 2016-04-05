// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var child_process = require('child_process');
var exec = child_process.execFile;
var spawn = child_process.spawn;

var outputChannel = null;
var bat = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "EeseExec" is now active!');

    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('EeseExec');
    }

    if (!bat) {
        bat = spawn('cmd.exe');
        bat.stdout.on('data', (data) => {
            outputChannel.appendLine(data);
        });

        bat.stderr.on('data', (data) => {
            outputChannel.appendLine(data);
        });
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.execSelected', function() {
        
        try {
            var editor = vscode.window.activeTextEditor;
            var selection = editor.selection;
            var text = editor.document.getText(selection);

            if (text.length === 0) {
                vscode.window.showInputBox('')
                .then((data) => {
                    bat.stdin.write(data + '\r\n');
                });
            } else {
                text = text.replace(/\r?\n|\r/g, ' ');

                bat.stdin.write(text + '\r\n');
            }
        } catch (ex) {
            outputChannel.appendLine('Unable to exec');
            console.log(ex);
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    bat.kill();
}
exports.deactivate = deactivate;