var vscode = require('vscode');
var child_process = require('child_process');
var spawn = child_process.spawn;
var path = require('path');

var outputChannel = null;
var bat = null;

function activate(context) {

    console.log('"EeseExec" is now active!');

    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('EeseExec');
    }

    if (!bat) {
        bat = spawn('cmd.exe', { cwd : __dirname });
        
        bat.stdout.on('data', (data) => {
            outputChannel.appendLine(data);
        });

        bat.stderr.on('data', (data) => {
            outputChannel.appendLine(data);
        });
    }

    var disposable = vscode.commands.registerCommand('extension.execSelected', function() {
        
        try {
            var editor = vscode.window.activeTextEditor;
            var selection = editor.selection;
            var text = editor.document.getText(selection);

            if (text === undefined || text.length === 0) {
                vscode.window.showInputBox('')
                .then((data) => {
                    
                    if(data === undefined || data.length === 0) return;
                    
                    bat.stdin.write(data + '\r\n');
                });
            } else {

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

function deactivate() {
    bat.kill();
}
exports.deactivate = deactivate;