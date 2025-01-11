// @ts-check
import * as crypto from "node:crypto";

import * as bufferTools from "./buffer-tools.js";

const zero = Buffer.from("00000000000000000000000000000000", "hex");
const rb = Buffer.from("00000000000000000000000000000087", "hex");
const blockSize = 16;

export function generateSubkeys(key) {
	const l = aes(key, zero);

	let subkey1 = bufferTools.bitShiftLeft(l);
	if (l[0] & 0x80) {
		subkey1 = bufferTools.xor(subkey1, rb);
	}

	let subkey2 = bufferTools.bitShiftLeft(subkey1);
	if (subkey1[0] & 0x80) {
		subkey2 = bufferTools.xor(subkey2, rb);
	}

	return { subkey1: subkey1, subkey2: subkey2 };
}

function aes(key, message) {
	const keyLengthToCipher = { 16: "aes128", 24: "aes192", 32: "aes256" };
	if (!keyLengthToCipher[key.length]) {
		throw new Error("Keys must be 128, 192, or 256 bits in length.");
	}
	const cipher = crypto.createCipheriv(
		keyLengthToCipher[key.length],
		key,
		zero,
	);
	const result = cipher.update(message);
	cipher.final();
	return result;
}

export function aesCmac(key, message) {
	const subkeys = generateSubkeys(key);
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
			subkeys.subkey1,
		);
	} else {
		lastBlock = bufferTools.xor(
			getPaddedMessageBlock(message, lastBlockIndex),
			subkeys.subkey2,
		);
	}

	let x = Buffer.from("00000000000000000000000000000000", "hex");
	let y;

	for (let index = 0; index < lastBlockIndex; index++) {
		y = bufferTools.xor(x, getMessageBlock(message, index));
		x = aes(key, y);
	}
	y = bufferTools.xor(lastBlock, x);
	return aes(key, y);
}

function getMessageBlock(message, blockIndex) {
	const block = Buffer.alloc(blockSize);
	const start = blockIndex * blockSize;
	const end = start + blockSize;

	message.copy(block, 0, start, end);

	return block;
}

function getPaddedMessageBlock(message, blockIndex) {
	const block = Buffer.alloc(blockSize, 0);
	const start = blockIndex * blockSize;
	const end = message.length;

	message.copy(block, 0, start, end);
	block[end - start] = 0x80;

	return block;
}
