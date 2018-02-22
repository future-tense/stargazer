/* global require, process */

(function () {
	'use strict';

	const electron	= require('electron');
	const path		= require('path');
	const url		= require('url');

	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	let win;

	const app = electron.app;
	app.on('ready', createWindow);
	app.on('window-all-closed', close);
	app.on('activate', activate);

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	function createWindow() {

		const template = [{
				label: 'Application',
				submenu: [
					{role: 'about'},
					{type: 'separator'},
					{role: 'quit'}
				]
			}, {
				label: 'Edit',
				submenu: [
					{role: 'undo'},
					{role: 'redo'},
					{type: 'separator'},
					{role: 'cut'},
					{role: 'copy'},
					{role: 'paste'}
				]
			}, {
				label: 'View',
				submenu: [
					{role: 'toggledevtools'}
				]
			}
		];

		// No menu on Windows
		const Menu = electron.Menu;
		if (process.platform !== 'win32') {
			Menu.setApplicationMenu(Menu.buildFromTemplate(template));
		}

		// Create the browser window.
		const BrowserWindow = electron.BrowserWindow;
		win = new BrowserWindow({
			width: 800,
			height: 600
		});

		// and load the index.html of the app.
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'app/index.html'),
			protocol: 'file:',
			slashes: true
		}));

		// Open the DevTools.
//		win.webContents.openDevTools();

		// Emitted when the window is closed.
		win.on('closed', () => {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			win = null;
		});
	}

	// Quit when all windows are closed.
	function close() {
		// On macOS it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	}

	function activate() {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win === null) {
			createWindow();
		}
	}
})();
