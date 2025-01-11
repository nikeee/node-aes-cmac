exports.bitShiftLeft = buffer => {
	const shifted = new Buffer(buffer.length);
	const last = buffer.length - 1;
	for (let index = 0; index < last; index++) {
		shifted[index] = buffer[index] << 1;
		if (buffer[index + 1] & 0x80) {
			shifted[index] += 0x01;
		}
	}
	shifted[last] = buffer[last] << 1;
	return shifted;
};

exports.xor = (bufferA, bufferB) => {
	const length = Math.min(bufferA.length, bufferB.length);
	const output = new Buffer(length);
	for (let index = 0; index < length; index++) {
		output[index] = bufferA[index] ^ bufferB[index];
	}
	return output;
};

const bitmasks = [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01];

exports.toBinaryString = buffer => {
	let binary = "";
	for (let bufferIndex = 0; bufferIndex < buffer.length; bufferIndex++) {
		for (let bitmaskIndex = 0; bitmaskIndex < bitmasks.length; bitmaskIndex++) {
			binary += buffer[bufferIndex] & bitmasks[bitmaskIndex] ? "1" : "0";
		}
	}
	return binary;
};
