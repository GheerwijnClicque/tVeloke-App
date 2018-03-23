import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import { Board, Sensor } from 'johnny-five';
import * as url from 'url';
import { setInterval } from 'timers';
const now = require('performance-now');
const board = new Board({debug: true, repl: false, port: 'COM6'});
const values = [];
const amount = 10;
const freq = 250;
import { ReplaySubject } from 'rxjs';


 // const board = new Board({debug: true, repl: false});
 board.on('ready', () => {
  const sensor = new Sensor({
    pin: 7,
    type: 'digital',
    freq: freq,
    enabled: true
  } as any);

  let rpmUpdates = new ReplaySubject(1);
  let test;

  rpmUpdates.subscribe((value: number) => {
    if (test) {
      test.send('SendRpm',  value);
    }
  })


  sensor.on('change', () => {
    values.push(sensor.value);
    if (values.length > amount) {
      values.splice(0, 1);


      let prevValue = values[0];
      let sum = 1;
      let result = [];
      for (let i = 1; i < values.length; i++) {
        if (values[i] !== prevValue) {
          result.push(sum);
          sum = 1;
          prevValue = values[i];
        } else {
          sum++;
        }
      }
      let averageFreq = result.reduce((a, b) => {
        return a + b;
      }, 0) / result.length * freq * 2 / 1000;

      let rpm = 1 / averageFreq * 60;

      rpmUpdates.next(rpm);
    }
  })

  ipcMain.on('RequestRpm', (event, arg) => {
    test = event.sender;
  });

});


board.on('error', () => {
  console.log('error');
});

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');


if (serve) {
  require('electron-reload')(__dirname, {});
}



function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '/index.html'),
    slashes:  true
  }));

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
