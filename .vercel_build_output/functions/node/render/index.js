var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, '__esModule', { value: true });
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
	if ((module2 && typeof module2 === 'object') || typeof module2 === 'function') {
		for (let key of __getOwnPropNames(module2))
			if (!__hasOwnProp.call(target, key) && key !== 'default')
				__defProp(target, key, {
					get: () => module2[key],
					enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable
				});
	}
	return target;
};
var __toModule = (module2) => {
	return __reExport(
		__markAsModule(
			__defProp(
				module2 != null ? __create(__getProtoOf(module2)) : {},
				'default',
				module2 && module2.__esModule && 'default' in module2
					? { get: () => module2.default, enumerable: true }
					: { value: module2, enumerable: true }
			)
		),
		module2
	);
};

// .svelte-kit/vercel/entry.js
__markAsModule(exports);
__export(exports, {
	default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
	return new Promise((fulfil, reject) => {
		const h = req.headers;
		if (!h['content-type']) {
			return fulfil(null);
		}
		req.on('error', reject);
		const length = Number(h['content-length']);
		if (isNaN(length) && h['transfer-encoding'] == null) {
			return fulfil(null);
		}
		let data = new Uint8Array(length || 0);
		if (length > 0) {
			let offset = 0;
			req.on('data', (chunk) => {
				const new_len = offset + Buffer.byteLength(chunk);
				if (new_len > length) {
					return reject({
						status: 413,
						reason: 'Exceeded "Content-Length" limit'
					});
				}
				data.set(chunk, offset);
				offset = new_len;
			});
		} else {
			req.on('data', (chunk) => {
				const new_data = new Uint8Array(data.length + chunk.length);
				new_data.set(data, 0);
				new_data.set(chunk, data.length);
				data = new_data;
			});
		}
		req.on('end', () => {
			const [type] = h['content-type'].split(/;\s*/);
			if (type === 'application/octet-stream') {
				return fulfil(data);
			}
			const encoding = h['content-encoding'] || 'utf-8';
			fulfil(new TextDecoder(encoding).decode(data));
		});
	});
}

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require('http'));
var import_https = __toModule(require('https'));
var import_zlib = __toModule(require('zlib'));
var import_stream = __toModule(require('stream'));
var import_util = __toModule(require('util'));
var import_crypto = __toModule(require('crypto'));
var import_url = __toModule(require('url'));
function dataUriToBuffer(uri) {
	if (!/^data:/i.test(uri)) {
		throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
	}
	uri = uri.replace(/\r?\n/g, '');
	const firstComma = uri.indexOf(',');
	if (firstComma === -1 || firstComma <= 4) {
		throw new TypeError('malformed data: URI');
	}
	const meta = uri.substring(5, firstComma).split(';');
	let charset = '';
	let base64 = false;
	const type = meta[0] || 'text/plain';
	let typeFull = type;
	for (let i = 1; i < meta.length; i++) {
		if (meta[i] === 'base64') {
			base64 = true;
		} else {
			typeFull += `;${meta[i]}`;
			if (meta[i].indexOf('charset=') === 0) {
				charset = meta[i].substring(8);
			}
		}
	}
	if (!meta[0] && !charset.length) {
		typeFull += ';charset=US-ASCII';
		charset = 'US-ASCII';
	}
	const encoding = base64 ? 'base64' : 'ascii';
	const data = unescape(uri.substring(firstComma + 1));
	const buffer = Buffer.from(data, encoding);
	buffer.type = type;
	buffer.typeFull = typeFull;
	buffer.charset = charset;
	return buffer;
}
var src = dataUriToBuffer;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
	for (const part of parts) {
		if ('stream' in part) {
			yield* part.stream();
		} else {
			yield part;
		}
	}
}
var Blob = class {
	constructor(blobParts = [], options2 = {}) {
		let size = 0;
		const parts = blobParts.map((element) => {
			let buffer;
			if (element instanceof Buffer) {
				buffer = element;
			} else if (ArrayBuffer.isView(element)) {
				buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
			} else if (element instanceof ArrayBuffer) {
				buffer = Buffer.from(element);
			} else if (element instanceof Blob) {
				buffer = element;
			} else {
				buffer = Buffer.from(typeof element === 'string' ? element : String(element));
			}
			size += buffer.length || buffer.size || 0;
			return buffer;
		});
		const type = options2.type === void 0 ? '' : String(options2.type).toLowerCase();
		wm.set(this, {
			type: /[^\u0020-\u007E]/.test(type) ? '' : type,
			size,
			parts
		});
	}
	get size() {
		return wm.get(this).size;
	}
	get type() {
		return wm.get(this).type;
	}
	async text() {
		return Buffer.from(await this.arrayBuffer()).toString();
	}
	async arrayBuffer() {
		const data = new Uint8Array(this.size);
		let offset = 0;
		for await (const chunk of this.stream()) {
			data.set(chunk, offset);
			offset += chunk.length;
		}
		return data.buffer;
	}
	stream() {
		return Readable.from(read(wm.get(this).parts));
	}
	slice(start = 0, end = this.size, type = '') {
		const { size } = this;
		let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
		let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
		const span = Math.max(relativeEnd - relativeStart, 0);
		const parts = wm.get(this).parts.values();
		const blobParts = [];
		let added = 0;
		for (const part of parts) {
			const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
			if (relativeStart && size2 <= relativeStart) {
				relativeStart -= size2;
				relativeEnd -= size2;
			} else {
				const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
				blobParts.push(chunk);
				added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
				relativeStart = 0;
				if (added >= span) {
					break;
				}
			}
		}
		const blob = new Blob([], { type: String(type).toLowerCase() });
		Object.assign(wm.get(blob), { size: span, parts: blobParts });
		return blob;
	}
	get [Symbol.toStringTag]() {
		return 'Blob';
	}
	static [Symbol.hasInstance](object) {
		return (
			object &&
			typeof object === 'object' &&
			typeof object.stream === 'function' &&
			object.stream.length === 0 &&
			typeof object.constructor === 'function' &&
			/^(Blob|File)$/.test(object[Symbol.toStringTag])
		);
	}
};
Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
	constructor(message, type) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.type = type;
	}
	get name() {
		return this.constructor.name;
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
};
var FetchError = class extends FetchBaseError {
	constructor(message, type, systemError) {
		super(message, type);
		if (systemError) {
			this.code = this.errno = systemError.code;
			this.erroredSysCall = systemError.syscall;
		}
	}
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
	return (
		typeof object === 'object' &&
		typeof object.append === 'function' &&
		typeof object.delete === 'function' &&
		typeof object.get === 'function' &&
		typeof object.getAll === 'function' &&
		typeof object.has === 'function' &&
		typeof object.set === 'function' &&
		typeof object.sort === 'function' &&
		object[NAME] === 'URLSearchParams'
	);
};
var isBlob = (object) => {
	return (
		typeof object === 'object' &&
		typeof object.arrayBuffer === 'function' &&
		typeof object.type === 'string' &&
		typeof object.stream === 'function' &&
		typeof object.constructor === 'function' &&
		/^(Blob|File)$/.test(object[NAME])
	);
};
function isFormData(object) {
	return (
		typeof object === 'object' &&
		typeof object.append === 'function' &&
		typeof object.set === 'function' &&
		typeof object.get === 'function' &&
		typeof object.getAll === 'function' &&
		typeof object.delete === 'function' &&
		typeof object.keys === 'function' &&
		typeof object.values === 'function' &&
		typeof object.entries === 'function' &&
		typeof object.constructor === 'function' &&
		object[NAME] === 'FormData'
	);
}
var isAbortSignal = (object) => {
	return typeof object === 'object' && object[NAME] === 'AbortSignal';
};
var carriage = '\r\n';
var dashes = '-'.repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
	let header = '';
	header += `${dashes}${boundary}${carriage}`;
	header += `Content-Disposition: form-data; name="${name}"`;
	if (isBlob(field)) {
		header += `; filename="${field.name}"${carriage}`;
		header += `Content-Type: ${field.type || 'application/octet-stream'}`;
	}
	return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString('hex');
async function* formDataIterator(form, boundary) {
	for (const [name, value] of form) {
		yield getHeader(boundary, name, value);
		if (isBlob(value)) {
			yield* value.stream();
		} else {
			yield value;
		}
		yield carriage;
	}
	yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
	let length = 0;
	for (const [name, value] of form) {
		length += Buffer.byteLength(getHeader(boundary, name, value));
		if (isBlob(value)) {
			length += value.size;
		} else {
			length += Buffer.byteLength(String(value));
		}
		length += carriageLength;
	}
	length += Buffer.byteLength(getFooter(boundary));
	return length;
}
var INTERNALS$2 = Symbol('Body internals');
var Body = class {
	constructor(body, { size = 0 } = {}) {
		let boundary = null;
		if (body === null) {
			body = null;
		} else if (isURLSearchParameters(body)) {
			body = Buffer.from(body.toString());
		} else if (isBlob(body));
		else if (Buffer.isBuffer(body));
		else if (import_util.types.isAnyArrayBuffer(body)) {
			body = Buffer.from(body);
		} else if (ArrayBuffer.isView(body)) {
			body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
		} else if (body instanceof import_stream.default);
		else if (isFormData(body)) {
			boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
			body = import_stream.default.Readable.from(formDataIterator(body, boundary));
		} else {
			body = Buffer.from(String(body));
		}
		this[INTERNALS$2] = {
			body,
			boundary,
			disturbed: false,
			error: null
		};
		this.size = size;
		if (body instanceof import_stream.default) {
			body.on('error', (err) => {
				const error3 =
					err instanceof FetchBaseError
						? err
						: new FetchError(
								`Invalid response body while trying to fetch ${this.url}: ${err.message}`,
								'system',
								err
						  );
				this[INTERNALS$2].error = error3;
			});
		}
	}
	get body() {
		return this[INTERNALS$2].body;
	}
	get bodyUsed() {
		return this[INTERNALS$2].disturbed;
	}
	async arrayBuffer() {
		const { buffer, byteOffset, byteLength } = await consumeBody(this);
		return buffer.slice(byteOffset, byteOffset + byteLength);
	}
	async blob() {
		const ct =
			(this.headers && this.headers.get('content-type')) ||
			(this[INTERNALS$2].body && this[INTERNALS$2].body.type) ||
			'';
		const buf = await this.buffer();
		return new fetchBlob([buf], {
			type: ct
		});
	}
	async json() {
		const buffer = await consumeBody(this);
		return JSON.parse(buffer.toString());
	}
	async text() {
		const buffer = await consumeBody(this);
		return buffer.toString();
	}
	buffer() {
		return consumeBody(this);
	}
};
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});
async function consumeBody(data) {
	if (data[INTERNALS$2].disturbed) {
		throw new TypeError(`body used already for: ${data.url}`);
	}
	data[INTERNALS$2].disturbed = true;
	if (data[INTERNALS$2].error) {
		throw data[INTERNALS$2].error;
	}
	let { body } = data;
	if (body === null) {
		return Buffer.alloc(0);
	}
	if (isBlob(body)) {
		body = body.stream();
	}
	if (Buffer.isBuffer(body)) {
		return body;
	}
	if (!(body instanceof import_stream.default)) {
		return Buffer.alloc(0);
	}
	const accum = [];
	let accumBytes = 0;
	try {
		for await (const chunk of body) {
			if (data.size > 0 && accumBytes + chunk.length > data.size) {
				const err = new FetchError(
					`content size at ${data.url} over limit: ${data.size}`,
					'max-size'
				);
				body.destroy(err);
				throw err;
			}
			accumBytes += chunk.length;
			accum.push(chunk);
		}
	} catch (error3) {
		if (error3 instanceof FetchBaseError) {
			throw error3;
		} else {
			throw new FetchError(
				`Invalid response body while trying to fetch ${data.url}: ${error3.message}`,
				'system',
				error3
			);
		}
	}
	if (body.readableEnded === true || body._readableState.ended === true) {
		try {
			if (accum.every((c) => typeof c === 'string')) {
				return Buffer.from(accum.join(''));
			}
			return Buffer.concat(accum, accumBytes);
		} catch (error3) {
			throw new FetchError(
				`Could not create Buffer from response body for ${data.url}: ${error3.message}`,
				'system',
				error3
			);
		}
	} else {
		throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
	}
}
var clone = (instance, highWaterMark) => {
	let p1;
	let p2;
	let { body } = instance;
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}
	if (body instanceof import_stream.default && typeof body.getBoundary !== 'function') {
		p1 = new import_stream.PassThrough({ highWaterMark });
		p2 = new import_stream.PassThrough({ highWaterMark });
		body.pipe(p1);
		body.pipe(p2);
		instance[INTERNALS$2].body = p1;
		body = p2;
	}
	return body;
};
var extractContentType = (body, request) => {
	if (body === null) {
		return null;
	}
	if (typeof body === 'string') {
		return 'text/plain;charset=UTF-8';
	}
	if (isURLSearchParameters(body)) {
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	}
	if (isBlob(body)) {
		return body.type || null;
	}
	if (
		Buffer.isBuffer(body) ||
		import_util.types.isAnyArrayBuffer(body) ||
		ArrayBuffer.isView(body)
	) {
		return null;
	}
	if (body && typeof body.getBoundary === 'function') {
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	}
	if (isFormData(body)) {
		return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
	}
	if (body instanceof import_stream.default) {
		return null;
	}
	return 'text/plain;charset=UTF-8';
};
var getTotalBytes = (request) => {
	const { body } = request;
	if (body === null) {
		return 0;
	}
	if (isBlob(body)) {
		return body.size;
	}
	if (Buffer.isBuffer(body)) {
		return body.length;
	}
	if (body && typeof body.getLengthSync === 'function') {
		return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
	}
	if (isFormData(body)) {
		return getFormDataLength(request[INTERNALS$2].boundary);
	}
	return null;
};
var writeToStream = (dest, { body }) => {
	if (body === null) {
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		dest.write(body);
		dest.end();
	} else {
		body.pipe(dest);
	}
};
var validateHeaderName =
	typeof import_http.default.validateHeaderName === 'function'
		? import_http.default.validateHeaderName
		: (name) => {
				if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
					const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
					Object.defineProperty(err, 'code', { value: 'ERR_INVALID_HTTP_TOKEN' });
					throw err;
				}
		  };
