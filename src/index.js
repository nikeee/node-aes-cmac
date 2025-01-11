const aesCmac = require("./aes-cmac.js").aesCmac;

exports.aesCmac = (key, message, options) => {
	validateKey(key);
	const messageBuffer = validateMessage(message);
	options = options ? options : {};
	const result = aesCmac(key, messageBuffer);
	return options.returnAsBuffer ? result : result.toString("hex");
};

function validateKey(key) {
	if (typeof key !== "string" && !(key instanceof Buffer)) {
		throw new Error("Keys must be provided as a Buffer or string.");
	}
}

function validateMessage(message) {
	if (typeof message !== "string" && !(message instanceof Buffer)) {
		throw new Error("The message must be provided as a string or Buffer.");
	}
	return message instanceof Buffer ? message : new Buffer(message);
}
