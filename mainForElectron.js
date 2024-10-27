//Used ChatGPT
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false // This disables web security
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'indexForElectron.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.loadFile('indexForElectron.html')
}

app.whenReady().then(() => {
    createWindow()
})