var validateHeaderValue =
	typeof import_http.default.validateHeaderValue === 'function'
		? import_http.default.validateHeaderValue
		: (name, value) => {
				if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
					const err = new TypeError(`Invalid character in header content ["${name}"]`);
					Object.defineProperty(err, 'code', { value: 'ERR_INVALID_CHAR' });
					throw err;
				}
		  };
var Headers = class extends URLSearchParams {
	constructor(init2) {
		let result = [];
		if (init2 instanceof Headers) {
			const raw = init2.raw();
			for (const [name, values] of Object.entries(raw)) {
				result.push(...values.map((value) => [name, value]));
			}
		} else if (init2 == null);
		else if (typeof init2 === 'object' && !import_util.types.isBoxedPrimitive(init2)) {
			const method = init2[Symbol.iterator];
			if (method == null) {
				result.push(...Object.entries(init2));
			} else {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}
				result = [...init2]
					.map((pair) => {
						if (typeof pair !== 'object' || import_util.types.isBoxedPrimitive(pair)) {
							throw new TypeError('Each header pair must be an iterable object');
						}
						return [...pair];
					})
					.map((pair) => {
						if (pair.length !== 2) {
							throw new TypeError('Each header pair must be a name/value tuple');
						}
						return [...pair];
					});
			}
		} else {
			throw new TypeError(
				"Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)"
			);
		}
		result =
			result.length > 0
				? result.map(([name, value]) => {
						validateHeaderName(name);
						validateHeaderValue(name, String(value));
						return [String(name).toLowerCase(), String(value)];
				  })
				: void 0;
		super(result);
		return new Proxy(this, {
			get(target, p, receiver) {
				switch (p) {
					case 'append':
					case 'set':
						return (name, value) => {
							validateHeaderName(name);
							validateHeaderValue(name, String(value));
							return URLSearchParams.prototype[p].call(
								receiver,
								String(name).toLowerCase(),
								String(value)
							);
						};
					case 'delete':
					case 'has':
					case 'getAll':
						return (name) => {
							validateHeaderName(name);
							return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
						};
					case 'keys':
						return () => {
							target.sort();
							return new Set(URLSearchParams.prototype.keys.call(target)).keys();
						};
					default:
						return Reflect.get(target, p, receiver);
				}
			}
		});
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
	toString() {
		return Object.prototype.toString.call(this);
	}
	get(name) {
		const values = this.getAll(name);
		if (values.length === 0) {
			return null;
		}
		let value = values.join(', ');
		if (/^content-encoding$/i.test(name)) {
			value = value.toLowerCase();
		}
		return value;
	}
	forEach(callback) {
		for (const name of this.keys()) {
			callback(this.get(name), name);
		}
	}
	*values() {
		for (const name of this.keys()) {
			yield this.get(name);
		}
	}
	*entries() {
		for (const name of this.keys()) {
			yield [name, this.get(name)];
		}
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	raw() {
		return [...this.keys()].reduce((result, key) => {
			result[key] = this.getAll(key);
			return result;
		}, {});
	}
	[Symbol.for('nodejs.util.inspect.custom')]() {
		return [...this.keys()].reduce((result, key) => {
			const values = this.getAll(key);
			if (key === 'host') {
				result[key] = values[0];
			} else {
				result[key] = values.length > 1 ? values : values[0];
			}
			return result;
		}, {});
	}
};
Object.defineProperties(
	Headers.prototype,
	['get', 'entries', 'forEach', 'values'].reduce((result, property) => {
		result[property] = { enumerable: true };
		return result;
	}, {})
);
function fromRawHeaders(headers = []) {
	return new Headers(
		headers
			.reduce((result, value, index2, array) => {
				if (index2 % 2 === 0) {
					result.push(array.slice(index2, index2 + 2));
				}
				return result;
			}, [])
			.filter(([name, value]) => {
				try {
					validateHeaderName(name);
					validateHeaderValue(name, String(value));
					return true;
				} catch {
					return false;
				}
			})
	);
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
	return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol('Response internals');
var Response2 = class extends Body {
	constructor(body = null, options2 = {}) {
		super(body, options2);
		const status = options2.status || 200;
		const headers = new Headers(options2.headers);
		if (body !== null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}
		this[INTERNALS$1] = {
			url: options2.url,
			status,
			statusText: options2.statusText || '',
			headers,
			counter: options2.counter,
			highWaterMark: options2.highWaterMark
		};
	}
	get url() {
		return this[INTERNALS$1].url || '';
	}
	get status() {
		return this[INTERNALS$1].status;
	}
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}
	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}
	get statusText() {
		return this[INTERNALS$1].statusText;
	}
	get headers() {
		return this[INTERNALS$1].headers;
	}
	get highWaterMark() {
		return this[INTERNALS$1].highWaterMark;
	}
	clone() {
		return new Response2(clone(this, this.highWaterMark), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected,
			size: this.size
		});
	}
	static redirect(url, status = 302) {
		if (!isRedirect(status)) {
			throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
		}
		return new Response2(null, {
			headers: {
				location: new URL(url).toString()
			},
			status
		});
	}
	get [Symbol.toStringTag]() {
		return 'Response';
	}
};
Object.defineProperties(Response2.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
	if (parsedURL.search) {
		return parsedURL.search;
	}
	const lastOffset = parsedURL.href.length - 1;
	const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === '#' ? '#' : '');
	return parsedURL.href[lastOffset - hash2.length] === '?' ? '?' : '';
};
var INTERNALS = Symbol('Request internals');
var isRequest = (object) => {
	return typeof object === 'object' && typeof object[INTERNALS] === 'object';
};
var Request = class extends Body {
	constructor(input, init2 = {}) {
		let parsedURL;
		if (isRequest(input)) {
			parsedURL = new URL(input.url);
		} else {
			parsedURL = new URL(input);
			input = {};
		}
		let method = init2.method || input.method || 'GET';
		method = method.toUpperCase();
		if (
			(init2.body != null || isRequest(input)) &&
			input.body !== null &&
			(method === 'GET' || method === 'HEAD')
		) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}
		const inputBody = init2.body
			? init2.body
			: isRequest(input) && input.body !== null
			? clone(input)
			: null;
		super(inputBody, {
			size: init2.size || input.size || 0
		});
		const headers = new Headers(init2.headers || input.headers || {});
		if (inputBody !== null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody, this);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}
		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init2) {
			signal = init2.signal;
		}
		if (signal !== null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}
		this[INTERNALS] = {
			method,
			redirect: init2.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};
		this.follow =
			init2.follow === void 0 ? (input.follow === void 0 ? 20 : input.follow) : init2.follow;
		this.compress =
			init2.compress === void 0
				? input.compress === void 0
					? true
					: input.compress
				: init2.compress;
		this.counter = init2.counter || input.counter || 0;
		this.agent = init2.agent || input.agent;
		this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
		this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
	}
	get method() {
		return this[INTERNALS].method;
	}
	get url() {
		return (0, import_url.format)(this[INTERNALS].parsedURL);
	}
	get headers() {
		return this[INTERNALS].headers;
	}
	get redirect() {
		return this[INTERNALS].redirect;
	}
	get signal() {
		return this[INTERNALS].signal;
	}
	clone() {
		return new Request(this);
	}
	get [Symbol.toStringTag]() {
		return 'Request';
	}
};
Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
	const { parsedURL } = request[INTERNALS];
	const headers = new Headers(request[INTERNALS].headers);
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}
	let contentLengthValue = null;
	if (request.body === null && /^(post|put)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body !== null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number' && !Number.isNaN(totalBytes)) {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch');
	}
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate,br');
	}
	let { agent } = request;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}
	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}
	const search = getSearch(parsedURL);
	const requestOptions = {
		path: parsedURL.pathname + search,
		pathname: parsedURL.pathname,
		hostname: parsedURL.hostname,
		protocol: parsedURL.protocol,
		port: parsedURL.port,
		hash: parsedURL.hash,
		search: parsedURL.search,
		query: parsedURL.query,
		href: parsedURL.href,
		method: request.method,
		headers: headers[Symbol.for('nodejs.util.inspect.custom')](),
		insecureHTTPParser: request.insecureHTTPParser,
		agent
	};
	return requestOptions;
};
var AbortError = class extends FetchBaseError {
	constructor(message, type = 'aborted') {
		super(message, type);
	}
};
var supportedSchemas = new Set(['data:', 'http:', 'https:']);
async function fetch2(url, options_) {
	return new Promise((resolve2, reject) => {
		const request = new Request(url, options_);
		const options2 = getNodeRequestOptions(request);
		if (!supportedSchemas.has(options2.protocol)) {
			throw new TypeError(
				`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(
					/:$/,
					''
				)}" is not supported.`
			);
		}
		if (options2.protocol === 'data:') {
			const data = src(request.url);
			const response2 = new Response2(data, { headers: { 'Content-Type': data.typeFull } });
			resolve2(response2);
			return;
		}
		const send = (options2.protocol === 'https:' ? import_https.default : import_http.default)
			.request;
		const { signal } = request;
		let response = null;
		const abort = () => {
			const error3 = new AbortError('The operation was aborted.');
			reject(error3);
			if (request.body && request.body instanceof import_stream.default.Readable) {
				request.body.destroy(error3);
			}
			if (!response || !response.body) {
				return;
			}
			response.body.emit('error', error3);
		};
		if (signal && signal.aborted) {
			abort();
			return;
		}
		const abortAndFinalize = () => {
			abort();
			finalize();
		};
		const request_ = send(options2);
		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}
		const finalize = () => {
			request_.abort();
			if (signal) {
				signal.removeEventListener('abort', abortAndFinalize);
			}
		};
		request_.on('error', (err) => {
			reject(
				new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err)
			);
			finalize();
		});
		request_.on('response', (response_) => {
			request_.setTimeout(0);
			const headers = fromRawHeaders(response_.rawHeaders);
			if (isRedirect(response_.statusCode)) {
				const location = headers.get('Location');
				const locationURL = location === null ? null : new URL(location, request.url);
				switch (request.redirect) {
					case 'error':
						reject(
							new FetchError(
								`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`,
								'no-redirect'
							)
						);
						finalize();
						return;
					case 'manual':
						if (locationURL !== null) {
							try {
								headers.set('Location', locationURL);
							} catch (error3) {
								reject(error3);
							}
						}
						break;
					case 'follow': {
						if (locationURL === null) {
							break;
						}
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}
						const requestOptions = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							size: request.size
						};
						if (
							response_.statusCode !== 303 &&
							request.body &&
							options_.body instanceof import_stream.default.Readable
						) {
							reject(
								new FetchError(
									'Cannot follow redirect with body being a readable stream',
									'unsupported-redirect'
								)
							);
							finalize();
							return;
						}
						if (
							response_.statusCode === 303 ||
							((response_.statusCode === 301 || response_.statusCode === 302) &&
								request.method === 'POST')
						) {
							requestOptions.method = 'GET';
							requestOptions.body = void 0;
							requestOptions.headers.delete('content-length');
						}
						resolve2(fetch2(new Request(locationURL, requestOptions)));
						finalize();
						return;
					}
				}
			}
			response_.once('end', () => {
				if (signal) {
					signal.removeEventListener('abort', abortAndFinalize);
				}
			});
			let body = (0, import_stream.pipeline)(
				response_,
				new import_stream.PassThrough(),
				(error3) => {
					reject(error3);
				}
			);
			if (process.version < 'v12.10') {
				response_.on('aborted', abortAndFinalize);
			}
			const responseOptions = {
				url: request.url,
				status: response_.statusCode,
				statusText: response_.statusMessage,
				headers,
				size: request.size,
				counter: request.counter,
				highWaterMark: request.highWaterMark
			};
			const codings = headers.get('Content-Encoding');
			if (
				!request.compress ||
				request.method === 'HEAD' ||
				codings === null ||
				response_.statusCode === 204 ||
				response_.statusCode === 304
			) {
				response = new Response2(body, responseOptions);
				resolve2(response);
				return;
			}
			const zlibOptions = {
				flush: import_zlib.default.Z_SYNC_FLUSH,
				finishFlush: import_zlib.default.Z_SYNC_FLUSH
			};
			if (codings === 'gzip' || codings === 'x-gzip') {
				body = (0, import_stream.pipeline)(
					body,
					import_zlib.default.createGunzip(zlibOptions),
					(error3) => {
						reject(error3);
					}
				);
				response = new Response2(body, responseOptions);
				resolve2(response);
				return;
			}
			if (codings === 'deflate' || codings === 'x-deflate') {
				const raw = (0, import_stream.pipeline)(
					response_,
					new import_stream.PassThrough(),
					(error3) => {
						reject(error3);
					}
				);
				raw.once('data', (chunk) => {
					if ((chunk[0] & 15) === 8) {
						body = (0, import_stream.pipeline)(
							body,
							import_zlib.default.createInflate(),
							(error3) => {
								reject(error3);
							}
						);
					} else {
						body = (0, import_stream.pipeline)(
							body,
							import_zlib.default.createInflateRaw(),
							(error3) => {
								reject(error3);
							}
						);
					}
					response = new Response2(body, responseOptions);
					resolve2(response);
				});
				return;
			}
			if (codings === 'br') {
				body = (0, import_stream.pipeline)(
					body,
					import_zlib.default.createBrotliDecompress(),
					(error3) => {
						reject(error3);
					}
				);
				response = new Response2(body, responseOptions);
				resolve2(response);
				return;
			}
			response = new Response2(body, responseOptions);
			resolve2(response);
		});
		writeToStream(request_, request);
	});
}
globalThis.fetch = fetch2;
globalThis.Response = Response2;
globalThis.Request = Request;
globalThis.Headers = Headers;

