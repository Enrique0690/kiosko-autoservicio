const { app, BrowserWindow, Menu } = require("electron"),
	{ exec } = require('child_process'),
	fs = require("fs"),
	ptp = require("pdf-to-printer"),
	path = require("path"),
	url = require('url');

var printWindow;
var pdfWindow;

/**
 * Esta función carga el contenido enviado y genera el PDF:
 * Está pensado para cargar un archivo .html (un template) y procesarlo con los datos recibidos.
 * Después genera un archivo .pdf y lo guarda en una carpeta temporal.
 * Opcionalmente abre el archivo PDF.
 * Opcionalmente permite una vista previa (carga otra ventan
 * @param {Event} event 
 * @param {Object} message 
 */

module.exports = function (event, message) {
	const mainWindow = BrowserWindow.fromWebContents(event.sender);
	try {
		const { data, html_file, preview, impresora, landspace } = message;
		if (!html_file.startsWith("blob:") && !fs.existsSync(html_file)) throw { messge: "No se encontra el archivo de Formato" };

		console.info("print-invoce-documento message: ", message);

		printWindow = new BrowserWindow({
			useContentSize: true,
			show: false,
			modal: true,
			parent: mainWindow,
			webPreferences: {
				contextIsolation: false,
				nodeIntegration: true,
				nodeIntegrationInWorker: true,
				enableRemoteModule: true
			}
		});
		const IS_BLOB = html_file.startsWith("blob:");
		if (IS_BLOB) {
			printWindow.loadURL(html_file);
		} else {
			printWindow.loadURL(url.format({
				pathname: html_file,
				protocol: 'file:',
				slashes: true
			}));
		}

		printWindow.on("ready-to-show", () => {
			console.info("print-window ready-to-show");
			if (IS_BLOB) {
				return ProcessPDF({ showPDF: true, preview, landspace })
					.then(() => send_ok(mainWindow))
					.catch(ex => send_error(mainWindow, ex));
			}
			printWindow.webContents.send("print-window:load-data", {
				data,
				preview,
				printer: impresora
			});
		});
		printWindow.on("closed", () => printWindow = null);

		printWindow.webContents.on("will-navigate", (event, new_url) => {
			console.info("print-invoce-documento will-navigate: PREVIEW ", preview);
			event.preventDefault();
			var SentParams = {};
			try {
				const X = new url.URL(new_url);
				SentParams = {
					showPDF: X.searchParams && X.searchParams.get("showPDF")
					, preview
					, landspace
				};
				console.info("will-navigate PARAMS: ", SentParams);
			} catch (ex) {
				console.info("will-navigate params not recognized URL:", url);
			}
			ProcessPDF(SentParams)
				.then(() => send_ok(mainWindow))
				.catch(ex => send_error(mainWindow, ex));
		});

		console.info("print-invoce-documento completado.");
	} catch (e) {
		send_error(mainWindow, e);
		console.info("error on print-invoice-document ", e);
	}
}

function send_error(mainWindow, e) {
	mainWindow.webContents.send("print-window:error", {
		name: e.name,
		code: e.code,
		message: e.message,
		stack: e.stack
	});
}
function send_ok(mainWindow) {
	mainWindow.webContents.send("print-window:ok");
}

async function ProcessPDF(SentParams) {
	const { showPDF, preview, landspace } = SentParams;
	const results = await GeneratePDF(printWindow, landspace);
	console.info("PDF Generated");
	const { FILE_PATH } = results;

	if (showPDF) return exec(FILE_PATH);

	if (preview) {
		pdfWindow = GeneratePDFPreview(results, mainWindow, landspace);
		console.info("PDF Window created");
		pdfWindow.on("closed", () => pdfWindow = null);
		return pdfWindow.show();
	}

	printWindow && printWindow.close();
	pdfWindow && pdfWindow.close();
	console.info("PDF Window, ready to START PRINTING");
	await PrintPDFFile(FILE_PATH)
	console.info("PDF Printin Ok");
}

var COUNTER = 0;
function GeneratePDF(window, landspace) {
	return window.webContents.printToPDF({ silent: false, marginsType: 1, landspace })
		.then(FILE => {
			COUNTER++;
			const FILE_PATH = path.join(app.getPath("temp"), "runfood_impresion-" + new Date().valueOf() + "-" + COUNTER + ".pdf");
			fs.writeFileSync(FILE_PATH, FILE);
			return {
				FILE_PATH,
				FILE
			};
		});
}
function GeneratePDFPreview(results, parent) {
	const { FILE, FILE_PATH } = results;

	const _window_ = new BrowserWindow({
		title: "Vista Previa",
		center: true,
		webPreferences: {
			webSecurity: false,
			plugins: true,
			contextIsolation: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: true
		},
		modal: true,
		parent,
		show: false
	});
	_window_.setMenu(Menu.buildFromTemplate([{
		label: "Imprimir",
		click: () => PrintPDFFile(FILE_PATH),
		accelerator: "Ctrl+P"
	}, {
		label: "Salir",
		click: () => _window_.close(),
		accelerator: "Esc"
	}]));

	const pdf = FILE.toString("base64");
	_window_.loadURL('data:application/pdf;base64,' + pdf);

	return _window_;
}

function PrintPDFFile(FILE_PATH) {
	return ptp.print(FILE_PATH);
}