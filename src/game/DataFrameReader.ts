export class DataFrameReader {
	private bytes: Uint8Array;

	private pos: number;

	constructor(t) {
		this.bytes = new Uint8Array(t);
		this.pos = 0;
	}

	public get Length(): number {
		return this.bytes.length;
	}

	public ReadUint8() {
		return this.bytes[this.pos++];
	}

	public ReadUint16() {
		return this.ReadUint8() | (this.ReadUint8() << 8);
	}

	public ReadUint32() {
		const t = this.ReadUint8(),
			e = this.ReadUint8(),
			n = this.ReadUint8();
		return (this.ReadUint8() << 24) | (n << 16) | (e << 8) | t;
	}

	public ReadInt16() {
		let t = this.ReadUint16();
		return t >= 32768 && (t -= 65536), t;
	}

	public ReadInt32() {
		let t = this.ReadUint32();
		return t >= 2147483648 && (t -= 4294967295), t;
	}

	public ReadFloat32() {
		let t = this.ReadUint32(),
			e = new ArrayBuffer(4);
		return (new Uint32Array(e)[0] = t), new Float32Array(e)[0];
	}

	public ReadStringEx() {
		let e = "";

		for (let t = this.ReadUint16(), n = 0; n < t; n++) {
			e += String.fromCharCode(this.ReadUint16());
		}

		return e;
	}
}
