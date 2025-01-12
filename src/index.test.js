// @ts-check
import * as assert from "node:assert";
import { describe, it } from "node:test";

import aesCmac from "./index.js";

describe("index (module entry point)", () => {
	describe("aesCmac(key, message)", () => {
		it("performs the AES-CMAC algorithm", () => {
			const key = Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex");
			const message = Buffer.from("6bc1bee22e409f96e93d7e117393172a", "hex");
			const result = aesCmac(key, message);
			assert.deepEqual(
				Buffer.from("070a16b46b4d4144f79bdd9dd04a287c", "hex"),
				result,
			);
		});

		it("throws an error if the key length is invalid", () => {
			assertAesCmacError(
				Buffer.from("0123", "hex"),
				Buffer.from("any message", "ascii"),
				"Keys must be 128, 192, or 256 bits in length.",
			);
		});

		it("throws an error if the key is not a Buffer", () => {
			const expected = "`key` must be provided as a Buffer.";
			const message = Buffer.from("any message", "ascii");
			assertAesCmacError(null, message, expected);
			assertAesCmacError(123, message, expected);
		});

		it("throws an error if the message is not a Buffer", () => {
			const expected = "`message` must be provided as a Buffer.";
			const key = Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "hex");
			assertAesCmacError(key, null, expected);
			assertAesCmacError(key, {}, expected);
		});

		function assertAesCmacError(key, message, expectedErrorMessage) {
			assert.throws(
				() => {
					aesCmac(key, message);
				},
				error => {
					// @ts-ignore
					assert.equal(error.message, expectedErrorMessage);
					return true;
				},
			);
		}
	});
});
