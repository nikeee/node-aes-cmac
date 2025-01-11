// @ts-check

/**
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
export function bitShiftLeft(buffer) {
	const shifted = Buffer.allocUnsafe(buffer.length);
	const last = buffer.length - 1;
	for (let i = 0; i < last; i++) {
		shifted[i] = buffer[i] << 1;
		if (buffer[i + 1] & 0x80) {
			shifted[i] += 0x01;
		}
	}
	shifted[last] = buffer[last] << 1;
	return shifted;
}

/**
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {Buffer}
 */
export function xor(a, b) {
	const length = Math.min(a.length, b.length);
	const output = Buffer.allocUnsafe(length);
	for (let i = 0; i < length; i++) {
		output[i] = a[i] ^ b[i];
	}
	return output;
}
