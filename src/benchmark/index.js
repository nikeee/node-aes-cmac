// @ts-check
import { Bench } from "tinybench";

import aesCmac from "../index.js";

const bench = new Bench({ name: "performance", time: 100 });

const keys = new Array(100).fill(0).map((_, index) => Buffer.alloc(16, index));
const messages = new Array(100)
	.fill(0)
	.map((_, index) => Buffer.alloc(index % 2 === 0 ? 16 : 32, index * 2));

bench.add("mac generation", () => {
	for (let k = 0; k < keys.length; ++k) {
		const key = keys[k];
		for (let m = 0; m < messages.length; ++m) {
			const _cmac = aesCmac(key, messages[m]);
		}
	}
});

await bench.run();

console.log(bench.name);
console.table(bench.table());
