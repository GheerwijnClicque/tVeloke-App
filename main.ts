import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import { HardwareConnector } from './hardware-worker';

var now = require("performance-now");

var five = require("johnny-five");
var board = new five.Board();
var sensor;

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
import * as url from 'url';
import { setInterval } from 'timers';

if (serve) {
  require('electron-reload')(__dirname, {
  });
}




/* board.on('ready', () => {
  console.log('ready');
  var led = five.Led(13);
  led.blink(1000);
}); */
function getAvgRPM(win) {
  var connected = false;
  
  const sampleTime = 500; // ms
  const radius = 1; // m
  const w = 0.10472;

  var rpmMax = 0;
  var rpm = 0;
  var currentTime = 0;
  var startTime = now();
  var count = 0;

  sensor.on('change', function() {
      if (currentTime <= sampleTime) {
          if (this.value) {
              count++;
              rpm = (count/currentTime) * 60000;
              if (rpm > rpmMax) rpmMax = rpm;
          }
      }
      else {
          currentTime = 0;
          startTime = now();
          count = 0;
      }
      currentTime = now() - startTime;     
      var speed = radius * rpm * w;
      var kmh = (5 * speed) / 18;
      console.log('speed: ' + kmh + ' km/h');      
      win.webContents.send('update' , {msg: kmh});  
  });
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

  //const board = new Board({debug: true, repl: false});
  board.on('ready', () => {
    console.log('ready');
    sensor = new five.Sensor({
      pin: 7, 
      type: "digital"
    });
    getAvgRPM(win);
  });

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
