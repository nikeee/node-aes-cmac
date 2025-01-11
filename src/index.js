// @ts-check

import { aesCmac as _aesCmac } from "./aes-cmac.js";

/**
 * @param {Buffer} key
 * @param {Buffer} message
 * @returns {Buffer}
 */
export default function aesCmac(key, message) {
	if (!(key instanceof Buffer)) {
		throw new Error("Keys must be provided as a Buffer.");
	}
	if (!(message instanceof Buffer)) {
		throw new Error("The message must be provided as a Buffer.");
	}
	return _aesCmac(key, message);
}
