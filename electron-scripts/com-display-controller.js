try {
  var SerialPort = require("serialport");
} catch (ex) {
  if (process.env.NODE_ENV === "development") {
    console.info("Serialport no va a funcionar. El sistema esta funcionando en dev mode");
  } else {
    throw ex;
  }
}

const ZKTECO = "custom:zkteco510";

function COMDisplayController() {
  this.port = null;
  this.display_type = null;
  this.timer = null;
}
COMDisplayController.prototype.init = function (COM_PORT, COM_TYPE) {
  if (!COM_PORT) { COM_PORT = "COM2"; }
  this.display_type = COM_TYPE;
  var configs = { baudRate: 9600 };
  if (this.display_type === ZKTECO) {
    configs.baudRate = 2400;
  }
  this.port = new SerialPort(COM_PORT, configs);
}
/** Envio de 2 lineas para ALL-IN-ONE GOLE tinen un tablero de 20x2 */
COMDisplayController.prototype.sendGOLE = function (_line1, _line2) {
  if (!this.port) {
    throw { message: "Propiedad serial-Display no inicializada" };
  }
  this._clean();
  if (this.display_type === ZKTECO) {
    if (_line1.indexOf("TOTAL") === 0) {
      this.port.write(zkteco_total(_line2.trim()));
    } else {
      this.port.write(zkteco_precio(_line2.trim()))
    }
  } else {
    this.port.write(this._fitText(_line1, 20) + this._fitText(_line2, 20));
  }
  this._cleanOnSecs(5);
}

/* funciones auxiliares */
COMDisplayController.prototype._cleanOnSecs = function (seconds) {
  if (this.timer !== null) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(x => this._clean(), seconds * 1000);
}

COMDisplayController.prototype._clean = function () {
  if (!this.port) {
    throw { message: "Propiedad serial-Display no inicializada" };
  }
  if (this.display_type === ZKTECO) {
    this.port.write(Buffer.from([12]));
  } else {
    this.port.write(String.fromCharCode(27) + "@");
  }
}

COMDisplayController.prototype._fitText = function (n, width) {
  // Esta funcion llena el string con lo que haya en la variable z A LA DERECHA!
  var z = " ";
  n = n + '';
  if (n.length >= width) {
    //	return n
    return n.substring(0, width);
  } else {
    return n + new Array(width - n.length + 1).join(z);
  }
}

module.exports = COMDisplayController;


function zkteco_precio(numbers) {
  return Buffer.concat([

    // imprimir numeros
    Buffer.from([12, 27, 81, 65])
    , Buffer.from(numbers, "utf-8")
    , Buffer.from([13])

    // iluminar texto `precio`
    , Buffer.from([27, 115])
    , Buffer.from("1", "utf8")
  ])
}
function zkteco_total(numbers) {
  return Buffer.concat([

    // imprimir numeros
    Buffer.from([12, 27, 81, 65])
    , Buffer.from(numbers, "utf-8")
    , Buffer.from([13])

    // iluminar texto `total`
    , Buffer.from([27, 115])
    , Buffer.from("2", "utf8")
  ])
}