// @ts-check

import { aesCmac as _aesCmac } from "./aes-cmac.js";

/**
 * @param {Buffer} key
 * @param {Buffer} message
 * @returns {Buffer}
 */
export default function aesCmac(key, message) {
	return _aesCmac(key, message);
}