// node_modules/@sveltejs/kit/dist/ssr.js
var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
	'<': '\\u003C',
	'>': '\\u003E',
	'/': '\\u002F',
	'\\': '\\\\',
	'\b': '\\b',
	'\f': '\\f',
	'\n': '\\n',
	'\r': '\\r',
	'	': '\\t',
	'\0': '\\0',
	'\u2028': '\\u2028',
	'\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
	var counts = new Map();
	function walk(thing) {
		if (typeof thing === 'function') {
			throw new Error('Cannot stringify a function');
		}
		if (counts.has(thing)) {
			counts.set(thing, counts.get(thing) + 1);
			return;
		}
		counts.set(thing, 1);
		if (!isPrimitive(thing)) {
			var type = getType(thing);
			switch (type) {
				case 'Number':
				case 'String':
				case 'Boolean':
				case 'Date':
				case 'RegExp':
					return;
				case 'Array':
					thing.forEach(walk);
					break;
				case 'Set':
				case 'Map':
					Array.from(thing).forEach(walk);
					break;
				default:
					var proto = Object.getPrototypeOf(thing);
					if (
						proto !== Object.prototype &&
						proto !== null &&
						Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames
					) {
						throw new Error('Cannot stringify arbitrary non-POJOs');
					}
					if (Object.getOwnPropertySymbols(thing).length > 0) {
						throw new Error('Cannot stringify POJOs with symbolic keys');
					}
					Object.keys(thing).forEach(function (key) {
						return walk(thing[key]);
					});
			}
		}
	}
	walk(value);
	var names = new Map();
	Array.from(counts)
		.filter(function (entry) {
			return entry[1] > 1;
		})
		.sort(function (a, b) {
			return b[1] - a[1];
		})
		.forEach(function (entry, i) {
			names.set(entry[0], getName(i));
		});
	function stringify(thing) {
		if (names.has(thing)) {
			return names.get(thing);
		}
		if (isPrimitive(thing)) {
			return stringifyPrimitive(thing);
		}
		var type = getType(thing);
		switch (type) {
			case 'Number':
			case 'String':
			case 'Boolean':
				return 'Object(' + stringify(thing.valueOf()) + ')';
			case 'RegExp':
				return 'new RegExp(' + stringifyString(thing.source) + ', "' + thing.flags + '")';
			case 'Date':
				return 'new Date(' + thing.getTime() + ')';
			case 'Array':
				var members = thing.map(function (v, i) {
					return i in thing ? stringify(v) : '';
				});
				var tail = thing.length === 0 || thing.length - 1 in thing ? '' : ',';
				return '[' + members.join(',') + tail + ']';
			case 'Set':
			case 'Map':
				return 'new ' + type + '([' + Array.from(thing).map(stringify).join(',') + '])';
			default:
				var obj =
					'{' +
					Object.keys(thing)
						.map(function (key) {
							return safeKey(key) + ':' + stringify(thing[key]);
						})
						.join(',') +
					'}';
				var proto = Object.getPrototypeOf(thing);
				if (proto === null) {
					return Object.keys(thing).length > 0
						? 'Object.assign(Object.create(null),' + obj + ')'
						: 'Object.create(null)';
				}
				return obj;
		}
	}
	var str = stringify(value);
	if (names.size) {
		var params_1 = [];
		var statements_1 = [];
		var values_1 = [];
		names.forEach(function (name, thing) {
			params_1.push(name);
			if (isPrimitive(thing)) {
				values_1.push(stringifyPrimitive(thing));
				return;
			}
			var type = getType(thing);
			switch (type) {
				case 'Number':
				case 'String':
				case 'Boolean':
					values_1.push('Object(' + stringify(thing.valueOf()) + ')');
					break;
				case 'RegExp':
					values_1.push(thing.toString());
					break;
				case 'Date':
					values_1.push('new Date(' + thing.getTime() + ')');
					break;
				case 'Array':
					values_1.push('Array(' + thing.length + ')');
					thing.forEach(function (v, i) {
						statements_1.push(name + '[' + i + ']=' + stringify(v));
					});
					break;
				case 'Set':
					values_1.push('new Set');
					statements_1.push(
						name +
							'.' +
							Array.from(thing)
								.map(function (v) {
									return 'add(' + stringify(v) + ')';
								})
								.join('.')
					);
					break;
				case 'Map':
					values_1.push('new Map');
					statements_1.push(
						name +
							'.' +
							Array.from(thing)
								.map(function (_a) {
									var k = _a[0],
										v = _a[1];
									return 'set(' + stringify(k) + ', ' + stringify(v) + ')';
								})
								.join('.')
					);
					break;
				default:
					values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
					Object.keys(thing).forEach(function (key) {
						statements_1.push('' + name + safeProp(key) + '=' + stringify(thing[key]));
					});
			}
		});
		statements_1.push('return ' + str);
		return (
			'(function(' +
			params_1.join(',') +
			'){' +
			statements_1.join(';') +
			'}(' +
			values_1.join(',') +
			'))'
		);
	} else {
		return str;
	}
}
function getName(num) {
	var name = '';
	do {
		name = chars[num % chars.length] + name;
		num = ~~(num / chars.length) - 1;
	} while (num >= 0);
	return reserved.test(name) ? name + '_' : name;
}
function isPrimitive(thing) {
	return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
	if (typeof thing === 'string') return stringifyString(thing);
	if (thing === void 0) return 'void 0';
	if (thing === 0 && 1 / thing < 0) return '-0';
	var str = String(thing);
	if (typeof thing === 'number') return str.replace(/^(-)?0\./, '$1.');
	return str;
}
function getType(thing) {
	return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
	return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
	return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
	return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
	return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key)
		? '.' + key
		: '[' + escapeUnsafeChars(JSON.stringify(key)) + ']';
}
function stringifyString(str) {
	var result = '"';
	for (var i = 0; i < str.length; i += 1) {
		var char = str.charAt(i);
		var code = char.charCodeAt(0);
		if (char === '"') {
			result += '\\"';
		} else if (char in escaped$1) {
			result += escaped$1[char];
		} else if (code >= 55296 && code <= 57343) {
			var next = str.charCodeAt(i + 1);
			if (code <= 56319 && next >= 56320 && next <= 57343) {
				result += char + str[++i];
			} else {
				result += '\\u' + code.toString(16).toUpperCase();
			}
		} else {
			result += char;
		}
	}
	result += '"';
	return result;
}
function noop() {}
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
var subscriber_queue = [];
function writable(value, start = noop) {
	let stop;
	const subscribers = [];
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				const run_queue = !subscriber_queue.length;
				for (let i = 0; i < subscribers.length; i += 1) {
					const s2 = subscribers[i];
					s2[1]();
					subscriber_queue.push(s2, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}
	function update(fn) {
		set(fn(value));
	}
	function subscribe(run2, invalidate = noop) {
		const subscriber = [run2, invalidate];
		subscribers.push(subscriber);
		if (subscribers.length === 1) {
			stop = start(set) || noop;
		}
		run2(value);
		return () => {
			const index2 = subscribers.indexOf(subscriber);
			if (index2 !== -1) {
				subscribers.splice(index2, 1);
			}
			if (subscribers.length === 0) {
				stop();
				stop = null;
			}
		};
	}
	return { set, update, subscribe };
}
function hash(value) {
	let hash2 = 5381;
	let i = value.length;
	if (typeof value === 'string') {
		while (i) hash2 = (hash2 * 33) ^ value.charCodeAt(--i);
	} else {
		while (i) hash2 = (hash2 * 33) ^ value[--i];
	}
	return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
	options: options2,
	$session,
	page_config,
	status,
	error: error3,
	branch,
	page
}) {
	const css2 = new Set(options2.entry.css);
	const js = new Set(options2.entry.js);
	const styles = new Set();
	const serialized_data = [];
	let rendered;
	let is_private = false;
	let maxage;
	if (error3) {
		error3.stack = options2.get_stack(error3);
	}
	if (branch) {
		branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
			if (node.css) node.css.forEach((url) => css2.add(url));
			if (node.js) node.js.forEach((url) => js.add(url));
			if (node.styles) node.styles.forEach((content) => styles.add(content));
			if (fetched && page_config.hydrate) serialized_data.push(...fetched);
			if (uses_credentials) is_private = true;
			maxage = loaded.maxage;
		});
		const session = writable($session);
		const props = {
			stores: {
				page: writable(null),
				navigating: writable(null),
				session
			},
			page,
			components: branch.map(({ node }) => node.module.default)
		};
		for (let i = 0; i < branch.length; i += 1) {
			props[`props_${i}`] = await branch[i].loaded.props;
		}
		let session_tracking_active = false;
		const unsubscribe = session.subscribe(() => {
			if (session_tracking_active) is_private = true;
		});
		session_tracking_active = true;
		try {
			rendered = options2.root.render(props);
		} finally {
			unsubscribe();
		}
	} else {
		rendered = { head: '', html: '', css: { code: '', map: null } };
	}
	const include_js = page_config.router || page_config.hydrate;
	if (!include_js) js.clear();
	const links = options2.amp
		? styles.size > 0 || rendered.css.code.length > 0
			? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join('\n')}</style>`
			: ''
		: [
				...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
				...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
		  ].join('\n		');
	let init2 = '';
	if (options2.amp) {
		init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
	} else if (include_js) {
		init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : 'document.body'},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
					throw new Error(`Failed to serialize session data: ${error4.message}`);
				})},
				host: ${page && page.host ? s$1(page.host) : 'location.host'},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${
					page_config.ssr && page_config.hydrate
						? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(',\n						')}
					],
					page: {
						host: ${page.host ? s$1(page.host) : 'location.host'}, // TODO this is redundant
						path: ${s$1(page.path)},
						query: new URLSearchParams(${s$1(page.query.toString())}),
						params: ${s$1(page.params)}
					}
				}`
						: 'null'
				}
			});
		<\/script>`;
	}
	const head = [
		rendered.head,
		styles.size && !options2.amp
			? `<style data-svelte>${Array.from(styles).join('\n')}</style>`
			: '',
		links,
		init2
	].join('\n\n		');
	const body = options2.amp
		? rendered.html
		: `${rendered.html}

			${serialized_data
				.map(({ url, body: body2, json }) => {
					return body2
						? `<script type="svelte-data" url="${url}" body="${hash(body2)}">${json}<\/script>`
						: `<script type="svelte-data" url="${url}">${json}<\/script>`;
				})
				.join('\n\n			')}
		`.replace(/^\t{2}/gm, '');
	const headers = {
		'content-type': 'text/html'
	};
	if (maxage) {
		headers['cache-control'] = `${is_private ? 'private' : 'public'}, max-age=${maxage}`;
	}
	if (!options2.floc) {
		headers['permissions-policy'] = 'interest-cohort=()';
	}
	return {
		status,
		headers,
		body: options2.template({ head, body })
	};
}
function try_serialize(data, fail) {
	try {
		return devalue(data);
	} catch (err) {
		if (fail) fail(err);
		return null;
	}
}
function serialize_error(error3) {
	if (!error3) return null;
	let serialized = try_serialize(error3);
	if (!serialized) {
		const { name, message, stack } = error3;
		serialized = try_serialize({ name, message, stack });
	}
	if (!serialized) {
		serialized = '{}';
	}
	return serialized;
}
function normalize(loaded) {
	if (loaded.error) {
		const error3 = typeof loaded.error === 'string' ? new Error(loaded.error) : loaded.error;
		const status = loaded.status;
		if (!(error3 instanceof Error)) {
			return {
				status: 500,
				error: new Error(
					`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`
				)
			};
		}
		if (!status || status < 400 || status > 599) {
			console.warn(
				'"error" returned from load() without a valid status code \u2014 defaulting to 500'
			);
			return { status: 500, error: error3 };
		}
		return { status, error: error3 };
	}
	if (loaded.redirect) {
		if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
			return {
				status: 500,
				error: new Error(
					'"redirect" property returned from load() must be accompanied by a 3xx status code'
				)
			};
		}
		if (typeof loaded.redirect !== 'string') {
			return {
				status: 500,
				error: new Error('"redirect" property returned from load() must be a string')
			};
		}
	}
	return loaded;
}
function resolve(base, path) {
	const baseparts = path[0] === '/' ? [] : base.slice(1).split('/');
	const pathparts = path[0] === '/' ? path.slice(1).split('/') : path.split('/');
	baseparts.pop();
	for (let i = 0; i < pathparts.length; i += 1) {
		const part = pathparts[i];
		if (part === '.') continue;
		else if (part === '..') baseparts.pop();
		else baseparts.push(part);
	}
	return `/${baseparts.join('/')}`;
}
var s = JSON.stringify;
async function load_node({
	request,
	options: options2,
	state,
	route,
	page,
	node,
	$session,
	context,
	is_leaf,
	is_error,
	status,
	error: error3
}) {
	const { module: module2 } = node;
	let uses_credentials = false;
	const fetched = [];
	let loaded;
	if (module2.load) {
		const load_input = {
			page,
			get session() {
				uses_credentials = true;
				return $session;
			},
			fetch: async (resource, opts = {}) => {
				let url;
				if (typeof resource === 'string') {
					url = resource;
				} else {
					url = resource.url;
					opts = {
						method: resource.method,
						headers: resource.headers,
						body: resource.body,
						mode: resource.mode,
						credentials: resource.credentials,
						cache: resource.cache,
						redirect: resource.redirect,
						referrer: resource.referrer,
						integrity: resource.integrity,
						...opts
					};
				}
				if (options2.read && url.startsWith(options2.paths.assets)) {
					url = url.replace(options2.paths.assets, '');
				}
				if (url.startsWith('//')) {
					throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
				}
				let response;
				if (/^[a-zA-Z]+:/.test(url)) {
					response = await fetch(url, opts);
				} else {
					const [path, search] = url.split('?');
					const resolved = resolve(request.path, path);
					const filename = resolved.slice(1);
					const filename_html = `${filename}/index.html`;
					const asset = options2.manifest.assets.find(
						(d) => d.file === filename || d.file === filename_html
					);
					if (asset) {
						if (options2.read) {
							response = new Response(options2.read(asset.file), {
								headers: {
									'content-type': asset.type
								}
							});
						} else {
							response = await fetch(`http://${page.host}/${asset.file}`, opts);
						}
					}
					if (!response) {
						const headers = { ...opts.headers };
						if (opts.credentials !== 'omit') {
							uses_credentials = true;
							headers.cookie = request.headers.cookie;
							if (!headers.authorization) {
								headers.authorization = request.headers.authorization;
							}
						}
						if (opts.body && typeof opts.body !== 'string') {
							throw new Error('Request body must be a string');
						}
						const rendered = await respond(
							{
								host: request.host,
								method: opts.method || 'GET',
								headers,
								path: resolved,
								rawBody: opts.body,
								query: new URLSearchParams(search)
							},
							options2,
							{
								fetched: url,
								initiator: route
							}
						);
						if (rendered) {
							if (state.prerender) {
								state.prerender.dependencies.set(resolved, rendered);
							}
							response = new Response(rendered.body, {
								status: rendered.status,
								headers: rendered.headers
							});
						}
					}
				}
				if (response) {
					const proxy = new Proxy(response, {
						get(response2, key, receiver) {
							async function text() {
								const body = await response2.text();
								const headers = {};
								for (const [key2, value] of response2.headers) {
									if (key2 !== 'etag' && key2 !== 'set-cookie') headers[key2] = value;
								}
								if (!opts.body || typeof opts.body === 'string') {
									fetched.push({
										url,
										body: opts.body,
										json: `{"status":${response2.status},"statusText":${s(
											response2.statusText
										)},"headers":${s(headers)},"body":${escape(body)}}`
									});
								}
								return body;
							}
							if (key === 'text') {
								return text;
							}
							if (key === 'json') {
								return async () => {
									return JSON.parse(await text());
								};
							}
							return Reflect.get(response2, key, response2);
						}
					});
					return proxy;
				}
				return (
					response ||
					new Response('Not found', {
						status: 404
					})
				);
			},
			context: { ...context }
		};
		if (is_error) {
			load_input.status = status;
			load_input.error = error3;
		}
		loaded = await module2.load.call(null, load_input);
	} else {
		loaded = {};
	}
	if (!loaded && is_leaf && !is_error) return;
	return {
		node,
		loaded: normalize(loaded),
		context: loaded.context || context,
		fetched,
		uses_credentials
	};
}
var escaped = {
	'<': '\\u003C',
	'>': '\\u003E',
	'/': '\\u002F',
	'\\': '\\\\',
	'\b': '\\b',
	'\f': '\\f',
	'\n': '\\n',
	'\r': '\\r',
	'	': '\\t',
	'\0': '\\0',
	'\u2028': '\\u2028',
	'\u2029': '\\u2029'
};
function escape(str) {
	let result = '"';
	for (let i = 0; i < str.length; i += 1) {
		const char = str.charAt(i);
		const code = char.charCodeAt(0);
		if (char === '"') {
			result += '\\"';
		} else if (char in escaped) {
			result += escaped[char];
		} else if (code >= 55296 && code <= 57343) {
			const next = str.charCodeAt(i + 1);
			if (code <= 56319 && next >= 56320 && next <= 57343) {
				result += char + str[++i];
			} else {
				result += `\\u${code.toString(16).toUpperCase()}`;
			}
		} else {
			result += char;
		}
	}
	result += '"';
	return result;
}
async function respond_with_error({
	request,
	options: options2,
	state,
	$session,
	status,
	error: error3
}) {
	const default_layout = await options2.load_component(options2.manifest.layout);
	const default_error = await options2.load_component(options2.manifest.error);
	const page = {
		host: request.host,
		path: request.path,
		query: request.query,
		params: {}
	};
	const loaded = await load_node({
		request,
		options: options2,
		state,
		route: null,
		page,
		node: default_layout,
		$session,
		context: {},
		is_leaf: false,
		is_error: false
	});
	const branch = [
		loaded,
		await load_node({
			request,
			options: options2,
			state,
			route: null,
			page,
			node: default_error,
			$session,
			context: loaded.context,
			is_leaf: false,
			is_error: true,
			status,
			error: error3
		})
	];
	try {
		return await render_response({
			options: options2,
			$session,
			page_config: {
				hydrate: options2.hydrate,
				router: options2.router,
				ssr: options2.ssr
			},
			status,
			error: error3,
			branch,
			page
		});
	} catch (error4) {
		options2.handle_error(error4);
		return {
			status: 500,
			headers: {},
			body: error4.stack
		};
	}
}
async function respond$1({ request, options: options2, state, $session, route }) {
	const match = route.pattern.exec(request.path);
	const params = route.params(match);
	const page = {
		host: request.host,
		path: request.path,
		query: request.query,
		params
	};
	let nodes;
	try {
		nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
	} catch (error4) {
		options2.handle_error(error4);
		return await respond_with_error({
			request,
			options: options2,
			state,
			$session,
			status: 500,
			error: error4
		});
	}
	const leaf = nodes[nodes.length - 1].module;
	const page_config = {
		ssr: 'ssr' in leaf ? leaf.ssr : options2.ssr,
		router: 'router' in leaf ? leaf.router : options2.router,
		hydrate: 'hydrate' in leaf ? leaf.hydrate : options2.hydrate
	};
	if (!leaf.prerender && state.prerender && !state.prerender.all) {
		return {
			status: 204,
			headers: {},
			body: null
		};
	}
	let branch;
	let status = 200;
	let error3;
	ssr: if (page_config.ssr) {
		let context = {};
		branch = [];
		for (let i = 0; i < nodes.length; i += 1) {
			const node = nodes[i];
			let loaded;
			if (node) {
				try {
					loaded = await load_node({
						request,
						options: options2,
						state,
						route,
						page,
						node,
						$session,
						context,
						is_leaf: i === nodes.length - 1,
						is_error: false
					});
					if (!loaded) return;
					if (loaded.loaded.redirect) {
						return {
							status: loaded.loaded.status,
							headers: {
								location: encodeURI(loaded.loaded.redirect)
							}
						};
					}
					if (loaded.loaded.error) {
						({ status, error: error3 } = loaded.loaded);
					}
				} catch (e) {
					options2.handle_error(e);
					status = 500;
					error3 = e;
				}
				if (error3) {
					while (i--) {
						if (route.b[i]) {
							const error_node = await options2.load_component(route.b[i]);
							let error_loaded;
							let node_loaded;
							let j = i;
							while (!(node_loaded = branch[j])) {
								j -= 1;
							}
							try {
								error_loaded = await load_node({
									request,
									options: options2,
									state,
									route,
									page,
									node: error_node,
									$session,
									context: node_loaded.context,
									is_leaf: false,
									is_error: true,
									status,
									error: error3
								});
								if (error_loaded.loaded.error) {
									continue;
								}
								branch = branch.slice(0, j + 1).concat(error_loaded);
								break ssr;
							} catch (e) {
								options2.handle_error(e);
								continue;
							}
						}
					}
					return await respond_with_error({
						request,
						options: options2,
						state,
						$session,
						status,
						error: error3
					});
				}
			}
			branch.push(loaded);
			if (loaded && loaded.loaded.context) {
				context = {
					...context,
					...loaded.loaded.context
				};
			}
		}
	}
	try {
		return await render_response({
			options: options2,
			$session,
			page_config,
			status,
			error: error3,
			branch: branch && branch.filter(Boolean),
			page
		});
	} catch (error4) {
		options2.handle_error(error4);
		return await respond_with_error({
			request,
			options: options2,
			state,
			$session,
			status: 500,
			error: error4
		});
	}
}
async function render_page(request, route, options2, state) {
	if (state.initiator === route) {
		return {
			status: 404,
			headers: {},
			body: `Not found: ${request.path}`
		};
	}
	const $session = await options2.hooks.getSession(request);
	if (route) {
		const response = await respond$1({
			request,
			options: options2,
			state,
			$session,
			route
		});
		if (response) {
			return response;
		}
		if (state.fetched) {
			return {
				status: 500,
				headers: {},
				body: `Bad request in load function: failed to fetch ${state.fetched}`
			};
		}
	} else {
		return await respond_with_error({
			request,
			options: options2,
			state,
			$session,
			status: 404,
			error: new Error(`Not found: ${request.path}`)
		});
	}
}
function lowercase_keys(obj) {
	const clone2 = {};
	for (const key in obj) {
		clone2[key.toLowerCase()] = obj[key];
	}
	return clone2;
}
function error(body) {
	return {
		status: 500,
		body,
		headers: {}
	};
}
async function render_route(request, route) {
	const mod = await route.load();
	const handler = mod[request.method.toLowerCase().replace('delete', 'del')];
	if (handler) {
		const match = route.pattern.exec(request.path);
		const params = route.params(match);
		const response = await handler({ ...request, params });
		if (response) {
			if (typeof response !== 'object') {
				return error(
					`Invalid response from route ${request.path}: expected an object, got ${typeof response}`
				);
			}
			let { status = 200, body, headers = {} } = response;
			headers = lowercase_keys(headers);
			const type = headers['content-type'];
			if (type === 'application/octet-stream' && !(body instanceof Uint8Array)) {
				return error(
					`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`
				);
			}
			if (body instanceof Uint8Array && type !== 'application/octet-stream') {
				return error(
					`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`
				);
			}
			let normalized_body;
			if (typeof body === 'object' && (!type || type === 'application/json')) {
				headers = { ...headers, 'content-type': 'application/json' };
				normalized_body = JSON.stringify(body);
			} else {
				normalized_body = body;
			}
			return { status, body: normalized_body, headers };
		}
	}
}
function read_only_form_data() {
	const map = new Map();
	return {
		append(key, value) {
			if (map.has(key)) {
				map.get(key).push(value);
			} else {
				map.set(key, [value]);
			}
		},
		data: new ReadOnlyFormData(map)
	};
}
var ReadOnlyFormData = class {
	#map;
	constructor(map) {
		this.#map = map;
	}
	get(key) {
		const value = this.#map.get(key);
		return value && value[0];
	}
	getAll(key) {
		return this.#map.get(key);
	}
	has(key) {
		return this.#map.has(key);
	}
	*[Symbol.iterator]() {
		for (const [key, value] of this.#map) {
			for (let i = 0; i < value.length; i += 1) {
				yield [key, value[i]];
			}
		}
	}
	*entries() {
		for (const [key, value] of this.#map) {
			for (let i = 0; i < value.length; i += 1) {
				yield [key, value[i]];
			}
		}
	}
	*keys() {
		for (const [key, value] of this.#map) {
			for (let i = 0; i < value.length; i += 1) {
				yield key;
			}
		}
	}
	*values() {
		for (const [, value] of this.#map) {
			for (let i = 0; i < value.length; i += 1) {
				yield value;
			}
		}
	}
};
function parse_body(raw, headers) {
	if (!raw) return raw;
	const [type, ...directives] = headers['content-type'].split(/;\s*/);
	if (typeof raw === 'string') {
		switch (type) {
			case 'text/plain':
				return raw;
			case 'application/json':
				return JSON.parse(raw);
			case 'application/x-www-form-urlencoded':
				return get_urlencoded(raw);
			case 'multipart/form-data': {
				const boundary = directives.find((directive) => directive.startsWith('boundary='));
				if (!boundary) throw new Error('Missing boundary');
				return get_multipart(raw, boundary.slice('boundary='.length));
			}
			default:
				throw new Error(`Invalid Content-Type ${type}`);
		}
	}
	return raw;
}
function get_urlencoded(text) {
	const { data, append } = read_only_form_data();
	text
		.replace(/\+/g, ' ')
		.split('&')
		.forEach((str) => {
			const [key, value] = str.split('=');
			append(decodeURIComponent(key), decodeURIComponent(value));
		});
	return data;
}
function get_multipart(text, boundary) {
	const parts = text.split(`--${boundary}`);
	const nope = () => {
		throw new Error('Malformed form data');
	};
	if (parts[0] !== '' || parts[parts.length - 1].trim() !== '--') {
		nope();
	}
	const { data, append } = read_only_form_data();
	parts.slice(1, -1).forEach((part) => {
		const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
		const raw_headers = match[1];
		const body = match[2].trim();
		let key;
		raw_headers.split('\r\n').forEach((str) => {
			const [raw_header, ...raw_directives] = str.split('; ');
			let [name, value] = raw_header.split(': ');
			name = name.toLowerCase();
			const directives = {};
			raw_directives.forEach((raw_directive) => {
				const [name2, value2] = raw_directive.split('=');
				directives[name2] = JSON.parse(value2);
			});
			if (name === 'content-disposition') {
				if (value !== 'form-data') nope();
				if (directives.filename) {
					throw new Error('File upload is not yet implemented');
				}
				if (directives.name) {
					key = directives.name;
				}
			}
		});
		if (!key) nope();
		append(key, body);
	});
	return data;
}
async function respond(incoming, options2, state = {}) {
	if (incoming.path !== '/' && options2.trailing_slash !== 'ignore') {
		const has_trailing_slash = incoming.path.endsWith('/');
		if (
			(has_trailing_slash && options2.trailing_slash === 'never') ||
			(!has_trailing_slash &&
				options2.trailing_slash === 'always' &&
				!incoming.path.split('/').pop().includes('.'))
		) {
			const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + '/';
			const q = incoming.query.toString();
			return {
				status: 301,
				headers: {
					location: encodeURI(path + (q ? `?${q}` : ''))
				}
			};
		}
	}
	try {
		const headers = lowercase_keys(incoming.headers);
		return await options2.hooks.handle({
			request: {
				...incoming,
				headers,
				body: parse_body(incoming.rawBody, headers),
				params: null,
				locals: {}
			},
			resolve: async (request) => {
				if (state.prerender && state.prerender.fallback) {
					return await render_response({
						options: options2,
						$session: await options2.hooks.getSession(request),
						page_config: { ssr: false, router: true, hydrate: true },
						status: 200,
						error: null,
						branch: [],
						page: null
					});
				}
				for (const route of options2.manifest.routes) {
					if (!route.pattern.test(request.path)) continue;
					const response =
						route.type === 'endpoint'
							? await render_route(request, route)
							: await render_page(request, route, options2, state);
					if (response) {
						if (response.status === 200) {
							if (!/(no-store|immutable)/.test(response.headers['cache-control'])) {
								const etag = `"${hash(response.body)}"`;
								if (request.headers['if-none-match'] === etag) {
									return {
										status: 304,
										headers: {},
										body: null
									};
								}
								response.headers['etag'] = etag;
							}
						}
						return response;
					}
				}
				return await render_page(request, null, options2, state);
			}
		});
	} catch (e) {
		options2.handle_error(e);
		return {
			status: 500,
			headers: {},
			body: options2.dev ? e.stack : e.message
		};
	}
}

