const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false
/*    webPreferences: {
      nodeIntegration: true
    } */
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/static/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode:'detach'})

  mainWindow.setFullScreen(true)


  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})