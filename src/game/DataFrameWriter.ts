export class DataFrameWriter {
	private bytes: number[];

	constructor() {
		this.bytes = [];
	}

	public get Buffer() {
		return this.bytes;
	}

	public get ArrayBuffer() {
		return new Uint8Array(this.bytes).buffer;
	}

	WriteUint8(t: number) {
		this.bytes.push(t);
	}

	WriteUint16(t: number) {
		this.bytes.push(255 & t);
		this.bytes.push((t >> 8) & 255);
	}

	WriteInt16(t: number) {
		t < 0 && (t += 65536);
		this.WriteUint16(t);
	}

	WriteUint32(t: number) {
		this.bytes.push(255 & t);
		this.bytes.push((t >> 8) & 255);
		this.bytes.push((t >> 16) & 255);
		this.bytes.push((t >> 24) & 255);
	}

	WriteUint64(t: number) {
		this.bytes.push(255 & t);
		this.bytes.push((t >> 8) & 255);
		this.bytes.push((t >> 16) & 255);
		this.bytes.push((t >> 24) & 255);
		this.bytes.push((t >> 32) & 255);
		this.bytes.push((t >> 40) & 255);
		this.bytes.push((t >> 48) & 255);
		this.bytes.push((t >> 56) & 255);
	}

	WriteInt32(t: number) {
		t < 0 && (t += 4294967295);
		this.WriteUint32(t);
	}

	WriteFloat32(t: number) {
		var e = new ArrayBuffer(4);
		new Float32Array(e)[0] = t;
		var n = new Uint32Array(e)[0];
		this.WriteUint32(n);
	}

	WriteStringEx(t: string) {
		this.WriteUint16(t.length);

		for (var e = 0; e < t.length; e++) {
			this.WriteUint16(t.charCodeAt(e));
		}
	}
}