// node_modules/svelte/internal/index.mjs
function noop2() {}
function run(fn) {
	return fn();
}
function blank_object() {
	return Object.create(null);
}
function run_all(fns) {
	fns.forEach(run);
}
function is_function(thing) {
	return typeof thing === 'function';
}
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}
var tasks = new Set();
var active_docs = new Set();
var current_component;
function set_current_component(component) {
	current_component = component;
}
function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
	get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
	get_current_component().$$.context.set(key, context);
}
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals =
	typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : global;
var boolean_attributes = new Set([
	'allowfullscreen',
	'allowpaymentrequest',
	'async',
	'autofocus',
	'autoplay',
	'checked',
	'controls',
	'default',
	'defer',
	'disabled',
	'formnovalidate',
	'hidden',
	'ismap',
	'loop',
	'multiple',
	'muted',
	'nomodule',
	'novalidate',
	'open',
	'playsinline',
	'readonly',
	'required',
	'reversed',
	'selected'
]);
var escaped2 = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};
function escape2(html) {
	return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
var missing_component = {
	$$render: () => ''
};
function validate_component(component, name) {
	if (!component || !component.$$render) {
		if (name === 'svelte:component') name += ' this={...}';
		throw new Error(
			`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`
		);
	}
	return component;
}
var on_destroy;
function create_ssr_component(fn) {
	function $$render(result, props, bindings, slots, context) {
		const parent_component = current_component;
		const $$ = {
			on_destroy,
			context: new Map(parent_component ? parent_component.$$.context : context || []),
			on_mount: [],
			before_update: [],
			after_update: [],
			callbacks: blank_object()
		};
		set_current_component({ $$ });
		const html = fn(result, props, bindings, slots);
		set_current_component(parent_component);
		return html;
	}
	return {
		render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
			on_destroy = [];
			const result = { title: '', head: '', css: new Set() };
			const html = $$render(result, props, {}, $$slots, context);
			run_all(on_destroy);
			return {
				html,
				css: {
					code: Array.from(result.css)
						.map((css2) => css2.code)
						.join('\n'),
					map: null
				},
				head: result.title + result.head
			};
		},
		$$render
	};
}
function add_attribute(name, value, boolean) {
	if (value == null || (boolean && !value)) return '';
	return ` ${name}${
		value === true
			? ''
			: `=${typeof value === 'string' ? JSON.stringify(escape2(value)) : `"${value}"`}`
	}`;
}
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}
var SvelteElement;
if (typeof HTMLElement === 'function') {
	SvelteElement = class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}
		connectedCallback() {
			const { on_mount } = this.$$;
			this.$$.on_disconnect = on_mount.map(run).filter(is_function);
			for (const key in this.$$.slotted) {
				this.appendChild(this.$$.slotted[key]);
			}
		}
		attributeChangedCallback(attr, _oldValue, newValue) {
			this[attr] = newValue;
		}
		disconnectedCallback() {
			run_all(this.$$.on_disconnect);
		}
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop2;
		}
		$on(type, callback) {
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index2 = callbacks.indexOf(callback);
				if (index2 !== -1) callbacks.splice(index2, 1);
			};
		}
		$set($$props) {
			if (this.$$set && !is_empty($$props)) {
				this.$$.skip_bound = true;
				this.$$set($$props);
				this.$$.skip_bound = false;
			}
		}
	};
}

