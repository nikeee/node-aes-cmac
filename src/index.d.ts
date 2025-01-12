/**
 * Perform AES-CMAC on the given message with the given key according to [NIST Special Publication 800-38B](http://csrc.nist.gov/publications/nistpubs/800-38B/SP_800-38B.pdf)
and ([RFC 4493](http://tools.ietf.org/html/rfc4493)).
 * @param {Buffer} key AES key to use. Supported sizes are: 16, 24, 32 bytes (128, 192, 256 bits).
 * @param {Buffer} message
 * @example
 * ```js
 * import aesCmac from "@nikeee/aes-cmac";
 *
 * const key = Buffer.from("k3Men*p/2.3j4abB");
 * const message = Buffer.from("this|is|a|test|message");
 * const cmac = aesCmac(key, message).toString("hex");
 * // cmac will be: "0125c538f8be7c4eea370f992a4ffdcb"
 *
 * // Example with buffers.
 * const bufferKey = Buffer.from("6b334d656e2a702f322e336a34616242", "hex");
 * const bufferMessage = Buffer.from("this|is|a|test|message");
 * const cmac = aesCmac(bufferKey, bufferMessage);
 * // cmac will be a Buffer containing:
 * // <01 25 c5 38 f8 be 7c 4e ea 37 0f 99 2a 4f fd cb>
 * ```
 */
export default function aesCmac(key: Buffer, message: Buffer): Buffer;
