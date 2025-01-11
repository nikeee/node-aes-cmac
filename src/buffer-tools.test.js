// @ts-check
import * as assert from "node:assert";
import { describe, it } from "node:test";

import * as bufferTools from "./buffer-tools.js";

describe("buffer-tools", () => {
	describe("bitShiftLeft", () => {
		function testBitShiftLeft(input) {
			return bufferTools
				.bitShiftLeft(Buffer.from(input, "hex"))
				.toString("hex");
		}

		it("returns a buffer bitshifted left 1 bit (buffer_value << 1)", () => {
			assert.equal(testBitShiftLeft("01"), "02");
			assert.equal(testBitShiftLeft("02"), "04");
			assert.equal(testBitShiftLeft("04"), "08");
			assert.equal(testBitShiftLeft("08"), "10");
			assert.equal(testBitShiftLeft("10"), "20");
			assert.equal(testBitShiftLeft("20"), "40");
			assert.equal(testBitShiftLeft("40"), "80");
			assert.equal(testBitShiftLeft("80"), "00");
			assert.equal(testBitShiftLeft("55cc33"), "ab9866");
		});
	});

	describe("xor", () => {
		function testXor(a, b) {
			return bufferTools
				.xor(Buffer.from(a, "hex"), Buffer.from(b, "hex"))
				.toString("hex");
		}

		it("returns the logical XOR of two buffers", () => {
			assert.equal(testXor("5a", "a5"), "ff");
			assert.equal(testXor("5a", "5a"), "00");
			assert.equal(testXor("5a", "ff"), "a5");
			assert.equal(testXor("5a", "00"), "5a");
			assert.equal(testXor("5a", "c3"), "99");
			assert.equal(testXor("5a", "99"), "c3");
			assert.equal(testXor("abcd", "0123"), "aaee");
			assert.equal(testXor("123456", "789abc"), "6aaeea");
		});
	});
});