// .svelte-kit/output/server/app.js
var css$3 = {
	code:
		'#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}',
	map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { stores } = $$props;
	let { page } = $$props;
	let { components } = $$props;
	let { props_0 = null } = $$props;
	let { props_1 = null } = $$props;
	let { props_2 = null } = $$props;
	setContext('__svelte__', stores);
	afterUpdate(stores.page.notify);
	let mounted = false;
	let navigated = false;
	let title = null;
	onMount(() => {
		const unsubscribe = stores.page.subscribe(() => {
			if (mounted) {
				navigated = true;
				title = document.title || 'untitled page';
			}
		});
		mounted = true;
		return unsubscribe;
	});
	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
		$$bindings.stores(stores);
	if ($$props.page === void 0 && $$bindings.page && page !== void 0) $$bindings.page(page);
	if ($$props.components === void 0 && $$bindings.components && components !== void 0)
		$$bindings.components(components);
	if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
		$$bindings.props_0(props_0);
	if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
		$$bindings.props_1(props_1);
	if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
		$$bindings.props_2(props_2);
	$$result.css.add(css$3);
	{
		stores.page.set(page);
	}
	return `


${validate_component(components[0] || missing_component, 'svelte:component').$$render(
	$$result,
	Object.assign(props_0 || {}),
	{},
	{
		default: () =>
			`${
				components[1]
					? `${validate_component(components[1] || missing_component, 'svelte:component').$$render(
							$$result,
							Object.assign(props_1 || {}),
							{},
							{
								default: () =>
									`${
										components[2]
											? `${validate_component(
													components[2] || missing_component,
													'svelte:component'
											  ).$$render($$result, Object.assign(props_2 || {}), {}, {})}`
											: ``
									}`
							}
					  )}`
					: ``
			}`
	}
)}

${
	mounted
		? `<div id="${'svelte-announcer'}" aria-live="${'assertive'}" aria-atomic="${'true'}" class="${'svelte-1j55zn5'}">${
				navigated ? `${escape2(title)}` : ``
		  }</div>`
		: ``
}`;
});
function set_paths(paths) {}
function set_prerendering(value) {}
var user_hooks = /* @__PURE__ */ Object.freeze({
	__proto__: null,
	[Symbol.toStringTag]: 'Module'
});
var template = ({ head, body }) =>
	'<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' +
	head +
	'\n	</head>\n	<body>\n		<div id="svelte">' +
	body +
	'</div>\n	</body>\n</html>\n';
