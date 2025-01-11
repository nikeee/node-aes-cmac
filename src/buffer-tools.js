// @ts-check

/**
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
export function bitShiftLeft(buffer) {
	const shifted = Buffer.alloc(buffer.length);
	const last = buffer.length - 1;
	for (let index = 0; index < last; index++) {
		shifted[index] = buffer[index] << 1;
		if (buffer[index + 1] & 0x80) {
			shifted[index] += 0x01;
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
	const output = Buffer.alloc(length);
	for (let index = 0; index < length; index++) {
		output[index] = a[index] ^ b[index];
	}
	return output;
}
