// Desktop wrapper: opens the game in its own window. F11 toggles fullscreen.
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#12161f',
    autoHideMenuBar: true,
    title: 'UAE Driving',
    webPreferences: { contextIsolation: true },
  });
  win.removeMenu();
  win.maximize();
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
