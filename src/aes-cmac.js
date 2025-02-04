// @ts-check
import * as crypto from "node:crypto";

import * as bufferTools from "./buffer-tools.js";

const zero = Buffer.alloc(16);
const rb = Buffer.from("00000000000000000000000000000087", "hex");
const blockSize = 16;

const keyLengthToCipher = {
	16: "aes-128-ecb",
	24: "aes-192-ecb",
	32: "aes-256-ecb",
};

/**
 * @param {Buffer} key
 * @returns {{ subKey1: Buffer, subKey2: Buffer }}
 */
export function generateSubKeys(key) {
	const l = aes(key, zero);

	let subKey1 = bufferTools.bitShiftLeft(l);
	if (l[0] & 0x80) {
		subKey1 = bufferTools.xor(subKey1, rb);
	}

	let subKey2 = bufferTools.bitShiftLeft(subKey1);
	if (subKey1[0] & 0x80) {
		subKey2 = bufferTools.xor(subKey2, rb);
	}

	return { subKey1, subKey2 };
}

/**
 * @param {Buffer} key
 * @param {Buffer} message
 * @returns {Buffer}
 */
function aes(key, message) {
	if (message.byteLength !== 16) {
		throw new Error("message length has to be exactly one block.");
	}
	const cipher = crypto.createCipheriv(
		keyLengthToCipher[key.length],
		key,
		null,
	);
	cipher.setAutoPadding(false);
	return cipher.update(message);
}

/**
 * @param {Buffer} key
 * @param {Buffer} message
 * @returns {Buffer}
 */
export function aesCmac(key, message) {
	if (!(key instanceof Buffer)) {
		throw new Error("`key` must be provided as a Buffer.");
	}
	if (!keyLengthToCipher[key.length]) {
		throw new Error("Keys must be 128, 192, or 256 bits in length.");
	}
	if (!(message instanceof Buffer)) {
		throw new Error("`message` must be provided as a Buffer.");
	}

	const { subKey1, subKey2 } = generateSubKeys(key);
	let blockCount = Math.ceil(message.length / blockSize);
	let lastBlockCompleteFlag;
	let lastBlock;
	let lastBlockIndex;

	if (blockCount === 0) {
		blockCount = 1;
		lastBlockCompleteFlag = false;
	} else {
		lastBlockCompleteFlag = message.length % blockSize === 0;
	}
	lastBlockIndex = blockCount - 1;

	if (lastBlockCompleteFlag) {
		lastBlock = bufferTools.xor(
			getMessageBlock(message, lastBlockIndex),
			subKey1,
		);
	} else {
		lastBlock = bufferTools.xor(
			getPaddedMessageBlock(message, lastBlockIndex),
			subKey2,
		);
	}

	let x = Buffer.alloc(16);
	let y;

	for (let index = 0; index < lastBlockIndex; index++) {
		y = bufferTools.xor(x, getMessageBlock(message, index));
		x = aes(key, y);
	}

	y = bufferTools.xor(lastBlock, x);
	return aes(key, y);
}

/**
 * @param {Buffer} message
 * @param {number} blockIndex
 * @returns {Buffer}
 */
function getMessageBlock(message, blockIndex) {
	const block = Buffer.alloc(blockSize);
	const start = blockIndex * blockSize;
	const end = start + blockSize;

	message.copy(block, 0, start, end);

	return block;
}

/**
 * @param {Buffer} message
 * @param {number} blockIndex
 * @returns {Buffer}
 */
function getPaddedMessageBlock(message, blockIndex) {
	const block = Buffer.alloc(blockSize, 0);
	const start = blockIndex * blockSize;
	const end = message.length;

	message.copy(block, 0, start, end);
	block[end - start] = 0x80;

	return block;
}
