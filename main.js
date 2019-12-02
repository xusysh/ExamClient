const {app, BrowserWindow} = require('electron')
    const url = require("url");
    const path = require("path");

    let mainWindow
    const Menu = electron.Menu
    
    function createWindow () {
      // 隐藏菜单栏
      Menu.setApplicationMenu(null)
      mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
          nodeIntegration: true
        }
      })

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/static/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
    //  mainWindow.webContents.openDevTools({mode:'detach'})

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