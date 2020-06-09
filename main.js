const { app, BrowserWindow } = require('electron')
const path = require('path')
function createWindow () {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // win.webContents.openDevTools()

  // 加载index.html文件
  // win.loadURL(`file://${path.join(__dirname, './build/index.html')}`);
  win.loadURL(`http://localhost:3000/`)
}

app.whenReady().then(createWindow)