var options = null;
function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);
	options = {
		amp: false,
		dev: false,
		entry: {
			file: '/./_app/start-64e2a5c9.js',
			css: ['/./_app/assets/start-a8cd1609.css'],
			js: ['/./_app/start-64e2a5c9.js', '/./_app/chunks/vendor-dc4178ae.js']
		},
		fetched: void 0,
		floc: false,
		get_component_path: (id) => '/./_app/' + entry_lookup[id],
		get_stack: (error22) => String(error22),
		handle_error: (error22) => {
			console.error(error22.stack);
			error22.stack = options.get_stack(error22);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: void 0,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root: Root,
		router: true,
		ssr: true,
		target: '#svelte',
		template,
		trailing_slash: 'never'
	};
}
var empty = () => ({});
var manifest = {
	assets: [
		{ file: 'assets/cards/10C.svg', size: 1899, type: 'image/svg+xml' },
		{ file: 'assets/cards/10D.svg', size: 1756, type: 'image/svg+xml' },
		{ file: 'assets/cards/10H.svg', size: 1826, type: 'image/svg+xml' },
		{ file: 'assets/cards/10S.svg', size: 1873, type: 'image/svg+xml' },
		{ file: 'assets/cards/2C.svg', size: 1398, type: 'image/svg+xml' },
		{ file: 'assets/cards/2D.svg', size: 1271, type: 'image/svg+xml' },
		{ file: 'assets/cards/2H.svg', size: 1341, type: 'image/svg+xml' },
		{ file: 'assets/cards/2S.svg', size: 1388, type: 'image/svg+xml' },
		{ file: 'assets/cards/3C.svg', size: 1485, type: 'image/svg+xml' },
		{ file: 'assets/cards/3D.svg', size: 1358, type: 'image/svg+xml' },
		{ file: 'assets/cards/3H.svg', size: 1428, type: 'image/svg+xml' },
		{ file: 'assets/cards/3S.svg', size: 1475, type: 'image/svg+xml' },
		{ file: 'assets/cards/4C.svg', size: 1487, type: 'image/svg+xml' },
		{ file: 'assets/cards/4D.svg', size: 1360, type: 'image/svg+xml' },
		{ file: 'assets/cards/4H.svg', size: 1430, type: 'image/svg+xml' },
		{ file: 'assets/cards/4S.svg', size: 1477, type: 'image/svg+xml' },
		{ file: 'assets/cards/5C.svg', size: 1618, type: 'image/svg+xml' },
		{ file: 'assets/cards/5D.svg', size: 1491, type: 'image/svg+xml' },
		{ file: 'assets/cards/5H.svg', size: 1561, type: 'image/svg+xml' },
		{ file: 'assets/cards/5S.svg', size: 1608, type: 'image/svg+xml' },
		{ file: 'assets/cards/6C.svg', size: 1670, type: 'image/svg+xml' },
		{ file: 'assets/cards/6D.svg', size: 1543, type: 'image/svg+xml' },
		{ file: 'assets/cards/6H.svg', size: 1613, type: 'image/svg+xml' },
		{ file: 'assets/cards/6S.svg', size: 1660, type: 'image/svg+xml' },
		{ file: 'assets/cards/7C.svg', size: 1665, type: 'image/svg+xml' },
		{ file: 'assets/cards/7D.svg', size: 1537, type: 'image/svg+xml' },
		{ file: 'assets/cards/7H.svg', size: 1607, type: 'image/svg+xml' },
		{ file: 'assets/cards/7S.svg', size: 1654, type: 'image/svg+xml' },
		{ file: 'assets/cards/8C.svg', size: 1727, type: 'image/svg+xml' },
		{ file: 'assets/cards/8D.svg', size: 1598, type: 'image/svg+xml' },
		{ file: 'assets/cards/8H.svg', size: 1668, type: 'image/svg+xml' },
		{ file: 'assets/cards/8S.svg', size: 1715, type: 'image/svg+xml' },
		{ file: 'assets/cards/9C.svg', size: 1865, type: 'image/svg+xml' },
		{ file: 'assets/cards/9D.svg', size: 1730, type: 'image/svg+xml' },
		{ file: 'assets/cards/9H.svg', size: 1800, type: 'image/svg+xml' },
		{ file: 'assets/cards/9S.svg', size: 1847, type: 'image/svg+xml' },
		{ file: 'assets/cards/AC.svg', size: 1299, type: 'image/svg+xml' },
		{ file: 'assets/cards/AD.svg', size: 1172, type: 'image/svg+xml' },
		{ file: 'assets/cards/AH.svg', size: 1242, type: 'image/svg+xml' },
		{ file: 'assets/cards/AS.svg', size: 1289, type: 'image/svg+xml' },
		{ file: 'assets/cards/JC.svg', size: 37553, type: 'image/svg+xml' },
		{ file: 'assets/cards/JD.svg', size: 32590, type: 'image/svg+xml' },
		{ file: 'assets/cards/JH.svg', size: 38816, type: 'image/svg+xml' },
		{ file: 'assets/cards/JS.svg', size: 43234, type: 'image/svg+xml' },
		{ file: 'assets/cards/KC.svg', size: 37674, type: 'image/svg+xml' },
		{ file: 'assets/cards/KD.svg', size: 33837, type: 'image/svg+xml' },
		{ file: 'assets/cards/KH.svg', size: 50882, type: 'image/svg+xml' },
		{ file: 'assets/cards/KS.svg', size: 63177, type: 'image/svg+xml' },
		{ file: 'assets/cards/QC.svg', size: 42503, type: 'image/svg+xml' },
		{ file: 'assets/cards/QD.svg', size: 43452, type: 'image/svg+xml' },
		{ file: 'assets/cards/QH.svg', size: 47597, type: 'image/svg+xml' },
		{ file: 'assets/cards/QS.svg', size: 38958, type: 'image/svg+xml' },
		{ file: 'assets/cards/back.svg', size: 537, type: 'image/svg+xml' },
		{ file: 'assets/minicards/10C.svg', size: 1693, type: 'image/svg+xml' },
		{ file: 'assets/minicards/10D.svg', size: 1599, type: 'image/svg+xml' },
		{ file: 'assets/minicards/10H.svg', size: 1621, type: 'image/svg+xml' },
		{ file: 'assets/minicards/10S.svg', size: 1644, type: 'image/svg+xml' },
		{ file: 'assets/minicards/2C.svg', size: 1089, type: 'image/svg+xml' },
		{ file: 'assets/minicards/2D.svg', size: 995, type: 'image/svg+xml' },
		{ file: 'assets/minicards/2H.svg', size: 1017, type: 'image/svg+xml' },
		{ file: 'assets/minicards/2S.svg', size: 1040, type: 'image/svg+xml' },
		{ file: 'assets/minicards/3C.svg', size: 1173, type: 'image/svg+xml' },
		{ file: 'assets/minicards/3D.svg', size: 1079, type: 'image/svg+xml' },
		{ file: 'assets/minicards/3H.svg', size: 1101, type: 'image/svg+xml' },
		{ file: 'assets/minicards/3S.svg', size: 1124, type: 'image/svg+xml' },
		{ file: 'assets/minicards/4C.svg', size: 1231, type: 'image/svg+xml' },
		{ file: 'assets/minicards/4D.svg', size: 1137, type: 'image/svg+xml' },
		{ file: 'assets/minicards/4H.svg', size: 1159, type: 'image/svg+xml' },
		{ file: 'assets/minicards/4S.svg', size: 1182, type: 'image/svg+xml' },
		{ file: 'assets/minicards/5C.svg', size: 1318, type: 'image/svg+xml' },
		{ file: 'assets/minicards/5D.svg', size: 1224, type: 'image/svg+xml' },
		{ file: 'assets/minicards/5H.svg', size: 1246, type: 'image/svg+xml' },
		{ file: 'assets/minicards/5S.svg', size: 1269, type: 'image/svg+xml' },
		{ file: 'assets/minicards/6C.svg', size: 1402, type: 'image/svg+xml' },
		{ file: 'assets/minicards/6D.svg', size: 1308, type: 'image/svg+xml' },
		{ file: 'assets/minicards/6H.svg', size: 1330, type: 'image/svg+xml' },
		{ file: 'assets/minicards/6S.svg', size: 1353, type: 'image/svg+xml' },
		{ file: 'assets/minicards/7C.svg', size: 1430, type: 'image/svg+xml' },
		{ file: 'assets/minicards/7D.svg', size: 1336, type: 'image/svg+xml' },
		{ file: 'assets/minicards/7H.svg', size: 1358, type: 'image/svg+xml' },
		{ file: 'assets/minicards/7S.svg', size: 1381, type: 'image/svg+xml' },
		{ file: 'assets/minicards/8C.svg', size: 1602, type: 'image/svg+xml' },
		{ file: 'assets/minicards/8D.svg', size: 1508, type: 'image/svg+xml' },
		{ file: 'assets/minicards/8H.svg', size: 1530, type: 'image/svg+xml' },
		{ file: 'assets/minicards/8S.svg', size: 1553, type: 'image/svg+xml' },
		{ file: 'assets/minicards/9C.svg', size: 1624, type: 'image/svg+xml' },
		{ file: 'assets/minicards/9D.svg', size: 1530, type: 'image/svg+xml' },
		{ file: 'assets/minicards/9H.svg', size: 1552, type: 'image/svg+xml' },
		{ file: 'assets/minicards/9S.svg', size: 1575, type: 'image/svg+xml' },
		{ file: 'assets/minicards/AC.svg', size: 977, type: 'image/svg+xml' },
		{ file: 'assets/minicards/AD.svg', size: 883, type: 'image/svg+xml' },
		{ file: 'assets/minicards/AH.svg', size: 905, type: 'image/svg+xml' },
		{ file: 'assets/minicards/AS.svg', size: 928, type: 'image/svg+xml' },
		{ file: 'assets/minicards/JC.svg', size: 1117, type: 'image/svg+xml' },
		{ file: 'assets/minicards/JD.svg', size: 1023, type: 'image/svg+xml' },
		{ file: 'assets/minicards/JH.svg', size: 1045, type: 'image/svg+xml' },
		{ file: 'assets/minicards/JS.svg', size: 1068, type: 'image/svg+xml' },
		{ file: 'assets/minicards/KC.svg', size: 1311, type: 'image/svg+xml' },
		{ file: 'assets/minicards/KD.svg', size: 1217, type: 'image/svg+xml' },
		{ file: 'assets/minicards/KH.svg', size: 1239, type: 'image/svg+xml' },
		{ file: 'assets/minicards/KS.svg', size: 1262, type: 'image/svg+xml' },
		{ file: 'assets/minicards/QC.svg', size: 1153, type: 'image/svg+xml' },
		{ file: 'assets/minicards/QD.svg', size: 1059, type: 'image/svg+xml' },
		{ file: 'assets/minicards/QH.svg', size: 1081, type: 'image/svg+xml' },
		{ file: 'assets/minicards/QS.svg', size: 1104, type: 'image/svg+xml' },
		{ file: 'assets/minicards/back.svg', size: 631, type: 'image/svg+xml' },
		{ file: 'favicon.png', size: 1571, type: 'image/png' }
	],
	layout: '.svelte-kit/build/components/layout.svelte',
	error: '.svelte-kit/build/components/error.svelte',
	routes: [
		{
			type: 'page',
			pattern: /^\/$/,
			params: empty,
			a: ['.svelte-kit/build/components/layout.svelte', 'src/routes/index.svelte'],
			b: ['.svelte-kit/build/components/error.svelte']
		}
	]
};
var get_hooks = (hooks) => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request))
});
var module_lookup = {
	'.svelte-kit/build/components/layout.svelte': () =>
		Promise.resolve().then(function () {
			return layout;
		}),
	'.svelte-kit/build/components/error.svelte': () =>
		Promise.resolve().then(function () {
			return error2;
		}),
	'src/routes/index.svelte': () =>
		Promise.resolve().then(function () {
			return index;
		})
};
var metadata_lookup = {
	'.svelte-kit/build/components/layout.svelte': {
		entry: '/./_app/layout.svelte-36f2602c.js',
		css: [],
		js: ['/./_app/layout.svelte-36f2602c.js', '/./_app/chunks/vendor-dc4178ae.js'],
		styles: null
	},
	'.svelte-kit/build/components/error.svelte': {
		entry: '/./_app/error.svelte-a9dd49ff.js',
		css: [],
		js: ['/./_app/error.svelte-a9dd49ff.js', '/./_app/chunks/vendor-dc4178ae.js'],
		styles: null
	},
	'src/routes/index.svelte': {
		entry: '/./_app/pages/index.svelte-52c2c24e.js',
		css: ['/./_app/assets/pages/index.svelte-114ccbb0.css'],
		js: ['/./_app/pages/index.svelte-52c2c24e.js', '/./_app/chunks/vendor-dc4178ae.js'],
		styles: null
	}
};
async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}
init({ paths: { base: '', assets: '/.' } });
function render(request, { prerender } = {}) {
	const host = request.headers['host'];
	return respond({ ...request, host }, options, { prerender });
}
var Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `${slots.default ? slots.default({}) : ``}`;
});
var layout = /* @__PURE__ */ Object.freeze({
	__proto__: null,
	[Symbol.toStringTag]: 'Module',
	default: Layout
});
function load({ error: error22, status }) {
	return { props: { error: error22, status } };
}
var Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { status } = $$props;
	let { error: error22 } = $$props;
	if ($$props.status === void 0 && $$bindings.status && status !== void 0)
		$$bindings.status(status);
	if ($$props.error === void 0 && $$bindings.error && error22 !== void 0) $$bindings.error(error22);
	return `<h1>${escape2(status)}</h1>

<p>${escape2(error22.message)}</p>


${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
	__proto__: null,
	[Symbol.toStringTag]: 'Module',
	default: Error2,
	load
});
var css$2 = {
	code:
		'.card.svelte-1umli0k{z-index:1}img.svelte-1umli0k{width:80px;height:auto;margin:10px;cursor:pointer;transition:0.3s filter ease-in-out}img.svelte-1umli0k:hover{filter:brightness(80%);transition:0.3s filter ease-in-out}',
	map:
		'{"version":3,"file":"Card.svelte","sources":["Card.svelte"],"sourcesContent":["<script>\\n\\texport let card;\\n\\texport let cardType = \'cards\';\\n\\n\\tfunction cardClicked() {\\n\\t\\talert(`${card} clicked`);\\n\\t}\\n</script>\\n\\n<div class=\\"card\\">\\n\\t<img\\n\\t\\ton:click={cardClicked}\\n\\t\\tsrc=\\"assets/{cardType}/{card}.svg\\"\\n\\t\\tclass=\\"{cardType}-{card}\\"\\n\\t\\talt={card}\\n\\t/>\\n</div>\\n\\n<style>\\n\\t.card {\\n\\t\\tz-index: 1;\\n\\t}\\n\\timg {\\n\\t\\twidth: 80px;\\n\\t\\theight: auto;\\n\\t\\tmargin: 10px;\\n\\t\\tcursor: pointer;\\n\\t\\ttransition: 0.3s filter ease-in-out;\\n\\t}\\n\\n\\timg:hover {\\n\\t\\tfilter: brightness(80%);\\n\\t\\ttransition: 0.3s filter ease-in-out;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmBC,KAAK,eAAC,CAAC,AACN,OAAO,CAAE,CAAC,AACX,CAAC,AACD,GAAG,eAAC,CAAC,AACJ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,IAAI,CAAC,MAAM,CAAC,WAAW,AACpC,CAAC,AAED,kBAAG,MAAM,AAAC,CAAC,AACV,MAAM,CAAE,WAAW,GAAG,CAAC,CACvB,UAAU,CAAE,IAAI,CAAC,MAAM,CAAC,WAAW,AACpC,CAAC"}'
};
create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { card } = $$props;
	let { cardType = 'cards' } = $$props;
	if ($$props.card === void 0 && $$bindings.card && card !== void 0) $$bindings.card(card);
	if ($$props.cardType === void 0 && $$bindings.cardType && cardType !== void 0)
		$$bindings.cardType(cardType);
	$$result.css.add(css$2);
	return `<div class="${'card svelte-1umli0k'}"><img src="${
		'assets/' + escape2(cardType) + '/' + escape2(card) + '.svg'
	}" class="${escape2(cardType) + '-' + escape2(card) + ' svelte-1umli0k'}"${add_attribute(
		'alt',
		card,
		0
	)}>
