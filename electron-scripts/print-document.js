const { Menu, BrowserWindow } = require("electron");
var genericPrintWindow;

module.exports = function (ev, args) {
	const mainWindow = BrowserWindow.fromWebContents(ev.sender);
	try {
		const { data, url } = args;
		if (genericPrintWindow) genericPrintWindow.close();
		var title = args.title || "Impresion";
		genericPrintWindow = new BrowserWindow({
			useContentSize: true,
			show: false,
			parent: mainWindow,
			modal: true,
			title,
			width: 1024,
			webPreferences: {
				contextIsolation: false,
				nodeIntegration: true,
				nodeIntegrationInWorker: true,
				enableRemoteModule: true,
				plugins: false
			},
		});
		const template = [{
			label: "Imprimir",
			click: () => genericPrintWindow.webContents.print({ silent: false, printBackground: false })
		}, {
			label: "Exportar a PDF",
			click: () => genericPrintWindow.webContents.printToPDF({ silent: false }, (error, data) => {
				if (error) throw error
				const pdf = data.toString('base64');
				const pdfWindow = new BrowserWindow({
					width: 1024,
					webPreferences: {
						contextIsolation: false,
						nodeIntegration: true,
						nodeIntegrationInWorker: true,
						enableRemoteModule: true,
						plugins: false
					},
					modal: true,
					parent: genericPrintWindow,
					show: true
				});
				pdfWindow.loadURL('data:application/pdf;base64,' + pdf);
			})
		}];
		genericPrintWindow.setMenu(Menu.buildFromTemplate(template));
		// and load the index.html of the app.
		//    var path = app.getPath("userData");
		genericPrintWindow.loadURL(url);
		genericPrintWindow.on("closed", () => genericPrintWindow = null);
		genericPrintWindow.once("ready-to-show", () => {
			genericPrintWindow.show();
		});
		genericPrintWindow.webContents.on("will-navigate", event => {
			event.preventDefault();
			genericPrintWindow.webContents.send("data", data);
		});
	} catch (e) {
		console.dir(e);
		mainWindow.webContents.send("print:error", e.message || e);
	}
	return genericPrintWindow;
}