# node-aes-cmac

A pure [Node.js](http://nodejs.org/) implementation of the AES-CMAC algorithm
per [NIST Special Publication 800-38B](http://csrc.nist.gov/publications/nistpubs/800-38B/SP_800-38B.pdf)
and ([RFC 4493](http://tools.ietf.org/html/rfc4493)).
This algorithm creates a cryptographic message authentication code (CMAC)
from a given message using the AES cipher with 128, 192, and 256 bit keys.


## Why?
At work we had a need to run AES-CMAC from Node.js.
A coworker created an implementation which uses a C++ addon which wrapped [Crypto++](http://www.cryptopp.com/),
but unfortunately the module was only known to build correctly on Ubuntu.
OS X support was added through some further hacking, but Windows support was extremely difficult.

Searching the web yielded no alternatives, so I started this project with a goal to
create an AES-CMAC implementation to share with the Node.js community which would be easy to use on
OS X, Windows, and Linux.

Currently the project only uses the built-in cryptographic functions provided by Node.js and avoids using C/C++ addons.
This was a conscious trade-off favoring simplicity over raw performance.

---

Hard-fork of [allan-stewart/node-aes-cmac](https://github.com/allan-stewart/node-aes-cmac).

## Installation
```sh
npm install @nikeee/aes-cmac
```

## Usage
The module exposes a single method: `aesCmac(key, message)`

### Arguments
* `key` - (`Buffer`) the cryptographic key to use for the operation.
    Must be 128, 192, or 256 bits in length.
* `message` - (`Buffer`) the message.

### Return Value
The method normally returns the CMAC as a `Buffer`.

### Example
```js
import aesCmac from "@nikeee/aes-cmac";

const key = Buffer.from("k3Men*p/2.3j4abB");
const message = Buffer.from("this|is|a|test|message");
const cmac = aesCmac(key, message).toString("hex");
// cmac will be: "0125c538f8be7c4eea370f992a4ffdcb"

// Example with buffers.
const bufferKey = Buffer.from("6b334d656e2a702f322e336a34616242", "hex");
const bufferMessage = Buffer.from("this|is|a|test|message");
const cmac = aesCmac(bufferKey, bufferMessage);
// cmac will be a Buffer containing:
// <01 25 c5 38 f8 be 7c 4e ea 37 0f 99 2a 4f fd cb>
```
