// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const printer = require('printer');
const { remote, ipcRenderer, shell } = require('electron');

const path = remote.app.getPath("userData"),
	mainWindow = remote.getCurrentWindow(),
	char_paper_cut = String.fromCharCode(27) + String.fromCharCode(105),
	fs = require("fs");

const WinPrinter = {
	_currentError: function (msg) { console.log(msg); },
	_currentOk: function (msg) { console.log(msg); },
	printText: function (callback, error, data, optionalImpresora) {
		var _printerName = (optionalImpresora ? optionalImpresora : this.selectedPrinter);
		if (!_printerName) {
			error('No ha seleccionado ninguna impresora o no hay ninguna predeterminada en el sistema.')
		} else {
			printer.printDirect({
				data: data + char_paper_cut // or simple String: "some text"
				, printer: _printerName // printer name, if missing then will print to default printer
				, type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
				, docname: "Impresion de RunFood"
				, success: function (jobID) {
					console.log("sent to printer with ID: " + jobID);
					callback("Listo");
				}
				, error: function (err) { console.log(err); error(err) }
			});
		}
	},

	connect: function (callback, err, _printerName) {
		this.selectedPrinter = _printerName;
		callback();
	},
	list: function (cb, error) {
		try {
			var listado = printer.getPrinters(),
				ret = [];
			for (var i = 0; i < listado.length; i++) {
				var element = listado[i];
				ret.push(element.name);
			}
			cb(ret);
		} catch (e) {
			error(e.message)
		}
	},
	selectedPrinter: null,
	html: function (dataReport, preview, id, cb, er) {
		try {
			WinPrinter._currentError = er;
			WinPrinter._currentOk = cb;
			ipcRenderer.send("print-to-pdf", {
				html_file: `${path}\\${id}.formato_impresion.html`,
				data: JSON.parse(JSON.stringify(dataReport)),
				preview: preview,
				//impresora: _printerName || ""
				impresora: "" // actualmente esto solo funciona con impresoras predeterminadas
			});
		} catch (e) {
			er(e.message || e);
		}
	},
	save: function (file, id, callback, error) {
		try {
			var reader = new FileReader();
			reader.onload = function () {
				fs.writeFileSync(`${path}\\${id}.formato_impresion.html`, reader.result, "utf8");
				callback();
			}
			reader.readAsText(file);
		} catch (e) {
			error(e.message);
		}
	}
};

ipcRenderer.on("print-window:error", function (ev, msg) {
	if (WinPrinter._currentError) WinPrinter._currentError(msg);
});
ipcRenderer.on("print-window:ok", function () {
	if (WinPrinter._currentOk) WinPrinter._currentOk();
})
function E_OpenDevTools() {
	require('electron').remote.getCurrentWindow().webContents.openDevTools();
}

document.addEventListener('keyup', e => {
	var isFullScreen = mainWindow.isFullScreen();
	if (e.key == 'F11' && e.ctrlKey)
		return mainWindow.setFullScreen(!isFullScreen);

	if (e.key === "I" && e.ctrlKey && e.shiftKey)
		return E_OpenDevTools();
});
//mainWindow.setFullScreen(true)
mainWindow.maximize();

function isDev() {
	return process.mainModule.filename.indexOf('app.asar') === -1;
}

window.WinPrinter = WinPrinter;

window.sayHi = function (dataTXT) {
	alert(dataTXT);
}

window.serialDisplay = {
	init: (port_number, display_type) => {
		if (!display_type) display_type = "VFD:20x2";
		ipcRenderer.send("serial-display:init", port_number, display_type);
		console.log(`DisplaySerial: \r\tPORT=${port_number}\r\tTYPE=${display_type}`);
	},
	sendGOLE: (line1, line2) => {
		ipcRenderer.send("serial-display:sendGOLE", line1, line2);
		console.log("DisplaySerial enviando", line1, line2);
	}
}

window.htmlPrint = function (url, data) {
	ipcRenderer.send("print", { url, data });
}
window.electronJS_download = async function (default_name, filters, content) {
	try {
		if (window.localStorage.__downloadBox === "Dialogs") {
			var filename_wo_path = await Dialogs.Prompt({
				title: "Escribe el nombre del archivo",
				defaultValue: default_name || "",
				confirmButtonText: "Guardar"
			});
			if (filename_wo_path) {
				if (!require("path").extname(filename_wo_path)) filename_wo_path += (default_name?.split(".").pop() || "");
				var filename = require("path").join(
					remote.app.getPath('downloads'), filename_wo_path);
			}
		} else {
			// Show a file explorer dialog to choose the download location
			filename = await remote.dialog.showSaveDialogSync(mainWindow, {
				filters,
				defaultPath: require("path").join(remote.app.getPath('downloads'), default_name || "")
			});
		}
		if (!filename) return;
		// Write content to the chosen file location
		fs.writeFileSync(filename, content);
		if (process.platform === 'win32') {
			require("child_process").spawn('explorer.exe', ['/select,', filename], { detached: true });
		} else {
			shell.showItemInFolder(filename);
		}
	} catch (ex) {
		console.info("electronJS_download error", ex);
		throw ex;
	}
}