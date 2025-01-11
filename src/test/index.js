const index = require("../index.js");
const assert = require("assert");

describe("index (module entry point)", () => {
	describe("aesCmac(key, message, [options])", () => {
		it("performs the AES-CMAC algorithm", () => {
			const key = new Buffer("2b7e151628aed2a6abf7158809cf4f3c", "hex");
			const message = new Buffer("6bc1bee22e409f96e93d7e117393172a", "hex");
			const result = index.aesCmac(key, message);
			assert.equal(result, "070a16b46b4d4144f79bdd9dd04a287c");
		});

		it("can take a buffer or string as the key", () => {
			const stringKey = "averysecretvalue";
			const bufferKey = new Buffer(stringKey);
			const message = new Buffer("some message");
			assert.equal(
				index.aesCmac(stringKey, message),
				index.aesCmac(bufferKey, message),
			);
		});

		it("can take a buffer or string as the message", () => {
			const key = "averysecretvalue";
			const stringMessage = "some message";
			const bufferMessage = new Buffer(stringMessage);
			assert.equal(
				index.aesCmac(key, stringMessage),
				index.aesCmac(key, bufferMessage),
			);
		});

		it("returns a buffer as the response if options.returnAsBuffer == true", () => {
			const key = "k3Men*p/2.3j4abB";
			const message = "this|is|a|test|message";
			const options = { returnAsBuffer: true };
			const result = index.aesCmac(key, message, options);
			assert(result instanceof Buffer, "Did not get a Buffer object.");
			assert.equal(result.toString("hex"), "0125c538f8be7c4eea370f992a4ffdcb");
		});

		it("throws an error if the key length is invalid", () => {
			assertAesCmacError(
				"key",
				"some message",
				"Keys must be 128, 192, or 256 bits in length.",
			);
		});

		it("throws an error if the key is neither Buffer nor string", () => {
			const expected = "Keys must be provided as a Buffer or string.";
			assertAesCmacError(null, "any message", expected);
			assertAesCmacError(123, "any message", expected);
		});

		it("throws an error if the message is neither string nor Buffer", () => {
			const expected = "The message must be provided as a string or Buffer.";
			assertAesCmacError("averysecretvalue", null, expected);
			assertAesCmacError("averysecretvalue", {}, expected);
		});

		function assertAesCmacError(key, message, expectedErrorMessage) {
			assert.throws(
				() => {
					index.aesCmac(key, message);
				},
				error => {
					assert.equal(error.message, expectedErrorMessage);
					return true;
				},
			);
		}
	});
});
