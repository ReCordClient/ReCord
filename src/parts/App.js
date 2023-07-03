const { BrowserWindow } = require('electron');

exports.App = class App {
    constructor() {
        return this;
    }
    Run = (code) => {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;
        
        win.webContents.executeJavaScript(`
            (function() {
                try {
                    ${typeof code === "function" ? '(' + code.toString() + ')();' : code}
                } catch (e) {
                    console.error(e);
                }
            })();
        `);
    };
}