</div>`;
});
function getRandomInt(min, max) {
	min = Math.min(min, max);
	max = Math.max(min, max);
	return Math.floor(Math.random() * (max + 1 - min) + min);
}
var Node = class {
	constructor(value, next = null) {
		this.value = value;
		this.next = next || null;
	}
	toString() {
		return this.value;
	}
};
var LinkedList = class {
	constructor(...values) {
		this.head = null;
		this.tail = null;
		this._size = 0;
		this._rawOutput = false;
		if (values.length > 0)
			for (let idx = 0; idx < values.length; idx++) {
				let curr = new Node(values[idx]);
				if (idx == 0) this.head = curr;
				else this.tail.next = curr;
				this.tail = curr;
				this._size++;
			}
	}
	push(...items) {
		for (let item of items) {
			if (item == null) continue;
			let newItem = new Node(item);
			if (this.head == null) {
				this.head = newItem;
				this.tail = newItem;
				continue;
			}
			this.tail.next = newItem;
			this.tail = newItem;
		}
	}
	unshift(...items) {
		for (let item of items.reverse()) {
			let newItem = new Node(item);
			newItem.next = this.head;
			this.head = newItem;
		}
	}
	pop(val) {
		let valIdx = this.indexOf(val);
		return this.popAt(valIdx);
	}
	popAt(idx) {
		this['__#9427@#checkSize']();
		if (idx == 0) {
			let ret = this.head;
			if (this.head == null) return this.head;
			this.head = this.head.next;
			return ret.value;
		}
		let beforeItem = this.rawAt(idx - 1);
		let item = this.rawAt(idx);
		beforeItem.next = item.next;
		return item.value;
	}
	clearList() {
		this.head = null;
		this.tail = null;
		this._size = 0;
	}
	shuffle(flips = 1) {
		for (let i = 0; i < flips; i++) {
			let cutPoint =
				this.length / 2 + (Math.random() < 0.5 ? -1 : 1) * getRandomInt(0, this.length / 10);
			let left = new LinkedList();
			let right = new LinkedList();
			new Function(
				'list',
				'left',
				'right',
				`
                let lastOfUnevenPile = list.head${'.next'.repeat(cutPoint)}
    
                left.head = list.head;
                left.tail = lastOfUnevenPile;
    
                right.head = lastOfUnevenPile.next;
                right.tail = list.tail;
    
                lastOfUnevenPile.next = null;
                `
			)(this, left, right);
			this.clearList();
			while (left.length > 0 && right.length > 0)
				if (getRandomInt(0, 1) >= left.length / right.length / 2) this.push(right.popAt(0));
				else this.push(left.popAt(0));
			while (left.length > 0) this.push(left.popAt(0));
			while (right.length > 0) this.push(right.popAt(0));
		}
		console.log(this);
		this['__#9427@#checkSize']();
		return this;
	}
	toArray() {
		let curr = this.head;
		let ret = [];
		while (curr != null) {
			ret.push(curr.value);
			curr = curr.next;
		}
		return ret;
	}
	moveItemToArray(idx, target) {
		if (!Array.isArray(target)) throw new TypeError('Target is not an array');
		let item = this.rawAt(idx);
		target.push(item.value);
		this.popAt(idx);
		return target;
	}
	indexOf(val) {
		let curr = this.head;
		let idx = 0;
		while (curr != null) {
			if (curr.value === val) return idx;
			curr = curr.next;
			idx++;
		}
		return -1;
	}
	rawAt(idx, idx2) {
		this._rawOutput = 1;
		return this.at(idx, idx2);
	}
	at(idx, idx2) {
		let raw = this._rawOutput;
		let curr = this.head;
		idx = idx < 0 ? this.length + idx : idx;
		if (idx2 == void 0)
			return new Function('curr', `return curr${'.next'.repeat(idx)}${raw ? '' : '.value'}`)(curr);
		idx2 = idx2 < 0 ? this.length + idx2 : idx2;
		let min = Math.min(idx, idx2);
		let max = Math.max(idx, idx2);
		let ret = [];
		let count = min;
		if (max > this.length - 1 || min < 0) throw new RangeError('Index out of range');
		curr = new Function('curr', `return curr${'.next'.repeat(min)}`)(curr);
		while (count != max && curr != null) {
			if (curr != null) {
				ret.push(curr);
				count++;
			} else break;
			curr = curr.next;
		}
		ret = raw ? ret : ret.map((c) => c.value);
		this._rawOutput = false;
		return ret.length == 1 ? ret[0] : ret;
	}
	[Symbol.iterator]() {
		let curr = this.head;
		return {
			next: () => {
				let ret = curr;
				if (curr != null) curr = curr.next;
				return {
					done: ret == null,
					value: ret == null ? null : ret.value
				};
			}
		};
	}
	['__#9427@#checkSize']() {
		let curr = this.head;
		if (curr == null) {
			this._size = 0;
			return;
		}
		this._size = 0;
		while (curr != null) {
			this._size++;
			if (curr != null) curr = curr.next;
		}
	}
	get length() {
		if (this._size == 0) this['__#9427@#checkSize']();
		return this._size;
	}
	toString() {
		let curr = this.head;
		let outVal = '';
		while (curr != null) {
			outVal += curr + ' -> ';
			if (curr != null) curr = curr.next;
		}
		outVal += 'null';
		return outVal;
	}
};
var css$1 = {
	code:
		'.card-pile.svelte-2z6wvm.svelte-2z6wvm{position:relative;width:80px;height:131px}.card-pile.svelte-2z6wvm img.svelte-2z6wvm{display:block;position:absolute;opacity:1;top:0;left:0;width:80px;margin:10px;cursor:pointer;transition:0.3s filter ease-in-out}img.svelte-2z6wvm.svelte-2z6wvm:hover{filter:brightness(80%);transition:0.3s filter ease-in-out}.card-pile .slideOff{opacity:0 !important;transform:translate(-15px, -10px);transition:all 0.3s ease-in-out !important}.card-pile.svelte-2z6wvm .card.svelte-2z6wvm{margin:0px}.card-pile.svelte-2z6wvm .card.svelte-2z6wvm:first-child{z-index:3;transition:all 0.3s ease-in-out !important}.card-pile.svelte-2z6wvm .card.svelte-2z6wvm:nth-child(2){z-index:2;transform:translate(4px, 4px);transition:all 0.3s ease-in-out !important}.card-pile.svelte-2z6wvm .card.svelte-2z6wvm:nth-child(3){z-index:1;transform:translate(8px, 8px);transition:all 0.3s ease-in-out !important}',
	map: `{"version":3,"file":"CardPile.svelte","sources":["CardPile.svelte"],"sourcesContent":["<script>\\n    import { LinkedList } from '$lib/utils/LinkedList';\\n\\n    // prettier-ignore\\n    let deckOfCards = ['AS', '2S', '3S', '4S', '5S', '6S', '7S',\\n  '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AH',\\n  '2H', '3H', '4H', '5H', '6H', '7H', '8H',\\n  '9H', '10H', 'JH', 'QH', 'KH', 'AD', '2D',\\n  '3D', '4D', '5D', '6D', '7D', '8D', '9D',\\n  '10D', 'JD', 'QD', 'KD', 'AC', '2C', '3C',\\n  '4C', '5C', '6C', '7C', '8C', '9C', '10C',\\n  'JC', 'QC', 'KC']\\n\\n    export let deckAmount = 1;\\n    const initDeck = new Function(\\n        'deckOfCards',\\n        \`return [\${'...deckOfCards,'.repeat(deckAmount)}]\`\\n    )(deckOfCards);\\n\\n    export const deck = new LinkedList(...initDeck);\\n\\n    deck.shuffle(6);\\n\\n    function getFromPile() {\\n        if (deck.length == 1) return alert('deck is empty');\\n        let firstCard = document.querySelector('.card-pile .card:first-child');\\n        let pile = document.querySelector('.card-pile');\\n        let newCard = firstCard.cloneNode(true);\\n\\n        \\n        let cardRetrieved = deck.popAt(0)\\n        console.log('card grabbed: ' + cardRetrieved, deck.length);\\n        // firstCard.src = \`assets/minicards/\${cardRetrieved}.svg\`;\\n\\n\\n        firstCard.classList.add('slideOff');\\n        pile.style.pointerEvents = 'none';\\n\\n        setTimeout(() => {\\n            pile.removeChild(firstCard);\\n            if (deck.length > 3) pile.appendChild(newCard);\\n            pile.style.pointerEvents = 'initial';\\n        }, 300);\\n    }\\n<\/script>\\n\\n<div class=\\"card-pile-container\\">\\n    <ul class=\\"card-pile\\" on:click={getFromPile}>\\n        <img src=\\"assets/minicards/back.svg\\" alt=\\"backs\\" class=\\"card\\" />\\n        <img src=\\"assets/minicards/back.svg\\" alt=\\"back\\" class=\\"card\\" />\\n        <img src=\\"assets/minicards/back.svg\\" alt=\\"back\\" class=\\"card\\" />\\n    </ul>\\n</div>\\n\\n<style>\\n    /* .card-pile-container {\\n        border: 4px solid black;\\n        border-radius: 15px;\\n        padding: 5px;\\n        padding-right: 15px;\\n    } */\\n\\n    .card-pile {\\n        position: relative;\\n        width: 80px;\\n        height: 131px;\\n    }\\n\\n    .card-pile img {\\n        display: block;\\n        position: absolute;\\n        opacity: 1;\\n        top: 0;\\n        left: 0;\\n        width: 80px;\\n        margin: 10px;\\n        cursor: pointer;\\n        transition: 0.3s filter ease-in-out;\\n    }\\n\\n    img:hover {\\n        filter: brightness(80%);\\n        transition: 0.3s filter ease-in-out;\\n    }\\n\\n    :global(.card-pile .slideOff) {\\n        opacity: 0 !important;\\n        transform: translate(-15px, -10px);\\n        transition: all 0.3s ease-in-out !important;\\n    }\\n\\n    .card-pile .card {\\n        margin: 0px;\\n    }\\n\\n    .card-pile .card:first-child {\\n        z-index: 3;\\n        transition: all 0.3s ease-in-out !important;\\n    }\\n\\n    .card-pile .card:nth-child(2) {\\n        z-index: 2;\\n        transform: translate(4px, 4px);\\n        transition: all 0.3s ease-in-out !important;\\n    }\\n\\n    .card-pile .card:nth-child(3) {\\n        z-index: 1;\\n        transform: translate(8px, 8px);\\n        transition: all 0.3s ease-in-out !important;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA8DI,UAAU,4BAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,KAAK,AACjB,CAAC,AAED,wBAAU,CAAC,GAAG,cAAC,CAAC,AACZ,OAAO,CAAE,KAAK,CACd,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,CAAC,CACV,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,IAAI,CAAC,MAAM,CAAC,WAAW,AACvC,CAAC,AAED,+BAAG,MAAM,AAAC,CAAC,AACP,MAAM,CAAE,WAAW,GAAG,CAAC,CACvB,UAAU,CAAE,IAAI,CAAC,MAAM,CAAC,WAAW,AACvC,CAAC,AAEO,oBAAoB,AAAE,CAAC,AAC3B,OAAO,CAAE,CAAC,CAAC,UAAU,CACrB,SAAS,CAAE,UAAU,KAAK,CAAC,CAAC,KAAK,CAAC,CAClC,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,UAAU,AAC/C,CAAC,AAED,wBAAU,CAAC,KAAK,cAAC,CAAC,AACd,MAAM,CAAE,GAAG,AACf,CAAC,AAED,wBAAU,CAAC,mBAAK,YAAY,AAAC,CAAC,AAC1B,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,UAAU,AAC/C,CAAC,AAED,wBAAU,CAAC,mBAAK,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAAC,CAC9B,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,UAAU,AAC/C,CAAC,AAED,wBAAU,CAAC,mBAAK,WAAW,CAAC,CAAC,AAAC,CAAC,AAC3B,OAAO,CAAE,CAAC,CACV,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAAC,CAC9B,UAAU,CAAE,GAAG,CAAC,IAAI,CAAC,WAAW,CAAC,UAAU,AAC/C,CAAC"}`
};
var CardPile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let deckOfCards = [
		'AS',
		'2S',
		'3S',
		'4S',
		'5S',
		'6S',
		'7S',
		'8S',
		'9S',
		'10S',
		'JS',
		'QS',
		'KS',
		'AH',
		'2H',
		'3H',
		'4H',
		'5H',
		'6H',
		'7H',
		'8H',
		'9H',
		'10H',
		'JH',
		'QH',
		'KH',
		'AD',
		'2D',
		'3D',
		'4D',
		'5D',
		'6D',
		'7D',
		'8D',
		'9D',
		'10D',
		'JD',
		'QD',
		'KD',
		'AC',
		'2C',
		'3C',
		'4C',
		'5C',
		'6C',
		'7C',
		'8C',
		'9C',
		'10C',
		'JC',
		'QC',
		'KC'
	];
	let { deckAmount = 1 } = $$props;
	const initDeck = new Function('deckOfCards', `return [${'...deckOfCards,'.repeat(deckAmount)}]`)(
		deckOfCards
	);
	const deck = new LinkedList(...initDeck);
	deck.shuffle(6);
	if ($$props.deckAmount === void 0 && $$bindings.deckAmount && deckAmount !== void 0)
		$$bindings.deckAmount(deckAmount);
	if ($$props.deck === void 0 && $$bindings.deck && deck !== void 0) $$bindings.deck(deck);
	$$result.css.add(css$1);
	return `<div class="${'card-pile-container'}"><ul class="${'card-pile svelte-2z6wvm'}"><img src="${'assets/minicards/back.svg'}" alt="${'backs'}" class="${'card svelte-2z6wvm'}">
        <img src="${'assets/minicards/back.svg'}" alt="${'back'}" class="${'card svelte-2z6wvm'}">
        <img src="${'assets/minicards/back.svg'}" alt="${'back'}" class="${'card svelte-2z6wvm'}"></ul>
</div>`;
});
var css = {
	code:
		'main.svelte-mpj3l0{display:flex;justify-content:center;align-items:center;min-width:100vw;min-height:100vh}',
	map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script>\\n\\timport Card from '$lib/Card.svelte';\\n\\timport CardPile from '$lib/CardPile.svelte';\\n\\timport { LinkedList } from '$lib/utils/LinkedList';\\n\\n\\tlet deck = new LinkedList();\\n\\n\\t$: cards = deck.toArray();\\n\\n\\tfunction shuffleCards() {\\n\\t\\tdeck.shuffle(3);\\n\\t\\tdeck = deck;\\n\\t}\\n<\/script>\\n\\n<main>\\n\\t<!-- <div class=\\"cards-container\\">\\n        {#each cards as card}\\n            <Card cardType=\\"minicards\\" {card} />\\n        {/each}\\n    </div>\\n\\n    <button on:click={shuffleCards}> Shuffle Card </button> -->\\n\\n\\t<CardPile bind:deck deckAmount=\\"1\\" />\\n</main>\\n\\n<style>\\n\\t/* .cards-container {\\n\\t\\t/* @apply flex flex-row flex-wrap justify-around; \\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: space-around;\\n\\t\\tflex-direction: row;\\n\\t\\tflex-wrap: wrap;\\n\\t}\\n\\n\\t.cards-container img {\\n\\t\\tflex: 1 0 21%;\\n\\t}\\n\\n\\tbutton {\\n\\t\\tpadding: 10px;\\n\\t\\tborder: 1px solid black;\\n\\t\\tbackground-color: #333;\\n\\t\\tcolor: white;\\n\\t\\tborder-radius: 15px;\\n\\t} */\\n\\n\\tmain {\\n\\t\\t/* @apply flex justify-center items-center; */\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: center;\\n\\t\\talign-items: center;\\n\\t\\tmin-width: 100vw;\\n\\t\\tmin-height: 100vh;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAgDC,IAAI,cAAC,CAAC,AAEL,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,KAAK,AAClB,CAAC"}`
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let deck = new LinkedList();
	$$result.css.add(css);
	let $$settled;
	let $$rendered;
	do {
		$$settled = true;
		deck.toArray();
		$$rendered = `<main class="${'svelte-mpj3l0'}">

	${validate_component(CardPile, 'CardPile').$$render(
		$$result,
		{ deckAmount: '1', deck },
		{
			deck: ($$value) => {
				deck = $$value;
				$$settled = false;
			}
		},
		{}
	)}
</main>`;
	} while (!$$settled);
	return $$rendered;
});
var index = /* @__PURE__ */ Object.freeze({
	__proto__: null,
	[Symbol.toStringTag]: 'Module',
	default: Routes
});

// .svelte-kit/vercel/entry.js
var entry_default = async (req, res) => {
	const { pathname, searchParams } = new URL(req.url || '', 'http://localhost');
	let body;
	try {
		body = await getRawBody(req);
	} catch (err) {
		res.statusCode = err.status || 400;
		return res.end(err.reason || 'Invalid request body');
	}
	const rendered = await render({
		method: req.method,
		headers: req.headers,
		path: pathname,
		query: searchParams,
		rawBody: body
	});
	if (rendered) {
		const { status, headers, body: body2 } = rendered;
		return res.writeHead(status, headers).end(body2);
	}
	return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
