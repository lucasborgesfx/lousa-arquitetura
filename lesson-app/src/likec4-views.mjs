import { jsx, jsxs } from "react/jsx-runtime";
import { LikeC4Model } from "@likec4/core/model";
import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { LikeC4ModelProvider as LikeC4ModelProvider$1, LikeC4View as LikeC4View$1, ReactLikeC4 as ReactLikeC4$1 } from "likec4/react";
//#region likec4:icon-bundle/tech/postgresql.jsx
var t$2 = (l) => jsxs("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	preserveAspectRatio: "xMidYMid",
	viewBox: "0 0 256 264",
	...l,
	children: [
		jsx("path", { d: "M255.008 158.086c-1.535-4.649-5.556-7.887-10.756-8.664-2.452-.366-5.26-.21-8.583.475-5.792 1.195-10.089 1.65-13.225 1.738 11.837-19.985 21.462-42.775 27.003-64.228 8.96-34.689 4.172-50.492-1.423-57.64C233.217 10.847 211.614.683 185.552.372c-13.903-.17-26.108 2.575-32.475 4.549-5.928-1.046-12.302-1.63-18.99-1.738-12.537-.2-23.614 2.533-33.079 8.15-5.24-1.772-13.65-4.27-23.362-5.864-22.842-3.75-41.252-.828-54.718 8.685C6.622 25.672-.937 45.684.461 73.634c.444 8.874 5.408 35.874 13.224 61.48 4.492 14.718 9.282 26.94 14.237 36.33 7.027 13.315 14.546 21.156 22.987 23.972 4.731 1.576 13.327 2.68 22.368-4.85 1.146 1.388 2.675 2.767 4.704 4.048 2.577 1.625 5.728 2.953 8.875 3.74 11.341 2.835 21.964 2.126 31.027-1.848.056 1.612.099 3.152.135 4.482.06 2.157.12 4.272.199 6.25.537 13.374 1.447 23.773 4.143 31.049.148.4.347 1.01.557 1.657 1.345 4.118 3.594 11.012 9.316 16.411 5.925 5.593 13.092 7.308 19.656 7.308 3.292 0 6.433-.432 9.188-1.022 9.82-2.105 20.973-5.311 29.041-16.799 7.628-10.86 11.336-27.217 12.007-52.99q.13-1.094.244-2.088l.16-1.362 1.797.158.463.031c10.002.456 22.232-1.665 29.743-5.154 5.935-2.754 24.954-12.795 20.476-26.351" }),
		jsx("path", {
			fill: "#336791",
			d: "M237.906 160.722c-29.74 6.135-31.785-3.934-31.785-3.934 31.4-46.593 44.527-105.736 33.2-120.211-30.904-39.485-84.399-20.811-85.292-20.327l-.287.052c-5.876-1.22-12.451-1.946-19.842-2.067-13.456-.22-23.664 3.528-31.41 9.402 0 0-95.43-39.314-90.991 49.444.944 18.882 27.064 142.873 58.218 105.422 11.387-13.695 22.39-25.274 22.39-25.274 5.464 3.63 12.006 5.482 18.864 4.817l.533-.452c-.166 1.7-.09 3.363.213 5.332-8.026 8.967-5.667 10.541-21.711 13.844-16.235 3.346-6.698 9.302-.471 10.86 7.549 1.887 25.013 4.561 36.813-11.958l-.47 1.885c3.144 2.519 5.352 16.383 4.982 28.952-.37 12.568-.617 21.197 1.86 27.937 2.479 6.74 4.948 21.905 26.04 17.386 17.623-3.777 26.756-13.564 28.027-29.89.901-11.606 2.942-9.89 3.07-20.267l1.637-4.912c1.887-15.733.3-20.809 11.157-18.448l2.64.232c7.99.363 18.45-1.286 24.589-4.139 13.218-6.134 21.058-16.377 8.024-13.686z"
		}),
		jsx("path", {
			fill: "#FFF",
			d: "M108.076 81.525c-2.68-.373-5.107-.028-6.335.902-.69.523-.904 1.129-.962 1.546-.154 1.105.62 2.327 1.096 2.957 1.346 1.784 3.312 3.01 5.258 3.28q.423.059.842.058c3.245 0 6.196-2.527 6.456-4.392.325-2.336-3.066-3.893-6.355-4.35M196.86 81.599c-.256-1.831-3.514-2.353-6.606-1.923-3.088.43-6.082 1.824-5.832 3.659.2 1.427 2.777 3.863 5.827 3.863q.387 0 .78-.054c2.036-.282 3.53-1.575 4.24-2.32 1.08-1.136 1.706-2.402 1.591-3.225"
		}),
		jsx("path", {
			fill: "#FFF",
			d: "M247.802 160.025c-1.134-3.429-4.784-4.532-10.848-3.28-18.005 3.716-24.453 1.142-26.57-.417 13.995-21.32 25.508-47.092 31.719-71.137 2.942-11.39 4.567-21.968 4.7-30.59.147-9.463-1.465-16.417-4.789-20.665-13.402-17.125-33.072-26.311-56.882-26.563-16.369-.184-30.199 4.005-32.88 5.183-5.646-1.404-11.801-2.266-18.502-2.376-12.288-.199-22.91 2.743-31.704 8.74-3.82-1.422-13.692-4.811-25.765-6.756-20.872-3.36-37.458-.814-49.294 7.571-14.123 10.006-20.643 27.892-19.38 53.16.425 8.501 5.269 34.653 12.913 59.698 10.062 32.964 21 51.625 32.508 55.464 1.347.449 2.9.763 4.613.763 4.198 0 9.345-1.892 14.7-8.33a530 530 0 0 1 20.261-22.926c4.524 2.428 9.494 3.784 14.577 3.92q.016.2.035.398a118 118 0 0 0-2.57 3.175c-3.522 4.471-4.255 5.402-15.592 7.736-3.225.666-11.79 2.431-11.916 8.435-.136 6.56 10.125 9.315 11.294 9.607 4.074 1.02 7.999 1.523 11.742 1.523 9.103 0 17.114-2.992 23.516-8.781-.197 23.386.778 46.43 3.586 53.451 2.3 5.748 7.918 19.795 25.664 19.794 2.604 0 5.47-.303 8.623-.979 18.521-3.97 26.564-12.156 29.675-30.203 1.665-9.645 4.522-32.676 5.866-45.03 2.836.885 6.487 1.29 10.434 1.289 8.232 0 17.731-1.749 23.688-4.514 6.692-3.108 18.768-10.734 16.578-17.36m-44.106-83.48c-.061 3.647-.563 6.958-1.095 10.414-.573 3.717-1.165 7.56-1.314 12.225-.147 4.54.42 9.26.968 13.825 1.108 9.22 2.245 18.712-2.156 28.078a37 37 0 0 1-1.95-4.009c-.547-1.326-1.735-3.456-3.38-6.404-6.399-11.476-21.384-38.35-13.713-49.316 2.285-3.264 8.084-6.62 22.64-4.813m-17.644-61.787c21.334.471 38.21 8.452 50.158 23.72 9.164 11.711-.927 64.998-30.14 110.969a171 171 0 0 0-.886-1.117l-.37-.462c7.549-12.467 6.073-24.802 4.759-35.738-.54-4.488-1.05-8.727-.92-12.709.134-4.22.692-7.84 1.232-11.34.663-4.313 1.338-8.776 1.152-14.037.139-.552.195-1.204.122-1.978-.475-5.045-6.235-20.144-17.975-33.81-6.422-7.475-15.787-15.84-28.574-21.482 5.5-1.14 13.021-2.203 21.442-2.016M66.674 175.778c-5.9 7.094-9.974 5.734-11.314 5.288-8.73-2.912-18.86-21.364-27.791-50.624-7.728-25.318-12.244-50.777-12.602-57.916-1.128-22.578 4.345-38.313 16.268-46.769 19.404-13.76 51.306-5.524 64.125-1.347-.184.182-.376.352-.558.537-21.036 21.244-20.537 57.54-20.485 59.759-.002.856.07 2.068.168 3.735.362 6.105 1.036 17.467-.764 30.334-1.672 11.957 2.014 23.66 10.111 32.109a36 36 0 0 0 2.617 2.468c-3.604 3.86-11.437 12.396-19.775 22.426m22.479-29.993c-6.526-6.81-9.49-16.282-8.133-25.99 1.9-13.592 1.199-25.43.822-31.79-.053-.89-.1-1.67-.127-2.285 3.073-2.725 17.314-10.355 27.47-8.028 4.634 1.061 7.458 4.217 8.632 9.645 6.076 28.103.804 39.816-3.432 49.229-.873 1.939-1.698 3.772-2.402 5.668l-.546 1.466c-1.382 3.706-2.668 7.152-3.465 10.424-6.938-.02-13.687-2.984-18.819-8.34m1.065 37.9c-2.026-.506-3.848-1.385-4.917-2.114.893-.42 2.482-.992 5.238-1.56 13.337-2.745 15.397-4.683 19.895-10.394 1.031-1.31 2.2-2.794 3.819-4.602l.002-.002c2.411-2.7 3.514-2.242 5.514-1.412 1.621.67 3.2 2.702 3.84 4.938.303 1.056.643 3.06-.47 4.62-9.396 13.156-23.088 12.987-32.921 10.526m69.799 64.952c-16.316 3.496-22.093-4.829-25.9-14.346-2.457-6.144-3.665-33.85-2.808-64.447.011-.407-.047-.8-.159-1.17a15.4 15.4 0 0 0-.456-2.162c-1.274-4.452-4.379-8.176-8.104-9.72-1.48-.613-4.196-1.738-7.46-.903.696-2.868 1.903-6.107 3.212-9.614l.549-1.475c.618-1.663 1.394-3.386 2.214-5.21 4.433-9.848 10.504-23.337 3.915-53.81-2.468-11.414-10.71-16.988-23.204-15.693-7.49.775-14.343 3.797-17.761 5.53-.735.372-1.407.732-2.035 1.082.954-11.5 4.558-32.992 18.04-46.59 8.489-8.56 19.794-12.788 33.568-12.56 27.14.444 44.544 14.372 54.366 25.979 8.464 10.001 13.047 20.076 14.876 25.51-13.755-1.399-23.11 1.316-27.852 8.096-10.317 14.748 5.644 43.372 13.315 57.129 1.407 2.521 2.621 4.7 3.003 5.626 2.498 6.054 5.732 10.096 8.093 13.046.724.904 1.426 1.781 1.96 2.547-4.166 1.201-11.649 3.976-10.967 17.847-.55 6.96-4.461 39.546-6.448 51.059-2.623 15.21-8.22 20.875-23.957 24.25m68.104-77.936c-4.26 1.977-11.389 3.46-18.161 3.779-7.48.35-11.288-.838-12.184-1.569-.42-8.644 2.797-9.547 6.202-10.503.535-.15 1.057-.297 1.561-.473q.469.383 1.032.756c6.012 3.968 16.735 4.396 31.874 1.271l.166-.033c-2.042 1.909-5.536 4.471-10.49 6.772"
		})
	]
});
//#endregion
//#region likec4:plugin/mind-blueprint-spike/icons.jsx
var Icons = { "tech:postgresql": t$2 };
function IconRenderer({ node, ...props }) {
	const IconComponent = Icons[node.icon ?? ""];
	if (!IconComponent) return null;
	return jsx(IconComponent, props);
}
//#endregion
//#region node_modules/likec4/dist/vite-plugin/internal/index.mjs
var listenerQueue = [];
var lqIndex = 0;
var QUEUE_ITEMS_PER_LISTENER = 4;
var nanostoresGlobal = globalThis.nanostoresGlobal ||= { epoch: 0 };
var atom = /* @__NO_SIDE_EFFECTS__ */ (initialValue) => {
	let listeners = [];
	let $atom = {
		get() {
			if (!$atom.lc) $atom.listen(() => {})();
			return $atom.value;
		},
		init: initialValue,
		lc: 0,
		listen(listener) {
			$atom.lc = listeners.push(listener);
			return () => {
				for (let i = lqIndex + QUEUE_ITEMS_PER_LISTENER; i < listenerQueue.length;) if (listenerQueue[i] === listener) listenerQueue.splice(i, QUEUE_ITEMS_PER_LISTENER);
				else i += QUEUE_ITEMS_PER_LISTENER;
				let index = listeners.indexOf(listener);
				if (~index) {
					listeners.splice(index, 1);
					if (!--$atom.lc) $atom.off();
				}
			};
		},
		notify(oldValue, changedKey) {
			nanostoresGlobal.epoch++;
			let runListenerQueue = !listenerQueue.length;
			for (let listener of listeners) listenerQueue.push(listener, $atom.value, oldValue, changedKey);
			if (runListenerQueue) {
				for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) listenerQueue[lqIndex](listenerQueue[lqIndex + 1], listenerQueue[lqIndex + 2], listenerQueue[lqIndex + 3]);
				listenerQueue.length = 0;
			}
		},
		off() {},
		set(newValue) {
			let oldValue = $atom.value;
			if (oldValue !== newValue) {
				$atom.value = newValue;
				$atom.notify(oldValue);
			}
		},
		subscribe(listener) {
			let unbind = $atom.listen(listener);
			listener($atom.value);
			return unbind;
		},
		value: initialValue
	};
	return $atom;
};
var MOUNT = 5;
var UNMOUNT = 6;
var REVERT_MUTATION = 10;
var on = (object, listener, eventKey, mutateStore) => {
	object.events = object.events || {};
	if (!object.events[eventKey + REVERT_MUTATION]) object.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
		object.events[eventKey].reduceRight((event, l) => (l(event), event), {
			shared: {},
			...eventProps
		});
	});
	object.events[eventKey] = object.events[eventKey] || [];
	object.events[eventKey].push(listener);
	return () => {
		let currentListeners = object.events[eventKey];
		let index = currentListeners.indexOf(listener);
		currentListeners.splice(index, 1);
		if (!currentListeners.length) {
			delete object.events[eventKey];
			object.events[eventKey + REVERT_MUTATION]();
			delete object.events[eventKey + REVERT_MUTATION];
		}
	};
};
var STORE_UNMOUNT_DELAY = 1e3;
var onMount = ($store, initialize) => {
	let listener = (payload) => {
		let destroy = initialize(payload);
		if (destroy) $store.events[UNMOUNT].push(destroy);
	};
	return on($store, listener, MOUNT, (runListeners) => {
		let originListen = $store.listen;
		$store.listen = (...args) => {
			if (!$store.lc && !$store.active) {
				$store.active = true;
				runListeners();
			}
			return originListen(...args);
		};
		let originOff = $store.off;
		$store.events[UNMOUNT] = [];
		$store.off = () => {
			originOff();
			setTimeout(() => {
				if ($store.active && !$store.lc) {
					$store.active = false;
					for (let destroy of $store.events[UNMOUNT]) destroy();
					$store.events[UNMOUNT] = [];
				}
			}, STORE_UNMOUNT_DELAY);
		};
		return () => {
			$store.listen = originListen;
			$store.off = originOff;
		};
	});
};
var computedStore = (stores, cb, batched) => {
	if (!Array.isArray(stores)) stores = [stores];
	let previousArgs;
	let currentEpoch;
	let set = () => {
		if (currentEpoch === nanostoresGlobal.epoch) return;
		currentEpoch = nanostoresGlobal.epoch;
		let args = stores.map(($store) => $store.get());
		if (!previousArgs || args.some((arg, i) => arg !== previousArgs[i])) {
			previousArgs = args;
			let value = cb(...args);
			if (value && value.then && value.t) value.then((asyncValue) => {
				if (previousArgs === args) $computed.set(asyncValue);
			});
			else {
				$computed.set(value);
				currentEpoch = nanostoresGlobal.epoch;
			}
		}
	};
	let $computed = /* @__PURE__ */ atom(void 0);
	let get = $computed.get;
	$computed.get = () => {
		set();
		return get();
	};
	let timer;
	let run = batched ? () => {
		clearTimeout(timer);
		timer = setTimeout(set);
	} : set;
	onMount($computed, () => {
		let unbinds = stores.map(($store) => $store.listen(run));
		set();
		return () => {
			for (let unbind of unbinds) unbind();
		};
	});
	return $computed;
};
var computed = /* @__NO_SIDE_EFFECTS__ */ (stores, fn) => computedStore(stores, fn);
function listenKeys($store, keys, listener) {
	let keysSet = new Set(keys).add(void 0);
	return $store.listen((value, oldValue, changed) => {
		if (keysSet.has(changed)) listener(value, oldValue, changed);
	});
}
var emit = (snapshotRef, onChange) => (value) => {
	if (snapshotRef.current === value) return;
	snapshotRef.current = value;
	onChange();
};
function useStore(store, { keys, deps = [store, keys], ssr } = {}) {
	let snapshotRef = useRef();
	snapshotRef.current = store.get();
	let subscribe = useCallback((onChange) => {
		emit(snapshotRef, onChange)(store.value);
		return keys?.length > 0 ? listenKeys(store, keys, emit(snapshotRef, onChange)) : store.listen(emit(snapshotRef, onChange));
	}, deps);
	let get = () => snapshotRef.current;
	let server = get;
	if (ssr && "init" in store) server = ssr === "initial" ? () => store.init : ssr;
	return useSyncExternalStore(subscribe, get, server);
}
Math.random.bind(Math);
var { clearTimeout: clearTimeout$1, setTimeout: setTimeout$1 } = globalThis;
var { getOwnPropertyNames, getOwnPropertySymbols } = Object;
var { hasOwnProperty } = Object.prototype;
/**
* Combine two comparators into a single comparators.
*/
function combineComparators(comparatorA, comparatorB) {
	return function isEqual(a, b, state) {
		return comparatorA(a, b, state) && comparatorB(a, b, state);
	};
}
/**
* Wrap the provided `areItemsEqual` method to manage the circular state, allowing
* for circular references to be safely included in the comparison without creating
* stack overflows.
*/
function createIsCircular(areItemsEqual) {
	return function isCircular(a, b, state) {
		if (!a || !b || typeof a !== "object" || typeof b !== "object") return areItemsEqual(a, b, state);
		const { cache } = state;
		const cachedA = cache.get(a);
		const cachedB = cache.get(b);
		if (cachedA && cachedB) return cachedA === b && cachedB === a;
		cache.set(a, b);
		cache.set(b, a);
		const result = areItemsEqual(a, b, state);
		cache.delete(a);
		cache.delete(b);
		return result;
	};
}
/**
* Get the properties to strictly examine, which include both own properties that are
* not enumerable and symbol properties.
*/
function getStrictProperties(object) {
	return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
}
/**
* Whether the object contains the property passed as an own property.
*/
var hasOwn = Object.hasOwn || ((object, property) => hasOwnProperty.call(object, property));
var PREACT_VNODE = "__v";
var PREACT_OWNER = "__o";
var REACT_OWNER = "_owner";
var { getOwnPropertyDescriptor, keys } = Object;
/**
* Whether the values passed are equal based on a [SameValue](https://262.ecma-international.org/7.0/#sec-samevalue) basis.
* Simplified, this maps to if the two values are referentially equal to one another (`a === b`) or both are `NaN`.
*
* @note
* When available in the environment, this is just a re-export of the global
* [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) method.
*/
var sameValueEqual = Object.is || function sameValueEqual(a, b) {
	return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
};
/**
* Whether the values passed are equal based on a
* [Strict Equality Comparison](https://262.ecma-international.org/7.0/#sec-strict-equality-comparison) basis.
* Simplified, this maps to if the two values are referentially equal to one another (`a === b`).
*
* @note
* This is mainly available as a convenience function, such as being a default when a function to determine equality between
* two objects is used.
*/
function strictEqual(a, b) {
	return a === b;
}
/**
* Whether the array buffers are equal in value.
*/
function areArrayBuffersEqual(a, b) {
	return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a), new Uint8Array(b));
}
/**
* Whether the arrays are equal in value.
*/
function areArraysEqual(a, b, state) {
	let index = a.length;
	if (b.length !== index) return false;
	while (index-- > 0) if (!state.equals(a[index], b[index], index, index, a, b, state)) return false;
	return true;
}
/**
* Whether the dataviews are equal in value.
*/
function areDataViewsEqual(a, b) {
	return a.byteLength === b.byteLength && areTypedArraysEqual(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
}
/**
* Whether the dates passed are equal in value.
*/
function areDatesEqual(a, b) {
	return sameValueEqual(a.getTime(), b.getTime());
}
/**
* Whether the errors passed are equal in value.
*/
function areErrorsEqual(a, b) {
	return a.name === b.name && a.message === b.message && a.cause === b.cause && a.stack === b.stack;
}
/**
* Whether the `Map`s are equal in value.
*/
function areMapsEqual(a, b, state) {
	const size = a.size;
	if (size !== b.size) return false;
	if (!size) return true;
	const matchedIndices = new Array(size);
	const aIterable = a.entries();
	let aResult;
	let bResult;
	let index = 0;
	while (aResult = aIterable.next()) {
		if (aResult.done) break;
		const bIterable = b.entries();
		let hasMatch = false;
		let matchIndex = 0;
		while (bResult = bIterable.next()) {
			if (bResult.done) break;
			if (matchedIndices[matchIndex]) {
				matchIndex++;
				continue;
			}
			const aEntry = aResult.value;
			const bEntry = bResult.value;
			if (state.equals(aEntry[0], bEntry[0], index, matchIndex, a, b, state) && state.equals(aEntry[1], bEntry[1], aEntry[0], bEntry[0], a, b, state)) {
				hasMatch = matchedIndices[matchIndex] = true;
				break;
			}
			matchIndex++;
		}
		if (!hasMatch) return false;
		index++;
	}
	return true;
}
/**
* Whether the objects are equal in value.
*/
function areObjectsEqual(a, b, state) {
	const properties = keys(a);
	let index = properties.length;
	if (keys(b).length !== index) return false;
	while (index-- > 0) if (!isPropertyEqual(a, b, state, properties[index])) return false;
	return true;
}
/**
* Whether the objects are equal in value with strict property checking.
*/
function areObjectsEqualStrict(a, b, state) {
	const properties = getStrictProperties(a);
	let index = properties.length;
	if (getStrictProperties(b).length !== index) return false;
	let property;
	let descriptorA;
	let descriptorB;
	while (index-- > 0) {
		property = properties[index];
		if (!isPropertyEqual(a, b, state, property)) return false;
		descriptorA = getOwnPropertyDescriptor(a, property);
		descriptorB = getOwnPropertyDescriptor(b, property);
		if ((descriptorA || descriptorB) && (!descriptorA || !descriptorB || descriptorA.configurable !== descriptorB.configurable || descriptorA.enumerable !== descriptorB.enumerable || descriptorA.writable !== descriptorB.writable)) return false;
	}
	return true;
}
/**
* Whether the primitive wrappers passed are equal in value.
*/
function arePrimitiveWrappersEqual(a, b) {
	return sameValueEqual(a.valueOf(), b.valueOf());
}
/**
* Whether the regexps passed are equal in value.
*/
function areRegExpsEqual(a, b) {
	return a.source === b.source && a.flags === b.flags;
}
/**
* Whether the `Set`s are equal in value.
*/
function areSetsEqual(a, b, state) {
	const size = a.size;
	if (size !== b.size) return false;
	if (!size) return true;
	const matchedIndices = new Array(size);
	const aIterable = a.values();
	let aResult;
	let bResult;
	while (aResult = aIterable.next()) {
		if (aResult.done) break;
		const bIterable = b.values();
		let hasMatch = false;
		let matchIndex = 0;
		while (bResult = bIterable.next()) {
			if (bResult.done) break;
			if (!matchedIndices[matchIndex] && state.equals(aResult.value, bResult.value, aResult.value, bResult.value, a, b, state)) {
				hasMatch = matchedIndices[matchIndex] = true;
				break;
			}
			matchIndex++;
		}
		if (!hasMatch) return false;
	}
	return true;
}
/**
* Whether the TypedArray instances are equal in value.
*/
function areTypedArraysEqual(a, b) {
	let index = a.byteLength;
	if (b.byteLength !== index || a.byteOffset !== b.byteOffset) return false;
	while (index-- > 0) if (a[index] !== b[index]) return false;
	return true;
}
/**
* Whether the URL instances are equal in value.
*/
function areUrlsEqual(a, b) {
	return a.hostname === b.hostname && a.pathname === b.pathname && a.protocol === b.protocol && a.port === b.port && a.hash === b.hash && a.username === b.username && a.password === b.password;
}
function isPropertyEqual(a, b, state, property) {
	if ((property === REACT_OWNER || property === PREACT_OWNER || property === PREACT_VNODE) && (a.$$typeof || b.$$typeof)) return true;
	return hasOwn(b, property) && state.equals(a[property], b[property], property, property, a, b, state);
}
var toString = Object.prototype.toString;
/**
* Create a comparator method based on the type-specific equality comparators passed.
*/
function createEqualityComparator(config) {
	const supportedComparatorMap = createSupportedComparatorMap(config);
	const { areArraysEqual, areDatesEqual, areFunctionsEqual, areMapsEqual, areNumbersEqual, areObjectsEqual, areRegExpsEqual, areSetsEqual, getUnsupportedCustomComparator } = config;
	/**
	* compare the value of the two objects and return true if they are equivalent in values
	*/
	return function comparator(a, b, state) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		const type = typeof a;
		if (type !== typeof b) return false;
		if (type !== "object") {
			if (type === "number" || type === "bigint") return areNumbersEqual(a, b, state);
			if (type === "function") return areFunctionsEqual(a, b, state);
			return false;
		}
		const constructor = a.constructor;
		if (constructor !== b.constructor) return false;
		if (constructor === Object) return areObjectsEqual(a, b, state);
		if (constructor === Array) return areArraysEqual(a, b, state);
		if (constructor === Date) return areDatesEqual(a, b, state);
		if (constructor === RegExp) return areRegExpsEqual(a, b, state);
		if (constructor === Map) return areMapsEqual(a, b, state);
		if (constructor === Set) return areSetsEqual(a, b, state);
		if (constructor === Promise) return false;
		if (Array.isArray(a)) return areArraysEqual(a, b, state);
		const tag = toString.call(a);
		const supportedComparator = supportedComparatorMap[tag];
		if (supportedComparator) return supportedComparator(a, b, state);
		const unsupportedCustomComparator = getUnsupportedCustomComparator && getUnsupportedCustomComparator(a, b, state, tag);
		if (unsupportedCustomComparator) return unsupportedCustomComparator(a, b, state);
		return false;
	};
}
/**
* Create the configuration object used for building comparators.
*/
function createEqualityComparatorConfig({ circular, createCustomConfig, strict }) {
	let config = {
		areArrayBuffersEqual,
		areArraysEqual: strict ? areObjectsEqualStrict : areArraysEqual,
		areDataViewsEqual,
		areDatesEqual,
		areErrorsEqual,
		areFunctionsEqual: strictEqual,
		areMapsEqual: strict ? combineComparators(areMapsEqual, areObjectsEqualStrict) : areMapsEqual,
		areNumbersEqual: sameValueEqual,
		areObjectsEqual: strict ? areObjectsEqualStrict : areObjectsEqual,
		arePrimitiveWrappersEqual,
		areRegExpsEqual,
		areSetsEqual: strict ? combineComparators(areSetsEqual, areObjectsEqualStrict) : areSetsEqual,
		areTypedArraysEqual: strict ? combineComparators(areTypedArraysEqual, areObjectsEqualStrict) : areTypedArraysEqual,
		areUrlsEqual,
		getUnsupportedCustomComparator: void 0
	};
	if (createCustomConfig) config = Object.assign({}, config, createCustomConfig(config));
	if (circular) {
		const areArraysEqual = createIsCircular(config.areArraysEqual);
		const areMapsEqual = createIsCircular(config.areMapsEqual);
		const areObjectsEqual = createIsCircular(config.areObjectsEqual);
		const areSetsEqual = createIsCircular(config.areSetsEqual);
		config = Object.assign({}, config, {
			areArraysEqual,
			areMapsEqual,
			areObjectsEqual,
			areSetsEqual
		});
	}
	return config;
}
/**
* Default equality comparator pass-through, used as the standard `isEqual` creator for
* use inside the built comparator.
*/
function createInternalEqualityComparator(compare) {
	return function(a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) {
		return compare(a, b, state);
	};
}
/**
* Create the `isEqual` function used by the consuming application.
*/
function createIsEqual({ circular, comparator, createState, equals, strict }) {
	if (createState) return function isEqual(a, b) {
		const { cache = circular ? /* @__PURE__ */ new WeakMap() : void 0, meta } = createState();
		return comparator(a, b, {
			cache,
			equals,
			meta,
			strict
		});
	};
	if (circular) return function isEqual(a, b) {
		return comparator(a, b, {
			cache: /* @__PURE__ */ new WeakMap(),
			equals,
			meta: void 0,
			strict
		});
	};
	const state = {
		cache: void 0,
		equals,
		meta: void 0,
		strict
	};
	return function isEqual(a, b) {
		return comparator(a, b, state);
	};
}
/**
* Create a map of `toString()` values to their respective handlers for `tag`-based lookups.
*/
function createSupportedComparatorMap({ areArrayBuffersEqual, areArraysEqual, areDataViewsEqual, areDatesEqual, areErrorsEqual, areFunctionsEqual, areMapsEqual, areNumbersEqual, areObjectsEqual, arePrimitiveWrappersEqual, areRegExpsEqual, areSetsEqual, areTypedArraysEqual, areUrlsEqual }) {
	return {
		"[object Arguments]": areObjectsEqual,
		"[object Array]": areArraysEqual,
		"[object ArrayBuffer]": areArrayBuffersEqual,
		"[object AsyncGeneratorFunction]": areFunctionsEqual,
		"[object BigInt]": areNumbersEqual,
		"[object BigInt64Array]": areTypedArraysEqual,
		"[object BigUint64Array]": areTypedArraysEqual,
		"[object Boolean]": arePrimitiveWrappersEqual,
		"[object DataView]": areDataViewsEqual,
		"[object Date]": areDatesEqual,
		"[object Error]": areErrorsEqual,
		"[object Float16Array]": areTypedArraysEqual,
		"[object Float32Array]": areTypedArraysEqual,
		"[object Float64Array]": areTypedArraysEqual,
		"[object Function]": areFunctionsEqual,
		"[object GeneratorFunction]": areFunctionsEqual,
		"[object Int8Array]": areTypedArraysEqual,
		"[object Int16Array]": areTypedArraysEqual,
		"[object Int32Array]": areTypedArraysEqual,
		"[object Map]": areMapsEqual,
		"[object Number]": arePrimitiveWrappersEqual,
		"[object Object]": (a, b, state) => typeof a.then !== "function" && typeof b.then !== "function" && areObjectsEqual(a, b, state),
		"[object RegExp]": areRegExpsEqual,
		"[object Set]": areSetsEqual,
		"[object String]": arePrimitiveWrappersEqual,
		"[object URL]": areUrlsEqual,
		"[object Uint8Array]": areTypedArraysEqual,
		"[object Uint8ClampedArray]": areTypedArraysEqual,
		"[object Uint16Array]": areTypedArraysEqual,
		"[object Uint32Array]": areTypedArraysEqual
	};
}
/**
* Whether the items passed are deeply-equal in value.
*/
var deepEqual = createCustomEqual();
createCustomEqual({ strict: true });
createCustomEqual({ circular: true });
createCustomEqual({
	circular: true,
	strict: true
});
/**
* Whether the items passed are shallowly-equal in value.
*/
var shallowEqual = createCustomEqual({ createInternalComparator: () => sameValueEqual });
createCustomEqual({
	strict: true,
	createInternalComparator: () => sameValueEqual
});
createCustomEqual({
	circular: true,
	createInternalComparator: () => sameValueEqual
});
createCustomEqual({
	circular: true,
	createInternalComparator: () => sameValueEqual,
	strict: true
});
/**
* Create a custom equality comparison method.
*
* This can be done to create very targeted comparisons in extreme hot-path scenarios
* where the standard methods are not performant enough, but can also be used to provide
* support for legacy environments that do not support expected features like
* `RegExp.prototype.flags` out of the box.
*/
function createCustomEqual(options = {}) {
	const { circular = false, createInternalComparator: createCustomInternalComparator, createState, strict = false } = options;
	const comparator = createEqualityComparator(createEqualityComparatorConfig(options));
	return createIsEqual({
		circular,
		comparator,
		createState,
		equals: createCustomInternalComparator ? createCustomInternalComparator(comparator) : createInternalEqualityComparator(comparator),
		strict
	});
}
function e(e, t, n) {
	let r = (n) => e(n, ...t);
	return n === void 0 ? r : Object.assign(r, {
		lazy: n,
		lazyArgs: t
	});
}
function t$1(t, n, r) {
	let i = t.length - n.length;
	if (i === 0) return t(...n);
	if (i === 1) return e(t, n, r);
	throw Error(`Wrong number of arguments`);
}
function t(...t) {
	return t$1(n, t);
}
function n(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) n[r] = t(i, r, e);
	return n;
}
function createHooksForModel($atom) {
	const $likec4model = /* @__PURE__ */ computed($atom, (data) => LikeC4Model.create(data));
	function updateModel(data) {
		const current = $atom.get();
		const next = {
			...data,
			views: t(data.views, (next) => {
				const currentView = current.views[next.id];
				return deepEqual(currentView, next) ? currentView : next;
			})
		};
		if (shallowEqual(next.views, current.views) && deepEqual(next, current)) return;
		$atom.set(next);
	}
	const $likec4views = /* @__PURE__ */ computed($likec4model, (model) => [...model.views()].map((v) => v.$layouted));
	function useLikeC4Model() {
		return useStore($likec4model);
	}
	function useLikeC4Views() {
		return useStore($likec4views);
	}
	function useLikeC4View(viewId) {
		return useStore(useMemo(() => /* @__PURE__ */ computed($likec4model, (model) => model.findView(viewId)?.$layouted ?? null), [viewId]));
	}
	return {
		updateModel,
		$likec4model,
		useLikeC4Model,
		useLikeC4Views,
		useLikeC4View
	};
}
var { updateModel, $likec4model, useLikeC4Model, useLikeC4Views, useLikeC4View } = createHooksForModel(/* @__PURE__ */ atom({
	_stage: "layouted",
	projectId: "mind-blueprint-spike",
	project: {
		id: "mind-blueprint-spike",
		title: "Mind Blueprint Spike"
	},
	specification: {
		tags: {
			deprecated: { color: "rgb(100,100,100)" },
			next: { color: "tomato" },
			teamA: { color: "grass" },
			teamB: { color: "blue" },
			v1: { color: "ruby" },
			v1_1: { color: "orange" },
			v2: { color: "indigo" }
		},
		elements: {
			actor: { style: {
				shape: "person",
				color: "green"
			} },
			system: {
				notation: "Sistema de Software",
				style: { opacity: 20 }
			},
			"external-system": {
				notation: "Sistema de Software Externo",
				style: {
					opacity: 20,
					color: "muted"
				}
			},
			application: { style: {} },
			component: { style: { opacity: 20 } },
			service: { style: {} },
			webapp: {
				notation: "Aplicação Web",
				tags: ["teamA"],
				style: { shape: "browser" }
			},
			mobile: {
				notation: "Aplicação Mobile",
				tags: ["teamA"],
				style: { shape: "mobile" }
			},
			database: {
				technology: "PostgreSQL",
				notation: "Banco de Dados",
				style: {
					shape: "storage",
					icon: "tech:postgresql",
					opacity: 30
				}
			},
			"db-table": {
				notation: "Tabela de Banco de Dados",
				style: {
					shape: "storage",
					icon: "tech:postgresql"
				}
			},
			cockpit: {
				notation: "Cockpit de Execução Local",
				style: {
					shape: "browser",
					color: "indigo"
				}
			},
			executionloop: {
				notation: "Execution Loop /op",
				style: {
					shape: "queue",
					color: "sky"
				}
			},
			worker: {
				notation: "Worker / Enforcement",
				style: {
					shape: "rectangle",
					color: "amber"
				}
			}
		},
		relationships: {
			solid: { style: { line: "solid" } },
			"many-to-many": { style: { line: "dotted" } }
		},
		deployments: {},
		customColors: {}
	},
	elements: {
		lucas: {
			style: {
				shape: "person",
				color: "green"
			},
			title: "Lucas",
			kind: "actor",
			id: "lucas"
		},
		hermes: {
			style: {
				shape: "person",
				color: "green"
			},
			description: { txt: "Orquestra a continuidade, valida outputs e evolui o blueprint." },
			title: "Hermes Principal",
			kind: "actor",
			id: "hermes"
		},
		agents: {
			notation: "Sistema de Software Externo",
			style: {
				opacity: 20,
				color: "muted"
			},
			technology: "Hermes / Claude / Codex / futuros workers",
			description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
			title: "Agentes de Execução",
			kind: "external-system",
			id: "agents"
		},
		likec4: {
			notation: "Sistema de Software Externo",
			style: {
				opacity: 20,
				color: "muted"
			},
			technology: "LikeC4 DSL + CLI + MCP",
			description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
			title: "LikeC4 Blueprint",
			kind: "external-system",
			id: "likec4"
		},
		python: {
			notation: "Worker / Enforcement",
			style: {
				shape: "rectangle",
				color: "amber"
			},
			technology: "Python · psycopg · worker",
			description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
			title: "Python / Hermes — Enforcement & Pipeline",
			kind: "worker",
			id: "python"
		},
		braide: {
			notation: "Cockpit de Execução Local",
			style: {
				shape: "browser",
				color: "indigo"
			},
			technology: "Electron + Next.js · agente Codex/GPT via ACP",
			description: { md: "Cockpit de execução local para código e LikeC4 (Cenário C, 2026-06-22).\nHumano-no-loop: Lucas desenvolve aqui; o agente ACP gera código.\nProtocolo anti-bagunça: código vai para o git; o .c4 é o arquivo-ponte Braide → Mind." },
			title: "Braide Cockpit",
			kind: "cockpit",
			id: "braide"
		},
		harness: {
			notation: "Execution Loop /op",
			style: {
				shape: "queue",
				color: "sky"
			},
			technology: "claude --resume · codex exec · orchestrator.py · tmux · hooks",
			description: { md: "Execution loop controlado, orientado a tasks do Supabase.\nSubordinado ao data plane: não é runtime autônomo." },
			title: "Harness Local /op",
			kind: "executionloop",
			id: "harness"
		},
		gptweb: {
			notation: "Sistema de Software Externo",
			style: {
				opacity: 20,
				color: "muted"
			},
			technology: "Web LLM + integração nativa com Supabase",
			description: { txt: "Consumidor conversacional do snapshot de arquitetura publicado." },
			title: "GPT Web",
			kind: "external-system",
			id: "gptweb"
		},
		claudeweb: {
			notation: "Sistema de Software Externo",
			style: {
				opacity: 20,
				color: "muted"
			},
			technology: "Web LLM + integração nativa com Supabase",
			description: { txt: "Segundo consumidor conversacional do snapshot de arquitetura publicado." },
			title: "Claude Web",
			kind: "external-system",
			id: "claudeweb"
		},
		mind: {
			notation: "Sistema de Software",
			style: { opacity: 20 },
			description: { md: "Superfície de continuidade voltada ao humano e candidata a runtime do ecossistema multiagente.\nFase atual: arquitetura primeiro." },
			title: "Mind Runtime",
			kind: "system",
			id: "mind"
		},
		supabase: {
			notation: "Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql",
				opacity: 30
			},
			technology: "PostgreSQL / Supabase",
			description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
			title: "Supabase / Estado do /op",
			kind: "database",
			id: "supabase"
		},
		"likec4.source": {
			style: { opacity: 20 },
			technology: "model.c4 + model.views.c4",
			description: { txt: "Fonte canônica de arquitetura como código, escrita por humanos e agentes." },
			title: "Fonte do Blueprint",
			kind: "component",
			id: "likec4.source"
		},
		"likec4.export": {
			style: { opacity: 20 },
			technology: "exports.json",
			description: { txt: "Export estrutural orientado a máquina, gerado a partir da fonte canônica." },
			title: "Export Técnico",
			kind: "component",
			id: "likec4.export"
		},
		"python.enforce": {
			style: { opacity: 20 },
			technology: "Validação determinística",
			description: { txt: "Verifica contrato, identidade e ownership de execução antes de side-effects (T13/T19)." },
			title: "Enforcement de Contrato",
			kind: "component",
			id: "python.enforce"
		},
		"python.pipeline": {
			style: { opacity: 20 },
			technology: "Worker de publicação",
			description: { txt: "Executa a cadeia LikeC4 → snapshot → Supabase (T14C)." },
			title: "Worker de Pipeline",
			kind: "component",
			id: "python.pipeline"
		},
		"braide.session": {
			style: { opacity: 20 },
			technology: "git worktree + sessão Braide",
			description: { txt: "Isola trabalho paralelo; cada sessão tem seu slice de código." },
			title: "Sessão / Worktree",
			kind: "component",
			id: "braide.session"
		},
		"braide.acp": {
			style: { opacity: 20 },
			technology: "Codex / GPT via ACP",
			description: { txt: "Gera e edita código dentro da sessão local." },
			title: "Agente ACP",
			kind: "component",
			id: "braide.acp"
		},
		"braide.bridgeC4": {
			style: { opacity: 20 },
			technology: "arquivo .c4 versionado em git",
			description: { md: "Handoff arquitetural: só decisão + arquitetura promovidas ao Mind.\nSync entre sessões/worktrees paralelas é por disciplina git — o Braide não tem sync nativo do .c4 (T18)." },
			title: "Ponte .c4",
			kind: "component",
			id: "braide.bridgeC4"
		},
		"harness.loop": {
			style: { opacity: 20 },
			technology: "orchestrator.py",
			description: { txt: "orquestrador → task → execução → validação → próxima decisão." },
			title: "Orquestrador de Jobs",
			kind: "component",
			id: "harness.loop"
		},
		"harness.runner": {
			style: { opacity: 20 },
			technology: "claude --resume / codex exec",
			description: { txt: "Executa a task reivindicada e produz evidência." },
			title: "Runner de Agente",
			kind: "component",
			id: "harness.runner"
		},
		"harness.gates": {
			style: { opacity: 20 },
			technology: "SessionStart / Stop / TeammateIdle",
			description: { txt: "Budget gates, stop conditions e continuidade." },
			title: "Hooks & Gates",
			kind: "component",
			id: "harness.gates"
		},
		"mind.ui": {
			notation: "Aplicação Web",
			style: { shape: "browser" },
			tags: ["teamA"],
			technology: "Web UI / Mini App / Dashboard",
			description: { txt: "Mostra continuidade do projeto, contexto, outputs e próximos passos." },
			title: "Mind UI",
			kind: "webapp",
			id: "mind.ui"
		},
		"mind.systemic": {
			style: {},
			technology: "Camada lógica — realizada pelo Python worker + Harness /op",
			description: { md: "Camada lógica que governa o comportamento dos agentes:\nfluxo, roteamento, contratos, disciplina e auditoria.\nÉ o \"o quê\"; a realização concreta é o Python worker (enforce/pipeline) + o Harness /op." },
			title: "Camada de Código Sistêmico",
			kind: "service",
			id: "mind.systemic"
		},
		"mind.context": {
			style: {},
			technology: "A definir",
			description: { txt: "Recupera onde paramos e entrega contexto utilizável a humanos e agentes." },
			title: "Camada de Entrega de Contexto",
			kind: "service",
			id: "mind.context"
		},
		"mind.registry": {
			style: {},
			technology: "A definir",
			description: { txt: "Torna frentes e subprojetos entidades de primeira classe no runtime." },
			title: "Registro de Frentes & Subprojetos",
			kind: "service",
			id: "mind.registry"
		},
		"mind.blueprint": {
			style: {},
			technology: "Worker / automação / bridge",
			description: { md: "Automatiza a cadeia da fonte LikeC4 até um snapshot publicado no Supabase\nque LLMs web podem consultar sem export manual a cada turno." },
			title: "Pipeline de Publicação do Blueprint",
			kind: "service",
			id: "mind.blueprint"
		},
		"supabase.projectHome": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Project Home",
			kind: "db-table",
			id: "supabase.projectHome"
		},
		"supabase.tasks": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Agent Tasks",
			kind: "db-table",
			id: "supabase.tasks"
		},
		"supabase.outputs": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Task Outputs",
			kind: "db-table",
			id: "supabase.outputs"
		},
		"supabase.knowledge": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Knowledge Items",
			kind: "db-table",
			id: "supabase.knowledge"
		},
		"supabase.artifacts": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Artifacts",
			kind: "db-table",
			id: "supabase.artifacts"
		},
		"supabase.events": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Project Events",
			kind: "db-table",
			id: "supabase.events"
		},
		"supabase.snapshots": {
			notation: "Tabela de Banco de Dados",
			style: {
				shape: "storage",
				icon: "tech:postgresql"
			},
			technology: "Postgresql",
			title: "Blueprint Snapshots",
			kind: "db-table",
			id: "supabase.snapshots"
		},
		"mind.systemic.flow": {
			style: { opacity: 20 },
			technology: "A definir",
			description: { txt: "Define estágios, transições e o que vem a seguir." },
			title: "Motor de Estado do Fluxo",
			kind: "component",
			id: "mind.systemic.flow"
		},
		"mind.systemic.routing": {
			style: { opacity: 20 },
			technology: "A definir",
			description: { txt: "Roteia trabalho entre agentes, tasks e frentes." },
			title: "Roteamento & Dispatch",
			kind: "component",
			id: "mind.systemic.routing"
		},
		"mind.systemic.contract": {
			style: { opacity: 20 },
			technology: "Lógico — realizado por python.enforce",
			description: { txt: "Verifica regras canônicas, formatos e contexto obrigatório. Realização determinística em python.enforce." },
			title: "Aplicação de Contrato",
			kind: "component",
			id: "mind.systemic.contract"
		},
		"mind.systemic.audit": {
			style: { opacity: 20 },
			technology: "A definir",
			description: { txt: "Padroniza evidências, títulos, resumos, estados e logs." },
			title: "Política de Auditoria & Log",
			kind: "component",
			id: "mind.systemic.audit"
		},
		"mind.blueprint.extract": {
			style: { opacity: 20 },
			technology: "LikeC4 CLI",
			description: { txt: "Gera o export técnico a partir da fonte canônica LikeC4." },
			title: "Gerador de Export",
			kind: "component",
			id: "mind.blueprint.extract"
		},
		"mind.blueprint.project": {
			style: { opacity: 20 },
			technology: "Etapa de transformação",
			description: { txt: "Projeta o export técnico em um snapshot de blueprint amigável para LLMs." },
			title: "Projetor de Snapshot para LLM",
			kind: "component",
			id: "mind.blueprint.project"
		},
		"mind.blueprint.publish": {
			style: { opacity: 20 },
			technology: "Cliente Supabase / API",
			description: { txt: "Publica o snapshot mais recente e metadados no repositório de continuidade." },
			title: "Publicador Supabase",
			kind: "component",
			id: "mind.blueprint.publish"
		}
	},
	relations: {
		"2b4bsw": {
			title: "lê a continuidade e direciona prioridades",
			source: { model: "lucas" },
			target: { model: "mind.ui" },
			id: "2b4bsw"
		},
		bz24s: {
			title: "pergunta sobre a arquitetura em linguagem natural",
			source: { model: "lucas" },
			target: { model: "gptweb" },
			id: "bz24s"
		},
		vfyv1w: {
			title: "pede leituras alternativas do mesmo blueprint",
			source: { model: "lucas" },
			target: { model: "claudeweb" },
			id: "vfyv1w"
		},
		cukeme: {
			title: "recebem trabalho e publicam estado",
			source: { model: "agents" },
			target: { model: "mind.systemic.routing" },
			id: "cukeme"
		},
		"10hpil5": {
			title: "recupera onde paramos",
			source: { model: "mind.context" },
			target: { model: "supabase.projectHome" },
			id: "10hpil5"
		},
		yqaccy: {
			title: "hidrata o contexto canônico",
			source: { model: "mind.context" },
			target: { model: "supabase.knowledge" },
			id: "yqaccy"
		},
		"1iyu5jt": {
			title: "mapeia frentes e subprojetos",
			source: { model: "mind.registry" },
			target: { model: "supabase.knowledge" },
			id: "1iyu5jt"
		},
		l45cam: {
			title: "reflete a hierarquia do projeto",
			source: { model: "mind.registry" },
			target: { model: "supabase.projectHome" },
			id: "l45cam"
		},
		"1toghsj": {
			title: "reivindica, atualiza e encerra tasks",
			source: { model: "mind.systemic.routing" },
			target: { model: "supabase.tasks" },
			id: "1toghsj"
		},
		kt4xob: {
			title: "lê regras e decisões canônicas",
			source: { model: "mind.systemic.contract" },
			target: { model: "supabase.knowledge" },
			id: "kt4xob"
		},
		ix1ruj: {
			title: "escreve evidências e resumos",
			source: { model: "mind.systemic.audit" },
			target: { model: "supabase.outputs" },
			id: "ix1ruj"
		},
		thwaih: {
			title: "ancora payloads pesados",
			source: { model: "mind.systemic.audit" },
			target: { model: "supabase.artifacts" },
			id: "thwaih"
		},
		"19mamyy": {
			title: "registra mudanças de continuidade",
			source: { model: "mind.systemic.audit" },
			target: { model: "supabase.events" },
			id: "19mamyy"
		},
		zbshh4: {
			title: "mostra a continuidade do Project Home",
			source: { model: "mind.ui" },
			target: { model: "supabase.projectHome" },
			id: "zbshh4"
		},
		bplrub: {
			title: "abre as views do blueprint",
			source: { model: "mind.ui" },
			target: { model: "likec4" },
			id: "bplrub"
		},
		"1uyg0f3": {
			title: "pode consultar contratos e limites arquiteturais",
			source: { model: "mind.systemic.contract" },
			target: { model: "likec4" },
			id: "1uyg0f3"
		},
		"1f429e": {
			title: "lê os arquivos-fonte canônicos",
			source: { model: "mind.blueprint.extract" },
			target: { model: "likec4.source" },
			id: "1f429e"
		},
		"1s7fls4": {
			title: "gera o export técnico",
			source: { model: "mind.blueprint.extract" },
			target: { model: "likec4.export" },
			id: "1s7fls4"
		},
		d9v70d: {
			title: "transforma o export estrutural",
			source: { model: "mind.blueprint.project" },
			target: { model: "likec4.export" },
			id: "d9v70d"
		},
		"1nigh98": {
			title: "publica o snapshot atual do blueprint",
			source: { model: "mind.blueprint.publish" },
			target: { model: "supabase.snapshots" },
			id: "1nigh98"
		},
		"19wmxqn": {
			title: "pode ancorar artifacts de snapshots versionados",
			source: { model: "mind.blueprint.publish" },
			target: { model: "supabase.artifacts" },
			id: "19wmxqn"
		},
		"1dzqify": {
			title: "registra publicação e atualidade",
			source: { model: "mind.blueprint.publish" },
			target: { model: "supabase.events" },
			id: "1dzqify"
		},
		"1inc88k": {
			title: "lê o snapshot do blueprint amigável para LLM",
			source: { model: "gptweb" },
			target: { model: "supabase.snapshots" },
			id: "1inc88k"
		},
		xu3y5m: {
			title: "lê o snapshot do blueprint amigável para LLM",
			source: { model: "claudeweb" },
			target: { model: "supabase.snapshots" },
			id: "xu3y5m"
		},
		te18lp: {
			title: "delega enforcement determinístico",
			source: { model: "mind.systemic.contract" },
			target: { model: "python.enforce" },
			id: "te18lp"
		},
		tbq3u7: {
			title: "valida ownership e estado antes do side-effect",
			source: { model: "python.enforce" },
			target: { model: "supabase.tasks" },
			id: "tbq3u7"
		},
		"1g3qijg": {
			title: "publica outputs validados",
			source: { model: "python.enforce" },
			target: { model: "supabase.outputs" },
			id: "1g3qijg"
		},
		"1qezf2r": {
			title: "assume a lógica de projeção",
			source: { model: "python.pipeline" },
			target: { model: "mind.blueprint.project" },
			id: "1qezf2r"
		},
		"18h8oke": {
			title: "executa o worker de publicação",
			source: { model: "python.pipeline" },
			target: { model: "mind.blueprint.publish" },
			id: "18h8oke"
		},
		"5uetep": {
			title: "desenvolve código e arquitetura no cockpit local",
			source: { model: "lucas" },
			target: { model: "braide" },
			id: "5uetep"
		},
		"1p8r6f5": {
			title: "promove a arquitetura ao blueprint canônico",
			source: { model: "braide.bridgeC4" },
			target: { model: "likec4.source" },
			id: "1p8r6f5"
		},
		"1mx1b3e": {
			title: "dispara e acompanha o loop /op",
			source: { model: "lucas" },
			target: { model: "harness" },
			id: "1mx1b3e"
		},
		"1660z0j": {
			title: "reivindica, atualiza e encerra tasks",
			source: { model: "harness.loop" },
			target: { model: "supabase.tasks" },
			id: "1660z0j"
		},
		"1oidkd8": {
			title: "invoca os agentes de execução",
			source: { model: "harness.loop" },
			target: { model: "agents" },
			id: "1oidkd8"
		},
		lcskfv: {
			title: "grava evidência e resultados",
			source: { model: "harness.runner" },
			target: { model: "supabase.outputs" },
			id: "lcskfv"
		},
		"1vz6r2x": {
			title: "ancora payloads pesados",
			source: { model: "harness.runner" },
			target: { model: "supabase.artifacts" },
			id: "1vz6r2x"
		},
		"1rglzw5": {
			title: "submete output para validação antes de fechar",
			source: { model: "harness.runner" },
			target: { model: "python.enforce" },
			id: "1rglzw5"
		},
		"1jxsfcs": {
			title: "lê regras, budget gates e stop conditions",
			source: { model: "harness.gates" },
			target: { model: "supabase.knowledge" },
			id: "1jxsfcs"
		},
		l6jasw: {
			title: "lê a continuidade e direciona o próximo passo",
			source: { model: "hermes" },
			target: { model: "mind.ui" },
			id: "l6jasw"
		},
		"1xm4scx": {
			title: "modela a arquitetura e as views",
			source: { model: "hermes" },
			target: { model: "likec4" },
			id: "1xm4scx"
		},
		"19xnjer": {
			title: "edita código na worktree",
			source: { model: "braide.acp" },
			target: { model: "braide.session" },
			id: "19xnjer"
		},
		"1iest3y": {
			title: "atualiza o .c4 quando a arquitetura muda",
			source: { model: "braide.session" },
			target: { model: "braide.bridgeC4" },
			id: "1iest3y"
		},
		"9l25k0": {
			title: "despacha a task para execução",
			source: { model: "harness.loop" },
			target: { model: "harness.runner" },
			id: "9l25k0"
		},
		"1qcthnj": {
			title: "reporta estado para gates de orçamento e parada",
			source: { model: "harness.runner" },
			target: { model: "harness.gates" },
			id: "1qcthnj"
		},
		tnjhcm: {
			title: "abre estado, tasks e caminhos operacionais",
			source: { model: "mind.ui" },
			target: { model: "mind.systemic" },
			id: "tnjhcm"
		},
		"1w4uh8l": {
			title: "recupera a continuidade",
			source: { model: "mind.ui" },
			target: { model: "mind.context" },
			id: "1w4uh8l"
		},
		"13su3im": {
			title: "mostra frentes e subprojetos",
			source: { model: "mind.ui" },
			target: { model: "mind.registry" },
			id: "13su3im"
		},
		vzqdln: {
			title: "mostra a atualidade do snapshot e o status de publicação",
			source: { model: "mind.ui" },
			target: { model: "mind.blueprint" },
			id: "vzqdln"
		},
		"661q4m": {
			title: "informa qual etapa vem a seguir",
			source: { model: "mind.systemic.flow" },
			target: { model: "mind.systemic.routing" },
			id: "661q4m"
		},
		"11qzehz": {
			title: "solicita validação antes do dispatch ou do encerramento",
			source: { model: "mind.systemic.routing" },
			target: { model: "mind.systemic.contract" },
			id: "11qzehz"
		},
		"1rvb2t": {
			title: "emite evidências verificadas e resultados de política",
			source: { model: "mind.systemic.contract" },
			target: { model: "mind.systemic.audit" },
			id: "1rvb2t"
		}
	},
	globals: {
		predicates: {},
		dynamicPredicates: {},
		styles: {}
	},
	views: {
		index: {
			_type: "element",
			tags: null,
			links: null,
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: { md: "Panorama de alto nível do projeto Ecossistema Multiagente.\nO LikeC4 é o centro do blueprint; o Mind é o candidato a runtime." },
			title: "Panorama do Mind — fase de arquitetura",
			id: "index",
			autoLayout: { direction: "TB" },
			notation: { nodes: [
				{
					title: "Cockpit de Execução Local",
					shape: "browser",
					color: "indigo",
					kinds: ["cockpit"]
				},
				{
					title: "Execution Loop /op",
					shape: "queue",
					color: "sky",
					kinds: ["executionloop"]
				},
				{
					title: "Sistema de Software",
					shape: "rectangle",
					color: "primary",
					kinds: ["system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "muted",
					kinds: ["external-system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "green",
					kinds: ["external-system"]
				},
				{
					title: "Worker / Enforcement",
					shape: "rectangle",
					color: "amber",
					kinds: ["worker"]
				},
				{
					title: "Banco de Dados",
					shape: "storage",
					color: "primary",
					kinds: ["database"]
				}
			] },
			hash: "_vdlQa_7ducd_flf2CIHsmQw291isDo299fDiSFRsYg",
			bounds: {
				x: 0,
				y: 0,
				width: 2844,
				height: 1962
			},
			nodes: [
				{
					id: "lucas",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [
						"1iw2xej",
						"12hfhci",
						"1kwa3ch",
						"1etcp60",
						"uwttl8"
					],
					title: "Lucas",
					modelRef: "lucas",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 1214,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 131,
						y: 76,
						width: 57,
						height: 24
					}
				},
				{
					id: "hermes",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["3zhgdu", "6zcvr4"],
					title: "Hermes Principal",
					modelRef: "hermes",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { txt: "Orquestra a continuidade, valida outputs e evolui o blueprint." },
					tags: [],
					kind: "actor",
					x: 191,
					y: 0,
					width: 321,
					height: 180,
					labelBBox: {
						x: 18,
						y: 56,
						width: 286,
						height: 65
					}
				},
				{
					id: "braide",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1iw2xej"],
					outEdges: ["hxjpr"],
					title: "Braide Cockpit",
					modelRef: "braide",
					shape: "browser",
					color: "indigo",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { md: "Cockpit de execução local para código e LikeC4 (Cenário C, 2026-06-22).\nHumano-no-loop: Lucas desenvolve aqui; o agente ACP gera código.\nProtocolo anti-bagunça: código vai para o git; o .c4 é o arquivo-ponte Braide → Mind." },
					tags: [],
					notation: "Cockpit de Execução Local",
					technology: "Electron + Next.js · agente Codex/GPT via ACP",
					kind: "cockpit",
					x: 870,
					y: 339,
					width: 337,
					height: 189,
					labelBBox: {
						x: 22,
						y: 25,
						width: 293,
						height: 138
					}
				},
				{
					id: "harness",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["12hfhci"],
					outEdges: [
						"zcyjlc",
						"prl5ce",
						"wlyq60"
					],
					title: "Harness Local /op",
					modelRef: "harness",
					shape: "queue",
					color: "sky",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { md: "Execution loop controlado, orientado a tasks do Supabase.\nSubordinado ao data plane: não é runtime autônomo." },
					tags: [],
					notation: "Execution Loop /op",
					technology: "claude --resume · codex exec · orchestrator.py · tmux · hooks",
					kind: "executionloop",
					x: 1724,
					y: 348,
					width: 343,
					height: 172,
					labelBBox: {
						x: 22,
						y: 25,
						width: 299,
						height: 120
					}
				},
				{
					id: "gptweb",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1kwa3ch"],
					outEdges: ["fdzat7"],
					title: "GPT Web",
					modelRef: "gptweb",
					shape: "rectangle",
					color: "muted",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Consumidor conversacional do snapshot de arquitetura publicado." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Web LLM + integração nativa com Supabase",
					kind: "external-system",
					x: 2308,
					y: 344,
					width: 331,
					height: 180,
					labelBBox: {
						x: 18,
						y: 47,
						width: 296,
						height: 84
					}
				},
				{
					id: "claudeweb",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1etcp60"],
					outEdges: ["z0ogn6"],
					title: "Claude Web",
					modelRef: "claudeweb",
					shape: "rectangle",
					color: "muted",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Segundo consumidor conversacional do snapshot de arquitetura publicado." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Web LLM + integração nativa com Supabase",
					kind: "external-system",
					x: 166,
					y: 344,
					width: 371,
					height: 180,
					labelBBox: {
						x: 18,
						y: 47,
						width: 336,
						height: 84
					}
				},
				{
					id: "agents",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["zcyjlc"],
					outEdges: ["1ytkrqm"],
					title: "Agentes de Execução",
					modelRef: "agents",
					shape: "rectangle",
					color: "muted",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Hermes / Claude / Codex / futuros workers",
					kind: "external-system",
					x: 1514,
					y: 689,
					width: 341,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 305,
						height: 85
					}
				},
				{
					id: "python",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["prl5ce", "bwm9u8"],
					outEdges: ["lco3o0", "173cx30"],
					title: "Python / Hermes — Enforcement & Pipeline",
					modelRef: "python",
					shape: "rectangle",
					color: "amber",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
					tags: [],
					notation: "Worker / Enforcement",
					technology: "Python · psycopg · worker",
					kind: "worker",
					x: 1721,
					y: 1432,
					width: 425,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 390,
						height: 139
					}
				},
				{
					id: "mind",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"uwttl8",
						"6zcvr4",
						"1ytkrqm",
						"lco3o0"
					],
					outEdges: [
						"44x114",
						"bwm9u8",
						"cs42xy"
					],
					title: "Mind Runtime",
					modelRef: "mind",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "lg"
					},
					description: { md: "Superfície de continuidade voltada ao humano e candidata a runtime do ecossistema multiagente.\nFase atual: arquitetura primeiro." },
					tags: [],
					notation: "Sistema de Software",
					kind: "system",
					navigateTo: "mind",
					x: 1207,
					y: 1029,
					width: 432,
					height: 234,
					labelBBox: {
						x: 26,
						y: 55,
						width: 380,
						height: 119
					}
				},
				{
					id: "likec4",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"3zhgdu",
						"hxjpr",
						"44x114"
					],
					outEdges: [],
					title: "LikeC4 Blueprint",
					modelRef: "likec4",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 20,
						size: "lg"
					},
					description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "LikeC4 DSL + CLI + MCP",
					kind: "external-system",
					navigateTo: "blueprint",
					x: 783,
					y: 1405,
					width: 420,
					height: 234,
					labelBBox: {
						x: 30,
						y: 45,
						width: 359,
						height: 141
					}
				},
				{
					id: "supabase",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"173cx30",
						"wlyq60",
						"fdzat7",
						"z0ogn6",
						"cs42xy"
					],
					outEdges: [],
					title: "Supabase / Estado do /op",
					modelRef: "supabase",
					shape: "storage",
					color: "primary",
					icon: "tech:postgresql",
					style: {
						opacity: 30,
						size: "md"
					},
					description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
					tags: [],
					notation: "Banco de Dados",
					technology: "PostgreSQL / Supabase",
					kind: "database",
					navigateTo: "continuity",
					x: 1757,
					y: 1782,
					width: 354,
					height: 180,
					labelBBox: {
						x: 46,
						y: 37,
						width: 292,
						height: 103
					}
				}
			],
			edges: [
				{
					id: "1iw2xej",
					parent: null,
					source: "lucas",
					target: "braide",
					label: "desenvolve código e arquitetura no \ncockpit local",
					relations: ["5uetep"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1214, 134],
						[1160, 157],
						[1103, 191],
						[1067, 240],
						[1048, 266],
						[1039, 299],
						[1036, 330]
					],
					labelBBox: {
						x: 1068,
						y: 241,
						width: 222,
						height: 35
					}
				},
				{
					id: "12hfhci",
					parent: null,
					source: "lucas",
					target: "harness",
					label: "dispara e acompanha o loop /op",
					relations: ["1mx1b3e"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1509, 180],
						[1586, 230],
						[1681, 292],
						[1758, 343]
					],
					labelBBox: {
						x: 1652,
						y: 249,
						width: 204,
						height: 18
					}
				},
				{
					id: "1kwa3ch",
					parent: null,
					source: "lucas",
					target: "gptweb",
					label: "pergunta sobre a arquitetura em \nlinguagem natural",
					relations: ["bz24s"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1534, 136],
						[1634, 165],
						[1767, 204],
						[1884, 240],
						[2024, 283],
						[2181, 335],
						[2298, 374]
					],
					labelBBox: {
						x: 1998,
						y: 241,
						width: 204,
						height: 35
					}
				},
				{
					id: "1etcp60",
					parent: null,
					source: "lucas",
					target: "claudeweb",
					label: "pede leituras alternativas do mesmo \nblueprint",
					relations: ["vfyv1w"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1214, 124],
						[1096, 151],
						[931, 191],
						[790, 240],
						[708, 268],
						[620, 306],
						[544, 340]
					],
					labelBBox: {
						x: 791,
						y: 241,
						width: 229,
						height: 35
					}
				},
				{
					id: "uwttl8",
					parent: null,
					source: "lucas",
					target: "mind",
					label: "lê a continuidade e direciona \nprioridades",
					relations: ["2b4bsw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1378, 180],
						[1387, 367],
						[1407, 802],
						[1417, 1018]
					],
					labelBBox: {
						x: 1400,
						y: 590,
						width: 182,
						height: 35
					}
				},
				{
					id: "3zhgdu",
					parent: null,
					source: "hermes",
					target: "likec4",
					label: "modela a arquitetura e as views",
					relations: ["1xm4scx"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[191, 171],
						[98, 229],
						[0, 318],
						[0, 433],
						[0, 433],
						[0, 433],
						[0, 1146],
						[0, 1310],
						[480, 1428],
						[773, 1484]
					],
					labelBBox: {
						x: 1,
						y: 768,
						width: 202,
						height: 18
					}
				},
				{
					id: "6zcvr4",
					parent: null,
					source: "hermes",
					target: "mind",
					label: "lê a continuidade e direciona o próximo \npasso",
					relations: ["l6jasw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[513, 144],
						[561, 167],
						[610, 198],
						[644, 240],
						[758, 379],
						[678, 466],
						[754, 629],
						[833, 795],
						[847, 854],
						[990, 968],
						[1051, 1017],
						[1126, 1054],
						[1197, 1081]
					],
					labelBBox: {
						x: 755,
						y: 590,
						width: 248,
						height: 35
					}
				},
				{
					id: "1ytkrqm",
					parent: null,
					source: "agents",
					target: "mind",
					label: "recebem trabalho e publicam estado",
					relations: ["cukeme"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1621, 869],
						[1588, 914],
						[1548, 971],
						[1512, 1020]
					],
					labelBBox: {
						x: 1578,
						y: 938,
						width: 230,
						height: 18
					}
				},
				{
					id: "zcyjlc",
					parent: null,
					source: "harness",
					target: "agents",
					label: "invoca os agentes de execução",
					relations: ["1oidkd8"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1791, 520],
						[1771, 541],
						[1751, 564],
						[1736, 589],
						[1720, 616],
						[1709, 649],
						[1701, 679]
					],
					labelBBox: {
						x: 1737,
						y: 599,
						width: 201,
						height: 18
					}
				},
				{
					id: "hxjpr",
					parent: null,
					source: "braide",
					target: "likec4",
					label: "promove a arquitetura ao blueprint \ncanônico",
					relations: ["1p8r6f5"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1035, 529],
						[1027, 724],
						[1008, 1175],
						[998, 1395]
					],
					labelBBox: {
						x: 1019,
						y: 930,
						width: 218,
						height: 35
					}
				},
				{
					id: "44x114",
					parent: null,
					source: "mind",
					target: "likec4",
					label: "[...]",
					relations: [
						"bplrub",
						"1uyg0f3",
						"1f429e",
						"1s7fls4",
						"d9v70d"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1290, 1262],
						[1241, 1305],
						[1184, 1355],
						[1134, 1399]
					],
					labelBBox: {
						x: 1222,
						y: 1321,
						width: 25,
						height: 18
					}
				},
				{
					id: "lco3o0",
					parent: null,
					source: "python",
					target: "mind",
					label: "[...]",
					relations: ["1qezf2r", "18h8oke"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1898, 1432],
						[1879, 1395],
						[1853, 1353],
						[1820, 1322],
						[1771, 1278],
						[1709, 1244],
						[1649, 1217]
					],
					labelBBox: {
						x: 1843,
						y: 1321,
						width: 25,
						height: 18
					}
				},
				{
					id: "173cx30",
					parent: null,
					source: "python",
					target: "supabase",
					label: "[...]",
					relations: ["tbq3u7", "1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1934, 1612],
						[1934, 1661],
						[1934, 1721],
						[1934, 1771]
					],
					labelBBox: {
						x: 1935,
						y: 1698,
						width: 25,
						height: 18
					}
				},
				{
					id: "prl5ce",
					parent: null,
					source: "harness",
					target: "python",
					label: "submete output para validação antes de \nfechar",
					relations: ["1rglzw5"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1940, 520],
						[1949, 542],
						[1957, 566],
						[1962, 589],
						[1966, 607],
						[1962, 611],
						[1962, 629],
						[1957, 917],
						[1945, 1258],
						[1938, 1422]
					],
					labelBBox: {
						x: 1956,
						y: 930,
						width: 254,
						height: 35
					}
				},
				{
					id: "bwm9u8",
					parent: null,
					source: "mind",
					target: "python",
					label: "delega enforcement determinístico",
					relations: ["te18lp"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1493, 1262],
						[1515, 1292],
						[1540, 1322],
						[1568, 1345],
						[1611, 1381],
						[1662, 1411],
						[1712, 1436]
					],
					labelBBox: {
						x: 1569,
						y: 1323,
						width: 223,
						height: 18
					}
				},
				{
					id: "wlyq60",
					parent: null,
					source: "harness",
					target: "supabase",
					label: "[...]",
					relations: [
						"1660z0j",
						"lcskfv",
						"1vz6r2x",
						"1jxsfcs"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2068, 491],
						[2192, 543],
						[2339, 635],
						[2339, 778],
						[2339, 778],
						[2339, 778],
						[2339, 1523],
						[2339, 1648],
						[2227, 1738],
						[2121, 1795]
					],
					labelBBox: {
						x: 2340,
						y: 1133,
						width: 25,
						height: 18
					}
				},
				{
					id: "fdzat7",
					parent: null,
					source: "gptweb",
					target: "supabase",
					label: "lê o snapshot do blueprint amigável para \nLLM",
					relations: ["1inc88k"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2520, 524],
						[2551, 592],
						[2586, 688],
						[2586, 778],
						[2586, 778],
						[2586, 778],
						[2586, 1523],
						[2586, 1735],
						[2315, 1818],
						[2122, 1851]
					],
					labelBBox: {
						x: 2587,
						y: 1127,
						width: 256,
						height: 34
					}
				},
				{
					id: "z0ogn6",
					parent: null,
					source: "claudeweb",
					target: "supabase",
					label: "lê o snapshot do blueprint amigável para \nLLM",
					relations: ["xu3y5m"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[382, 524],
						[403, 593],
						[426, 690],
						[426, 778],
						[426, 778],
						[426, 778],
						[426, 1523],
						[426, 1791],
						[1342, 1853],
						[1746, 1867]
					],
					labelBBox: {
						x: 427,
						y: 1127,
						width: 256,
						height: 34
					}
				},
				{
					id: "cs42xy",
					parent: null,
					source: "mind",
					target: "supabase",
					label: "[...]",
					relations: [
						"10hpil5",
						"yqaccy",
						"1iyu5jt",
						"l45cam",
						"1toghsj",
						"kt4xob",
						"ix1ruj",
						"thwaih",
						"19mamyy",
						"zbshh4",
						"1nigh98",
						"19wmxqn",
						"1dzqify"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1456, 1262],
						[1490, 1368],
						[1550, 1525],
						[1639, 1639],
						[1680, 1692],
						[1736, 1740],
						[1788, 1779]
					],
					labelBBox: {
						x: 1640,
						y: 1509,
						width: 25,
						height: 18
					}
				}
			]
		},
		mind: {
			_type: "element",
			tags: null,
			links: null,
			viewOf: "mind",
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: null,
			title: "Mind Runtime",
			id: "mind",
			autoLayout: { direction: "TB" },
			notation: { nodes: [
				{
					title: "Aplicação Web",
					shape: "browser",
					color: "green",
					kinds: ["webapp"]
				},
				{
					title: "Sistema de Software",
					shape: "rectangle",
					color: "green",
					kinds: ["system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "secondary",
					kinds: ["external-system"]
				},
				{
					title: "Worker / Enforcement",
					shape: "rectangle",
					color: "secondary",
					kinds: ["worker"]
				},
				{
					title: "Banco de Dados",
					shape: "storage",
					color: "secondary",
					kinds: ["database"]
				}
			] },
			hash: "aTGjDpmQ8FVO1qZkCU8LvGQ11BYtvCvyLWos-ilSD1c",
			bounds: {
				x: 0,
				y: 0,
				width: 3591,
				height: 1229
			},
			nodes: [
				{
					id: "lucas",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["sl92qm"],
					title: "Lucas",
					modelRef: "lucas",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 1290,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 131,
						y: 76,
						width: 57,
						height: 24
					}
				},
				{
					id: "hermes",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["10sotoy", "3zhgdu"],
					title: "Hermes Principal",
					modelRef: "hermes",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { txt: "Orquestra a continuidade, valida outputs e evolui o blueprint." },
					tags: [],
					kind: "actor",
					x: 3269,
					y: 0,
					width: 321,
					height: 180,
					labelBBox: {
						x: 18,
						y: 56,
						width: 286,
						height: 65
					}
				},
				{
					id: "agents",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["43n0y7"],
					title: "Agentes de Execução",
					modelRef: "agents",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Hermes / Claude / Codex / futuros workers",
					kind: "external-system",
					x: 2912,
					y: 370,
					width: 341,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 305,
						height: 85
					}
				},
				{
					id: "python",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1bly4k1"],
					outEdges: ["jv2wmp", "173cx30"],
					title: "Python / Hermes — Enforcement & Pipeline",
					modelRef: "python",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
					tags: [],
					notation: "Worker / Enforcement",
					technology: "Python · psycopg · worker",
					kind: "worker",
					x: 2449,
					y: 710,
					width: 425,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 390,
						height: 138
					}
				},
				{
					id: "mind",
					parent: null,
					level: 0,
					children: [
						"mind.ui",
						"mind.systemic",
						"mind.context",
						"mind.registry",
						"mind.blueprint"
					],
					inEdges: [
						"sl92qm",
						"10sotoy",
						"43n0y7",
						"jv2wmp"
					],
					outEdges: [
						"9ai0yy",
						"1d77gc4",
						"13u7hbt",
						"1bly4k1",
						"1jgf1ev",
						"9bbgjb",
						"1795zst",
						"u013nd",
						"12gnkpz"
					],
					title: "Mind Runtime",
					modelRef: "mind",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Superfície de continuidade voltada ao humano e candidata a runtime do ecossistema multiagente.\nFase atual: arquitetura primeiro." },
					tags: [],
					notation: "Sistema de Software",
					kind: "system",
					depth: 1,
					x: 332,
					y: 288,
					width: 1822,
					height: 642,
					labelBBox: {
						x: 6,
						y: 0,
						width: 85,
						height: 15
					}
				},
				{
					id: "mind.ui",
					parent: "mind",
					level: 1,
					children: [],
					inEdges: ["sl92qm", "10sotoy"],
					outEdges: [
						"1l6vq61",
						"15lpdyh",
						"1847zab",
						"12zcbll",
						"9ai0yy",
						"1d77gc4"
					],
					title: "Mind UI",
					modelRef: "mind.ui",
					shape: "browser",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Mostra continuidade do projeto, contexto, outputs e próximos passos." },
					tags: ["teamA"],
					notation: "Aplicação Web",
					technology: "Web UI / Mini App / Dashboard",
					kind: "webapp",
					x: 1288,
					y: 370,
					width: 323,
					height: 180,
					labelBBox: {
						x: 22,
						y: 46,
						width: 279,
						height: 85
					}
				},
				{
					id: "mind.systemic",
					parent: "mind",
					level: 1,
					children: [],
					inEdges: ["43n0y7", "1l6vq61"],
					outEdges: [
						"13u7hbt",
						"1bly4k1",
						"1jgf1ev"
					],
					title: "Camada de Código Sistêmico",
					modelRef: "mind.systemic",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Camada lógica que governa o comportamento dos agentes:\nfluxo, roteamento, contratos, disciplina e auditoria.\nÉ o \"o quê\"; a realização concreta é o Python worker (enforce/pipeline) + o Harness /op." },
					tags: [],
					technology: "Camada lógica — realizada pelo Python worker + Harness /op",
					kind: "service",
					navigateTo: "systemic",
					x: 1738,
					y: 710,
					width: 376,
					height: 180,
					labelBBox: {
						x: 17,
						y: 19,
						width: 341,
						height: 138
					}
				},
				{
					id: "mind.context",
					parent: "mind",
					level: 1,
					children: [],
					inEdges: ["15lpdyh"],
					outEdges: ["9bbgjb"],
					title: "Camada de Entrega de Contexto",
					modelRef: "mind.context",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Recupera onde paramos e entrega contexto utilizável a humanos e agentes." },
					tags: [],
					technology: "A definir",
					kind: "service",
					x: 372,
					y: 710,
					width: 333,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 298,
						height: 84
					}
				},
				{
					id: "mind.registry",
					parent: "mind",
					level: 1,
					children: [],
					inEdges: ["1847zab"],
					outEdges: ["1795zst"],
					title: "Registro de Frentes & Subprojetos",
					modelRef: "mind.registry",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Torna frentes e subprojetos entidades de primeira classe no runtime." },
					tags: [],
					technology: "A definir",
					kind: "service",
					x: 816,
					y: 710,
					width: 346,
					height: 180,
					labelBBox: {
						x: 17,
						y: 46,
						width: 311,
						height: 84
					}
				},
				{
					id: "mind.blueprint",
					parent: "mind",
					level: 1,
					children: [],
					inEdges: ["jv2wmp", "12zcbll"],
					outEdges: ["u013nd", "12gnkpz"],
					title: "Pipeline de Publicação do Blueprint",
					modelRef: "mind.blueprint",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Automatiza a cadeia da fonte LikeC4 até um snapshot publicado no Supabase\nque LLMs web podem consultar sem export manual a cada turno." },
					tags: [],
					technology: "Worker / automação / bridge",
					kind: "service",
					navigateTo: "snapshots",
					x: 1272,
					y: 710,
					width: 355,
					height: 180,
					labelBBox: {
						x: 18,
						y: 28,
						width: 320,
						height: 120
					}
				},
				{
					id: "likec4",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"9ai0yy",
						"13u7hbt",
						"u013nd",
						"3zhgdu"
					],
					outEdges: [],
					title: "LikeC4 Blueprint",
					modelRef: "likec4",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "LikeC4 DSL + CLI + MCP",
					kind: "external-system",
					navigateTo: "blueprint",
					x: 2927,
					y: 1049,
					width: 336,
					height: 180,
					labelBBox: {
						x: 18,
						y: 28,
						width: 300,
						height: 121
					}
				},
				{
					id: "supabase",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"1d77gc4",
						"1jgf1ev",
						"9bbgjb",
						"1795zst",
						"12gnkpz",
						"173cx30"
					],
					outEdges: [],
					title: "Supabase / Estado do /op",
					modelRef: "supabase",
					shape: "storage",
					color: "secondary",
					icon: "tech:postgresql",
					style: {
						opacity: 15,
						size: "md"
					},
					description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
					tags: [],
					notation: "Banco de Dados",
					technology: "PostgreSQL / Supabase",
					kind: "database",
					navigateTo: "continuity",
					x: 1273,
					y: 1049,
					width: 354,
					height: 180,
					labelBBox: {
						x: 45,
						y: 37,
						width: 293,
						height: 103
					}
				}
			],
			edges: [
				{
					id: "sl92qm",
					parent: null,
					source: "lucas",
					target: "mind.ui",
					label: "lê a continuidade e direciona \nprioridades",
					relations: ["2b4bsw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1450, 180],
						[1450, 234],
						[1450, 304],
						[1450, 360]
					],
					labelBBox: {
						x: 1451,
						y: 241,
						width: 182,
						height: 35
					}
				},
				{
					id: "10sotoy",
					parent: null,
					source: "hermes",
					target: "mind.ui",
					label: "lê a continuidade e direciona o próximo \npasso",
					relations: ["l6jasw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[3269, 121],
						[2901, 189],
						[1999, 357],
						[1621, 427]
					],
					labelBBox: {
						x: 2618,
						y: 241,
						width: 248,
						height: 35
					}
				},
				{
					id: "43n0y7",
					parent: null,
					source: "agents",
					target: "mind.systemic",
					label: "recebem trabalho e publicam estado",
					relations: ["cukeme"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2912, 511],
						[2702, 572],
						[2346, 676],
						[2124, 741]
					],
					labelBBox: {
						x: 2540,
						y: 619,
						width: 230,
						height: 18
					}
				},
				{
					id: "jv2wmp",
					parent: null,
					source: "python",
					target: "mind.blueprint",
					label: "[...]",
					relations: ["1qezf2r", "18h8oke"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2449, 742],
						[2221, 684],
						[1876, 608],
						[1747, 640],
						[1694, 653],
						[1640, 678],
						[1592, 705]
					],
					labelBBox: {
						x: 1748,
						y: 617,
						width: 25,
						height: 18
					}
				},
				{
					id: "1l6vq61",
					parent: "mind",
					source: "mind.ui",
					target: "mind.systemic",
					label: "abre estado, tasks e caminhos \noperacionais",
					relations: ["tnjhcm"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1611, 513],
						[1669, 537],
						[1733, 569],
						[1785, 610],
						[1816, 635],
						[1844, 669],
						[1867, 701]
					],
					labelBBox: {
						x: 1823,
						y: 611,
						width: 194,
						height: 35
					}
				},
				{
					id: "15lpdyh",
					parent: "mind",
					source: "mind.ui",
					target: "mind.context",
					label: "recupera a continuidade",
					relations: ["1w4uh8l"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1288, 513],
						[1204, 541],
						[1100, 576],
						[1007, 610],
						[910, 646],
						[802, 689],
						[715, 725]
					],
					labelBBox: {
						x: 1008,
						y: 619,
						width: 154,
						height: 18
					}
				},
				{
					id: "1847zab",
					parent: "mind",
					source: "mind.ui",
					target: "mind.registry",
					label: "mostra frentes e subprojetos",
					relations: ["13su3im"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1323, 550],
						[1295, 570],
						[1266, 590],
						[1239, 610],
						[1198, 640],
						[1153, 673],
						[1113, 703]
					],
					labelBBox: {
						x: 1240,
						y: 619,
						width: 181,
						height: 18
					}
				},
				{
					id: "12zcbll",
					parent: "mind",
					source: "mind.ui",
					target: "mind.blueprint",
					label: "mostra a atualidade do snapshot e o \nstatus de publicação",
					relations: ["vzqdln"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1450, 550],
						[1450, 596],
						[1450, 652],
						[1450, 699]
					],
					labelBBox: {
						x: 1451,
						y: 611,
						width: 230,
						height: 35
					}
				},
				{
					id: "9ai0yy",
					parent: null,
					source: "mind.ui",
					target: "likec4",
					label: "abre as views do blueprint",
					relations: ["bplrub"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1611, 468],
						[1952, 487],
						[2729, 546],
						[2930, 710],
						[3029, 791],
						[3069, 940],
						[3084, 1039]
					],
					labelBBox: {
						x: 3061,
						y: 789,
						width: 167,
						height: 18
					}
				},
				{
					id: "1d77gc4",
					parent: null,
					source: "mind.ui",
					target: "supabase",
					label: "mostra a continuidade do Project Home",
					relations: ["zbshh4"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1288, 462],
						[854, 470],
						[-281, 529],
						[65, 930],
						[217, 1106],
						[919, 1135],
						[1261, 1139]
					],
					labelBBox: {
						x: 66,
						y: 789,
						width: 250,
						height: 18
					}
				},
				{
					id: "13u7hbt",
					parent: null,
					source: "mind.systemic",
					target: "likec4",
					label: "pode consultar contratos e limites \narquiteturais",
					relations: ["1uyg0f3"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2040, 889],
						[2093, 926],
						[2157, 965],
						[2220, 989],
						[2451, 1078],
						[2736, 1114],
						[2916, 1129]
					],
					labelBBox: {
						x: 2221,
						y: 951,
						width: 213,
						height: 34
					}
				},
				{
					id: "1bly4k1",
					parent: null,
					source: "mind.systemic",
					target: "python",
					label: "delega enforcement determinístico",
					relations: ["te18lp"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2114, 800],
						[2213, 800],
						[2335, 800],
						[2438, 800]
					],
					labelBBox: {
						x: 2170,
						y: 775,
						width: 223,
						height: 18
					}
				},
				{
					id: "1jgf1ev",
					parent: null,
					source: "mind.systemic",
					target: "supabase",
					label: "[...]",
					relations: [
						"1toghsj",
						"kt4xob",
						"ix1ruj",
						"thwaih",
						"19mamyy"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1822, 890],
						[1783, 922],
						[1737, 958],
						[1694, 989],
						[1666, 1009],
						[1635, 1029],
						[1605, 1047]
					],
					labelBBox: {
						x: 1747,
						y: 957,
						width: 25,
						height: 18
					}
				},
				{
					id: "9bbgjb",
					parent: null,
					source: "mind.context",
					target: "supabase",
					label: "[...]",
					relations: ["10hpil5", "yqaccy"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[680, 890],
						[707, 904],
						[734, 918],
						[761, 930],
						[925, 1001],
						[1121, 1058],
						[1262, 1094]
					],
					labelBBox: {
						x: 908,
						y: 957,
						width: 25,
						height: 18
					}
				},
				{
					id: "1795zst",
					parent: null,
					source: "mind.registry",
					target: "supabase",
					label: "[...]",
					relations: ["1iyu5jt", "l45cam"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1110, 890],
						[1175, 937],
						[1255, 996],
						[1321, 1044]
					],
					labelBBox: {
						x: 1234,
						y: 957,
						width: 25,
						height: 18
					}
				},
				{
					id: "u013nd",
					parent: null,
					source: "mind.blueprint",
					target: "likec4",
					label: "[...]",
					relations: [
						"1f429e",
						"1s7fls4",
						"d9v70d"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1516, 889],
						[1549, 927],
						[1592, 967],
						[1640, 989],
						[1862, 1094],
						[2579, 1126],
						[2916, 1135]
					],
					labelBBox: {
						x: 1641,
						y: 957,
						width: 25,
						height: 18
					}
				},
				{
					id: "12gnkpz",
					parent: null,
					source: "mind.blueprint",
					target: "supabase",
					label: "[...]",
					relations: [
						"1nigh98",
						"19wmxqn",
						"1dzqify"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1450, 889],
						[1450, 935],
						[1450, 991],
						[1450, 1038]
					],
					labelBBox: {
						x: 1451,
						y: 957,
						width: 25,
						height: 18
					}
				},
				{
					id: "3zhgdu",
					parent: null,
					source: "hermes",
					target: "likec4",
					label: "modela a arquitetura e as views",
					relations: ["1xm4scx"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[3424, 180],
						[3412, 338],
						[3373, 674],
						[3256, 930],
						[3237, 969],
						[3210, 1008],
						[3184, 1041]
					],
					labelBBox: {
						x: 3360,
						y: 619,
						width: 202,
						height: 18
					}
				},
				{
					id: "173cx30",
					parent: null,
					source: "python",
					target: "supabase",
					label: "[...]",
					relations: ["tbq3u7", "1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2588, 889],
						[2552, 926],
						[2507, 966],
						[2458, 989],
						[2316, 1057],
						[1889, 1102],
						[1638, 1124]
					],
					labelBBox: {
						x: 2516,
						y: 957,
						width: 25,
						height: 18
					}
				}
			]
		},
		systemic: {
			_type: "element",
			tags: null,
			links: null,
			viewOf: "mind.systemic",
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: { md: "Pergunta central da frente de pesquisa atual:\nque código governa o comportamento dos agentes, além do simples armazenamento de dados." },
			title: "Camada de Código Sistêmico",
			id: "systemic",
			autoLayout: { direction: "TB" },
			notation: { nodes: [
				{
					title: "Sistema de Software",
					shape: "rectangle",
					color: "secondary",
					kinds: ["system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "secondary",
					kinds: ["external-system"]
				},
				{
					title: "Worker / Enforcement",
					shape: "rectangle",
					color: "secondary",
					kinds: ["worker"]
				},
				{
					title: "Banco de Dados",
					shape: "storage",
					color: "secondary",
					kinds: ["database"]
				}
			] },
			hash: "tTR6FAY0LNQ1F0RvUPlt31IHsTB6TwvbSVuu6tkbrm8",
			bounds: {
				x: 0,
				y: 0,
				width: 1653,
				height: 1647
			},
			nodes: [
				{
					id: "agents",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["1kugwcd"],
					title: "Agentes de Execução",
					modelRef: "agents",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Hermes / Claude / Codex / futuros workers",
					kind: "external-system",
					x: 1286,
					y: 122,
					width: 341,
					height: 180,
					labelBBox: {
						x: 19,
						y: 47,
						width: 305,
						height: 84
					}
				},
				{
					id: "mind",
					parent: null,
					level: 0,
					children: ["mind.systemic"],
					inEdges: ["1kugwcd"],
					outEdges: [
						"16o728l",
						"5slp7p",
						"1x23eod",
						"1hmvwxn",
						"oz9z5w"
					],
					title: "Mind Runtime",
					modelRef: "mind",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Superfície de continuidade voltada ao humano e candidata a runtime do ecossistema multiagente.\nFase atual: arquitetura primeiro." },
					tags: [],
					notation: "Sistema de Software",
					kind: "system",
					depth: 2,
					navigateTo: "mind",
					x: 704,
					y: 8,
					width: 550,
					height: 1368,
					labelBBox: {
						x: 6,
						y: 0,
						width: 85,
						height: 15
					}
				},
				{
					id: "mind.systemic",
					parent: "mind",
					level: 1,
					children: [
						"mind.systemic.flow",
						"mind.systemic.routing",
						"mind.systemic.contract",
						"mind.systemic.audit"
					],
					inEdges: ["1kugwcd"],
					outEdges: [
						"16o728l",
						"5slp7p",
						"1x23eod",
						"1hmvwxn",
						"oz9z5w"
					],
					title: "Camada de Código Sistêmico",
					modelRef: "mind.systemic",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Camada lógica que governa o comportamento dos agentes:\nfluxo, roteamento, contratos, disciplina e auditoria.\nÉ o \"o quê\"; a realização concreta é o Python worker (enforce/pipeline) + o Harness /op." },
					tags: [],
					technology: "Camada lógica — realizada pelo Python worker + Harness /op",
					kind: "service",
					depth: 1,
					x: 736,
					y: 61,
					width: 486,
					height: 1283,
					labelBBox: {
						x: 6,
						y: 0,
						width: 179,
						height: 15
					}
				},
				{
					id: "mind.systemic.flow",
					parent: "mind.systemic",
					level: 2,
					children: [],
					inEdges: [],
					outEdges: ["pnqttw"],
					title: "Motor de Estado do Fluxo",
					modelRef: "mind.systemic.flow",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Define estágios, transições e o que vem a seguir." },
					tags: [],
					technology: "A definir",
					kind: "component",
					x: 776,
					y: 122,
					width: 320,
					height: 180,
					labelBBox: {
						x: 18,
						y: 47,
						width: 284,
						height: 84
					}
				},
				{
					id: "mind.systemic.routing",
					parent: "mind.systemic",
					level: 2,
					children: [],
					inEdges: ["1kugwcd", "pnqttw"],
					outEdges: ["i4z3ic", "16o728l"],
					title: "Roteamento & Dispatch",
					modelRef: "mind.systemic.routing",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Roteia trabalho entre agentes, tasks e frentes." },
					tags: [],
					technology: "A definir",
					kind: "component",
					x: 776,
					y: 445,
					width: 320,
					height: 180,
					labelBBox: {
						x: 32,
						y: 46,
						width: 257,
						height: 85
					}
				},
				{
					id: "mind.systemic.contract",
					parent: "mind.systemic",
					level: 2,
					children: [],
					inEdges: ["i4z3ic"],
					outEdges: [
						"zl26c5",
						"5slp7p",
						"1x23eod",
						"1hmvwxn"
					],
					title: "Aplicação de Contrato",
					modelRef: "mind.systemic.contract",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Verifica regras canônicas, formatos e contexto obrigatório. Realização determinística em python.enforce." },
					tags: [],
					technology: "Lógico — realizado por python.enforce",
					kind: "component",
					x: 776,
					y: 785,
					width: 320,
					height: 180,
					labelBBox: {
						x: 34,
						y: 37,
						width: 252,
						height: 103
					}
				},
				{
					id: "mind.systemic.audit",
					parent: "mind.systemic",
					level: 2,
					children: [],
					inEdges: ["zl26c5"],
					outEdges: ["oz9z5w"],
					title: "Política de Auditoria & Log",
					modelRef: "mind.systemic.audit",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Padroniza evidências, títulos, resumos, estados e logs." },
					tags: [],
					technology: "A definir",
					kind: "component",
					x: 776,
					y: 1124,
					width: 320,
					height: 180,
					labelBBox: {
						x: 26,
						y: 47,
						width: 269,
						height: 84
					}
				},
				{
					id: "likec4",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["5slp7p"],
					outEdges: [],
					title: "LikeC4 Blueprint",
					modelRef: "likec4",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "LikeC4 DSL + CLI + MCP",
					kind: "external-system",
					navigateTo: "blueprint",
					x: 330,
					y: 1124,
					width: 336,
					height: 180,
					labelBBox: {
						x: 18,
						y: 29,
						width: 300,
						height: 120
					}
				},
				{
					id: "python",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1x23eod"],
					outEdges: ["173cx30"],
					title: "Python / Hermes — Enforcement & Pipeline",
					modelRef: "python",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
					tags: [],
					notation: "Worker / Enforcement",
					technology: "Python · psycopg · worker",
					kind: "worker",
					x: 459,
					y: 1467,
					width: 425,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 390,
						height: 139
					}
				},
				{
					id: "supabase",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"16o728l",
						"1hmvwxn",
						"oz9z5w",
						"173cx30"
					],
					outEdges: [],
					title: "Supabase / Estado do /op",
					modelRef: "supabase",
					shape: "storage",
					color: "secondary",
					icon: "tech:postgresql",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
					tags: [],
					notation: "Banco de Dados",
					technology: "PostgreSQL / Supabase",
					kind: "database",
					navigateTo: "continuity",
					x: 1022,
					y: 1467,
					width: 354,
					height: 180,
					labelBBox: {
						x: 46,
						y: 37,
						width: 292,
						height: 103
					}
				}
			],
			edges: [
				{
					id: "1kugwcd",
					parent: null,
					source: "agents",
					target: "mind.systemic.routing",
					label: "recebem trabalho e publicam estado",
					relations: ["cukeme"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1313, 302],
						[1243, 345],
						[1160, 397],
						[1089, 440]
					],
					labelBBox: {
						x: 1213,
						y: 363,
						width: 230,
						height: 18
					}
				},
				{
					id: "pnqttw",
					parent: "mind.systemic",
					source: "mind.systemic.flow",
					target: "mind.systemic.routing",
					label: "informa qual etapa vem a seguir",
					relations: ["661q4m"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[936, 302],
						[936, 344],
						[936, 393],
						[936, 435]
					],
					labelBBox: {
						x: 937,
						y: 363,
						width: 204,
						height: 18
					}
				},
				{
					id: "i4z3ic",
					parent: "mind.systemic",
					source: "mind.systemic.routing",
					target: "mind.systemic.contract",
					label: "solicita validação antes do dispatch ou \ndo encerramento",
					relations: ["11qzehz"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[936, 625],
						[936, 671],
						[936, 727],
						[936, 775]
					],
					labelBBox: {
						x: 937,
						y: 686,
						width: 244,
						height: 35
					}
				},
				{
					id: "zl26c5",
					parent: "mind.systemic",
					source: "mind.systemic.contract",
					target: "mind.systemic.audit",
					label: "emite evidências verificadas e \nresultados de política",
					relations: ["1rvb2t"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[936, 965],
						[936, 1010],
						[936, 1067],
						[936, 1114]
					],
					labelBBox: {
						x: 937,
						y: 1026,
						width: 191,
						height: 35
					}
				},
				{
					id: "16o728l",
					parent: null,
					source: "mind.systemic.routing",
					target: "supabase",
					label: "reivindica, atualiza e encerra tasks",
					relations: ["1toghsj"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1096, 604],
						[1136, 626],
						[1177, 653],
						[1209, 685],
						[1366, 842],
						[1393, 909],
						[1448, 1124],
						[1476, 1233],
						[1499, 1277],
						[1448, 1376],
						[1430, 1412],
						[1402, 1442],
						[1370, 1466]
					],
					labelBBox: {
						x: 1434,
						y: 1034,
						width: 219,
						height: 18
					}
				},
				{
					id: "5slp7p",
					parent: null,
					source: "mind.systemic.contract",
					target: "likec4",
					label: "pode consultar contratos e limites \narquiteturais",
					relations: ["1uyg0f3"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[781, 965],
						[752, 983],
						[722, 1004],
						[695, 1025],
						[659, 1053],
						[622, 1087],
						[590, 1118]
					],
					labelBBox: {
						x: 696,
						y: 1026,
						width: 213,
						height: 35
					}
				},
				{
					id: "1x23eod",
					parent: null,
					source: "mind.systemic.contract",
					target: "python",
					label: "delega enforcement determinístico",
					relations: ["te18lp"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[777, 897],
						[546, 932],
						[138, 1009],
						[51, 1124],
						[-17, 1214],
						[-17, 1287],
						[51, 1376],
						[99, 1441],
						[292, 1490],
						[450, 1521]
					],
					labelBBox: {
						x: 52,
						y: 1204,
						width: 223,
						height: 18
					}
				},
				{
					id: "1hmvwxn",
					parent: null,
					source: "mind.systemic.contract",
					target: "supabase",
					label: "lê regras e decisões canônicas",
					relations: ["kt4xob"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1096, 958],
						[1120, 977],
						[1141, 999],
						[1156, 1025],
						[1234, 1158],
						[1229, 1343],
						[1216, 1456]
					],
					labelBBox: {
						x: 1224,
						y: 1204,
						width: 196,
						height: 18
					}
				},
				{
					id: "oz9z5w",
					parent: null,
					source: "mind.systemic.audit",
					target: "supabase",
					label: "[...]",
					relations: [
						"ix1ruj",
						"thwaih",
						"19mamyy"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1005, 1304],
						[1041, 1351],
						[1086, 1409],
						[1123, 1458]
					],
					labelBBox: {
						x: 1085,
						y: 1383,
						width: 25,
						height: 18
					}
				},
				{
					id: "173cx30",
					parent: null,
					source: "python",
					target: "supabase",
					label: "[...]",
					relations: ["tbq3u7", "1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[885, 1557],
						[927, 1557],
						[970, 1557],
						[1011, 1557]
					],
					labelBBox: {
						x: 941,
						y: 1530,
						width: 25,
						height: 18
					}
				}
			]
		},
		continuity: {
			_type: "element",
			tags: null,
			links: null,
			viewOf: "supabase",
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: null,
			title: "Trilha de Continuidade Operacional",
			id: "continuity",
			autoLayout: { direction: "TB" },
			notation: { nodes: [
				{
					title: "Execution Loop /op",
					shape: "queue",
					color: "secondary",
					kinds: ["executionloop"]
				},
				{
					title: "Sistema de Software",
					shape: "rectangle",
					color: "secondary",
					kinds: ["system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "secondary",
					kinds: ["external-system"]
				},
				{
					title: "Worker / Enforcement",
					shape: "rectangle",
					color: "secondary",
					kinds: ["worker"]
				},
				{
					title: "Banco de Dados",
					shape: "storage",
					color: "green",
					kinds: ["database"]
				},
				{
					title: "Tabela de Banco de Dados",
					shape: "storage",
					color: "green",
					kinds: ["db-table"]
				}
			] },
			hash: "XXrv7vj61OLpl7rvDYrVIrMlxYANEDpydwO1XWCnR_U",
			bounds: {
				x: 0,
				y: 0,
				width: 3436,
				height: 1231
			},
			nodes: [
				{
					id: "python",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["bwm9u8"],
					outEdges: [
						"1sdjfu4",
						"gz6ljy",
						"lco3o0"
					],
					title: "Python / Hermes — Enforcement & Pipeline",
					modelRef: "python",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
					tags: [],
					notation: "Worker / Enforcement",
					technology: "Python · psycopg · worker",
					kind: "worker",
					x: 812,
					y: 315,
					width: 425,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 390,
						height: 139
					}
				},
				{
					id: "harness",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [
						"5brka0",
						"alwd6",
						"1qvdthg",
						"d397ej",
						"zcyjlc"
					],
					title: "Harness Local /op",
					modelRef: "harness",
					shape: "queue",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Execution loop controlado, orientado a tasks do Supabase.\nSubordinado ao data plane: não é runtime autônomo." },
					tags: [],
					notation: "Execution Loop /op",
					technology: "claude --resume · codex exec · orchestrator.py · tmux · hooks",
					kind: "executionloop",
					x: 1346,
					y: 0,
					width: 343,
					height: 172,
					labelBBox: {
						x: 22,
						y: 24,
						width: 299,
						height: 121
					}
				},
				{
					id: "gptweb",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["1jr7ei2"],
					title: "GPT Web",
					modelRef: "gptweb",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { txt: "Consumidor conversacional do snapshot de arquitetura publicado." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Web LLM + integração nativa com Supabase",
					kind: "external-system",
					x: 2622,
					y: 654,
					width: 331,
					height: 180,
					labelBBox: {
						x: 18,
						y: 47,
						width: 296,
						height: 84
					}
				},
				{
					id: "claudeweb",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["tqnloz"],
					title: "Claude Web",
					modelRef: "claudeweb",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { txt: "Segundo consumidor conversacional do snapshot de arquitetura publicado." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Web LLM + integração nativa com Supabase",
					kind: "external-system",
					x: 3064,
					y: 654,
					width: 371,
					height: 180,
					labelBBox: {
						x: 18,
						y: 47,
						width: 336,
						height: 84
					}
				},
				{
					id: "hermes",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["6zcvr4"],
					title: "Hermes Principal",
					modelRef: "hermes",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { txt: "Orquestra a continuidade, valida outputs e evolui o blueprint." },
					tags: [],
					kind: "actor",
					x: 380,
					y: 315,
					width: 321,
					height: 180,
					labelBBox: {
						x: 18,
						y: 56,
						width: 286,
						height: 65
					}
				},
				{
					id: "agents",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["zcyjlc"],
					outEdges: ["1ytkrqm"],
					title: "Agentes de Execução",
					modelRef: "agents",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Hermes / Claude / Codex / futuros workers",
					kind: "external-system",
					x: 1347,
					y: 315,
					width: 341,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 305,
						height: 85
					}
				},
				{
					id: "mind",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"lco3o0",
						"6zcvr4",
						"1ytkrqm"
					],
					outEdges: [
						"qp2mky",
						"hhcohi",
						"onmlms",
						"li7kt6",
						"1g9t4bp",
						"2xum8n",
						"lacjlj",
						"bwm9u8"
					],
					title: "Mind Runtime",
					modelRef: "mind",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 10,
						size: "md"
					},
					description: { md: "Superfície de continuidade voltada ao humano e candidata a runtime do ecossistema multiagente.\nFase atual: arquitetura primeiro." },
					tags: [],
					notation: "Sistema de Software",
					kind: "system",
					navigateTo: "mind",
					x: 1082,
					y: 654,
					width: 353,
					height: 180,
					labelBBox: {
						x: 18,
						y: 38,
						width: 318,
						height: 101
					}
				},
				{
					id: "supabase",
					parent: null,
					level: 0,
					children: [
						"supabase.tasks",
						"supabase.outputs",
						"supabase.knowledge",
						"supabase.artifacts",
						"supabase.snapshots",
						"supabase.projectHome",
						"supabase.events"
					],
					inEdges: [
						"1sdjfu4",
						"gz6ljy",
						"5brka0",
						"alwd6",
						"1qvdthg",
						"d397ej",
						"1jr7ei2",
						"tqnloz",
						"qp2mky",
						"hhcohi",
						"onmlms",
						"li7kt6",
						"1g9t4bp",
						"2xum8n",
						"lacjlj"
					],
					outEdges: [],
					title: "Supabase / Estado do /op",
					modelRef: "supabase",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
					tags: [],
					notation: "Banco de Dados",
					technology: "PostgreSQL / Supabase",
					kind: "database",
					depth: 1,
					x: 8,
					y: 942,
					width: 2980,
					height: 281,
					labelBBox: {
						x: 6,
						y: 0,
						width: 162,
						height: 15
					}
				},
				{
					id: "supabase.tasks",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: [
						"1sdjfu4",
						"5brka0",
						"hhcohi"
					],
					outEdges: [],
					title: "Agent Tasks",
					modelRef: "supabase.tasks",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 48,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 88,
						y: 66,
						width: 174,
						height: 45
					}
				},
				{
					id: "supabase.outputs",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: [
						"gz6ljy",
						"alwd6",
						"onmlms"
					],
					outEdges: [],
					title: "Task Outputs",
					modelRef: "supabase.outputs",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 2198,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 85,
						y: 66,
						width: 181,
						height: 45
					}
				},
				{
					id: "supabase.knowledge",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: ["1qvdthg", "li7kt6"],
					outEdges: [],
					title: "Knowledge Items",
					modelRef: "supabase.knowledge",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 478,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 67,
						y: 66,
						width: 216,
						height: 45
					}
				},
				{
					id: "supabase.artifacts",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: ["d397ej", "1g9t4bp"],
					outEdges: [],
					title: "Artifacts",
					modelRef: "supabase.artifacts",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 1768,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 108,
						y: 66,
						width: 134,
						height: 45
					}
				},
				{
					id: "supabase.snapshots",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: [
						"1jr7ei2",
						"tqnloz",
						"lacjlj"
					],
					outEdges: [],
					title: "Blueprint Snapshots",
					modelRef: "supabase.snapshots",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 2628,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 55,
						y: 66,
						width: 241,
						height: 45
					}
				},
				{
					id: "supabase.projectHome",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: ["qp2mky"],
					outEdges: [],
					title: "Project Home",
					modelRef: "supabase.projectHome",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 908,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 83,
						y: 66,
						width: 184,
						height: 45
					}
				},
				{
					id: "supabase.events",
					parent: "supabase",
					level: 1,
					children: [],
					inEdges: ["2xum8n"],
					outEdges: [],
					title: "Project Events",
					modelRef: "supabase.events",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 1338,
					y: 1003,
					width: 320,
					height: 180,
					labelBBox: {
						x: 80,
						y: 66,
						width: 191,
						height: 45
					}
				}
			],
			edges: [
				{
					id: "1sdjfu4",
					parent: null,
					source: "python",
					target: "supabase.tasks",
					label: "valida ownership e estado antes do \nside-effect",
					relations: ["tbq3u7"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[915, 495],
						[876, 526],
						[832, 562],
						[792, 594],
						[626, 728],
						[580, 755],
						[419, 894],
						[382, 927],
						[342, 963],
						[308, 996]
					],
					labelBBox: {
						x: 715,
						y: 726,
						width: 223,
						height: 34
					}
				},
				{
					id: "gz6ljy",
					parent: null,
					source: "python",
					target: "supabase.outputs",
					label: "publica outputs validados",
					relations: ["1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1238, 480],
						[1256, 485],
						[1274, 490],
						[1292, 495],
						[1451, 534],
						[1506, 490],
						[1656, 555],
						[1721, 583],
						[2059, 851],
						[2241, 998]
					],
					labelBBox: {
						x: 2031,
						y: 734,
						width: 161,
						height: 18
					}
				},
				{
					id: "5brka0",
					parent: null,
					source: "harness",
					target: "supabase.tasks",
					label: "reivindica, atualiza e encerra tasks",
					relations: ["1660z0j"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1347, 99],
						[1074, 120],
						[554, 167],
						[381, 232],
						[319, 255],
						[308, 271],
						[258, 315],
						[150, 409],
						[95, 421],
						[44, 555],
						[-13, 705],
						[72, 885],
						[139, 994]
					],
					labelBBox: {
						x: 45,
						y: 564,
						width: 219,
						height: 18
					}
				},
				{
					id: "alwd6",
					parent: null,
					source: "harness",
					target: "supabase.outputs",
					label: "grava evidência e resultados",
					relations: ["lcskfv"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1689, 161],
						[1739, 183],
						[1794, 208],
						[1843, 232],
						[2047, 331],
						[2108, 369],
						[2237, 555],
						[2332, 692],
						[2360, 732],
						[2396, 894],
						[2403, 926],
						[2400, 961],
						[2393, 992]
					],
					labelBBox: {
						x: 2265,
						y: 564,
						width: 182,
						height: 18
					}
				},
				{
					id: "1qvdthg",
					parent: null,
					source: "harness",
					target: "supabase.knowledge",
					label: "lê regras, budget gates e stop \nconditions",
					relations: ["1jxsfcs"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1346, 94],
						[1048, 110],
						[453, 160],
						[325, 315],
						[230, 430],
						[324, 788],
						[419, 934],
						[436, 959],
						[458, 982],
						[482, 1002]
					],
					labelBBox: {
						x: 298,
						y: 556,
						width: 189,
						height: 35
					}
				},
				{
					id: "d397ej",
					parent: null,
					source: "harness",
					target: "supabase.artifacts",
					label: "ancora payloads pesados",
					relations: ["1vz6r2x"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1670, 172],
						[1697, 190],
						[1724, 210],
						[1748, 232],
						[1921, 391],
						[1992, 431],
						[2067, 654],
						[2092, 730],
						[2087, 757],
						[2067, 834],
						[2053, 890],
						[2024, 947],
						[1996, 993]
					],
					labelBBox: {
						x: 2046,
						y: 564,
						width: 164,
						height: 18
					}
				},
				{
					id: "1jr7ei2",
					parent: null,
					source: "gptweb",
					target: "supabase.snapshots",
					label: "lê o snapshot do blueprint amigável para \nLLM",
					relations: ["1inc88k"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2788, 834],
						[2788, 882],
						[2788, 942],
						[2788, 992]
					],
					labelBBox: {
						x: 2789,
						y: 895,
						width: 256,
						height: 35
					}
				},
				{
					id: "tqnloz",
					parent: null,
					source: "claudeweb",
					target: "supabase.snapshots",
					label: "lê o snapshot do blueprint amigável para \nLLM",
					relations: ["xu3y5m"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[3177, 834],
						[3147, 868],
						[3110, 905],
						[3073, 934],
						[3038, 961],
						[2997, 987],
						[2958, 1009]
					],
					labelBBox: {
						x: 3117,
						y: 895,
						width: 256,
						height: 35
					}
				},
				{
					id: "qp2mky",
					parent: null,
					source: "mind",
					target: "supabase.projectHome",
					label: "[...]",
					relations: [
						"10hpil5",
						"l45cam",
						"zbshh4"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1140, 834],
						[1122, 852],
						[1106, 873],
						[1095, 894],
						[1079, 924],
						[1072, 960],
						[1068, 992]
					],
					labelBBox: {
						x: 1096,
						y: 901,
						width: 25,
						height: 18
					}
				},
				{
					id: "hhcohi",
					parent: null,
					source: "mind",
					target: "supabase.tasks",
					label: "reivindica, atualiza e encerra tasks",
					relations: ["1toghsj"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1082, 791],
						[1025, 805],
						[962, 821],
						[904, 834],
						[691, 884],
						[623, 853],
						[423, 942],
						[389, 957],
						[356, 977],
						[325, 998]
					],
					labelBBox: {
						x: 549,
						y: 904,
						width: 219,
						height: 18
					}
				},
				{
					id: "onmlms",
					parent: null,
					source: "mind",
					target: "supabase.outputs",
					label: "escreve evidências e resumos",
					relations: ["ix1ruj"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1352, 834],
						[1399, 873],
						[1459, 914],
						[1521, 934],
						[1586, 956],
						[2077, 921],
						[2143, 942],
						[2180, 954],
						[2217, 975],
						[2249, 998]
					],
					labelBBox: {
						x: 1522,
						y: 904,
						width: 192,
						height: 18
					}
				},
				{
					id: "li7kt6",
					parent: null,
					source: "mind",
					target: "supabase.knowledge",
					label: "[...]",
					relations: [
						"yqaccy",
						"1iyu5jt",
						"kt4xob"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1082, 824],
						[1010, 857],
						[926, 899],
						[853, 942],
						[823, 959],
						[792, 980],
						[764, 999]
					],
					labelBBox: {
						x: 929,
						y: 901,
						width: 25,
						height: 18
					}
				},
				{
					id: "1g9t4bp",
					parent: null,
					source: "mind",
					target: "supabase.artifacts",
					label: "[...]",
					relations: ["thwaih", "19wmxqn"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1295, 834],
						[1315, 872],
						[1344, 912],
						[1384, 934],
						[1416, 952],
						[1678, 931],
						[1713, 942],
						[1750, 954],
						[1787, 975],
						[1819, 997]
					],
					labelBBox: {
						x: 1385,
						y: 901,
						width: 25,
						height: 18
					}
				},
				{
					id: "2xum8n",
					parent: null,
					source: "mind",
					target: "supabase.events",
					label: "[...]",
					relations: ["19mamyy", "1dzqify"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1226, 834],
						[1219, 869],
						[1219, 907],
						[1242, 934],
						[1254, 948],
						[1266, 935],
						[1283, 942],
						[1317, 957],
						[1351, 977],
						[1382, 998]
					],
					labelBBox: {
						x: 1243,
						y: 901,
						width: 25,
						height: 18
					}
				},
				{
					id: "lacjlj",
					parent: null,
					source: "mind",
					target: "supabase.snapshots",
					label: "publica o snapshot atual do blueprint",
					relations: ["1nigh98"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1435, 788],
						[1505, 805],
						[1587, 822],
						[1661, 834],
						[1686, 839],
						[2549, 933],
						[2573, 942],
						[2609, 956],
						[2644, 976],
						[2675, 998]
					],
					labelBBox: {
						x: 2519,
						y: 904,
						width: 232,
						height: 18
					}
				},
				{
					id: "lco3o0",
					parent: null,
					source: "python",
					target: "mind",
					label: "[...]",
					relations: ["1qezf2r", "18h8oke"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1198, 495],
						[1218, 512],
						[1236, 532],
						[1249, 555],
						[1264, 582],
						[1270, 614],
						[1270, 644]
					],
					labelBBox: {
						x: 1265,
						y: 562,
						width: 25,
						height: 18
					}
				},
				{
					id: "bwm9u8",
					parent: null,
					source: "mind",
					target: "python",
					label: "delega enforcement determinístico",
					relations: ["te18lp"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1082, 677],
						[1048, 656],
						[1017, 629],
						[997, 594],
						[982, 568],
						[981, 535],
						[987, 505]
					],
					labelBBox: {
						x: 998,
						y: 564,
						width: 223,
						height: 18
					}
				},
				{
					id: "6zcvr4",
					parent: null,
					source: "hermes",
					target: "mind",
					label: "lê a continuidade e direciona o próximo \npasso",
					relations: ["l6jasw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[602, 495],
						[630, 530],
						[667, 569],
						[708, 594],
						[725, 604],
						[919, 656],
						[1072, 696]
					],
					labelBBox: {
						x: 709,
						y: 556,
						width: 248,
						height: 35
					}
				},
				{
					id: "zcyjlc",
					parent: null,
					source: "harness",
					target: "agents",
					label: "invoca os agentes de execução",
					relations: ["1oidkd8"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1518, 172],
						[1518, 213],
						[1518, 262],
						[1518, 305]
					],
					labelBBox: {
						x: 1519,
						y: 233,
						width: 201,
						height: 18
					}
				},
				{
					id: "1ytkrqm",
					parent: null,
					source: "agents",
					target: "mind",
					label: "recebem trabalho e publicam estado",
					relations: ["cukeme"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1450, 495],
						[1414, 541],
						[1370, 598],
						[1334, 646]
					],
					labelBBox: {
						x: 1397,
						y: 564,
						width: 230,
						height: 18
					}
				}
			]
		},
		blueprint: {
			_type: "element",
			tags: null,
			links: null,
			viewOf: "likec4",
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: null,
			title: "Fronteira entre Blueprint e Runtime",
			id: "blueprint",
			autoLayout: { direction: "TB" },
			notation: { nodes: [{
				title: "Aplicação Web",
				shape: "browser",
				color: "secondary",
				kinds: ["webapp"]
			}, {
				title: "Sistema de Software Externo",
				shape: "rectangle",
				color: "green",
				kinds: ["external-system"]
			}] },
			hash: "Jqb0h9rNvsE82gzWv-iwB7POuv_CjAIPQHcgE69_cLM",
			bounds: {
				x: 0,
				y: 0,
				width: 1287,
				height: 896
			},
			nodes: [
				{
					id: "hermes",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["3zhgdu", "10sotoy"],
					title: "Hermes Principal",
					modelRef: "hermes",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Orquestra a continuidade, valida outputs e evolui o blueprint." },
					tags: [],
					kind: "actor",
					x: 0,
					y: 0,
					width: 321,
					height: 180,
					labelBBox: {
						x: 18,
						y: 56,
						width: 286,
						height: 65
					}
				},
				{
					id: "lucas",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["sl92qm"],
					title: "Lucas",
					modelRef: "lucas",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 537,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 131,
						y: 76,
						width: 57,
						height: 24
					}
				},
				{
					id: "mind.systemic.contract",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["5slp7p"],
					title: "Aplicação de Contrato",
					modelRef: "mind.systemic.contract",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Verifica regras canônicas, formatos e contexto obrigatório. Realização determinística em python.enforce." },
					tags: [],
					technology: "Lógico — realizado por python.enforce",
					kind: "component",
					x: 967,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 34,
						y: 37,
						width: 252,
						height: 103
					}
				},
				{
					id: "mind.ui",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["10sotoy", "sl92qm"],
					outEdges: ["9ai0yy"],
					title: "Mind UI",
					modelRef: "mind.ui",
					shape: "browser",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Mostra continuidade do projeto, contexto, outputs e próximos passos." },
					tags: ["teamA"],
					notation: "Aplicação Web",
					technology: "Web UI / Mini App / Dashboard",
					kind: "webapp",
					x: 474,
					y: 340,
					width: 323,
					height: 180,
					labelBBox: {
						x: 22,
						y: 46,
						width: 279,
						height: 84
					}
				},
				{
					id: "likec4",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"3zhgdu",
						"9ai0yy",
						"5slp7p"
					],
					outEdges: [],
					title: "LikeC4 Blueprint",
					modelRef: "likec4",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 20,
						size: "lg"
					},
					description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "LikeC4 DSL + CLI + MCP",
					kind: "external-system",
					x: 188,
					y: 662,
					width: 420,
					height: 234,
					labelBBox: {
						x: 30,
						y: 45,
						width: 359,
						height: 141
					}
				}
			],
			edges: [
				{
					id: "3zhgdu",
					parent: null,
					source: "hermes",
					target: "likec4",
					label: "modela a arquitetura e as views",
					relations: ["1xm4scx"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[160, 180],
						[162, 269],
						[172, 408],
						[215, 520],
						[234, 567],
						[263, 614],
						[292, 654]
					],
					labelBBox: {
						x: 216,
						y: 419,
						width: 202,
						height: 18
					}
				},
				{
					id: "10sotoy",
					parent: null,
					source: "hermes",
					target: "mind.ui",
					label: "lê a continuidade e direciona o próximo \npasso",
					relations: ["l6jasw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[261, 180],
						[300, 213],
						[345, 249],
						[388, 280],
						[415, 298],
						[443, 317],
						[471, 334]
					],
					labelBBox: {
						x: 389,
						y: 241,
						width: 248,
						height: 35
					}
				},
				{
					id: "sl92qm",
					parent: null,
					source: "lucas",
					target: "mind.ui",
					label: "lê a continuidade e direciona \nprioridades",
					relations: ["2b4bsw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[681, 180],
						[673, 226],
						[662, 282],
						[654, 329]
					],
					labelBBox: {
						x: 669,
						y: 241,
						width: 182,
						height: 35
					}
				},
				{
					id: "9ai0yy",
					parent: null,
					source: "mind.ui",
					target: "likec4",
					label: "abre as views do blueprint",
					relations: ["bplrub"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[575, 519],
						[547, 560],
						[514, 610],
						[483, 654]
					],
					labelBBox: {
						x: 532,
						y: 581,
						width: 167,
						height: 18
					}
				},
				{
					id: "5slp7p",
					parent: null,
					source: "mind.systemic.contract",
					target: "likec4",
					label: "pode consultar contratos e limites \narquiteturais",
					relations: ["1uyg0f3"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1084, 180],
						[1037, 272],
						[954, 417],
						[853, 520],
						[786, 587],
						[698, 643],
						[617, 685]
					],
					labelBBox: {
						x: 992,
						y: 411,
						width: 213,
						height: 35
					}
				}
			]
		},
		snapshots: {
			_type: "element",
			tags: null,
			links: null,
			viewOf: "mind.blueprint",
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: { md: "Caminho automatizado da fonte LikeC4 até o snapshot publicado no Supabase,\nconsumido pelo GPT Web e pelo Claude Web." },
			title: "Pipeline de Publicação de Snapshot do Blueprint",
			id: "snapshots",
			autoLayout: { direction: "TB" },
			notation: { nodes: [
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "amber",
					kinds: ["external-system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "secondary",
					kinds: ["external-system"]
				},
				{
					title: "Worker / Enforcement",
					shape: "rectangle",
					color: "secondary",
					kinds: ["worker"]
				},
				{
					title: "Banco de Dados",
					shape: "storage",
					color: "secondary",
					kinds: ["database"]
				}
			] },
			hash: "17HGGaqG9uwYevBh98kJsJfrKHZvkyqB1KZPoQoq17k",
			bounds: {
				x: 0,
				y: 0,
				width: 2441,
				height: 868
			},
			nodes: [
				{
					id: "python",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [
						"wsop3e",
						"tqeso6",
						"173cx30"
					],
					title: "Python / Hermes — Enforcement & Pipeline",
					modelRef: "python",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 12,
						size: "md"
					},
					description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
					tags: [],
					notation: "Worker / Enforcement",
					technology: "Python · psycopg · worker",
					kind: "worker",
					x: 1277,
					y: 0,
					width: 425,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 390,
						height: 139
					}
				},
				{
					id: "lucas",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["1kwa3ch", "1etcp60"],
					title: "Lucas",
					modelRef: "lucas",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 12,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 1954,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 131,
						y: 76,
						width: 57,
						height: 24
					}
				},
				{
					id: "mind.blueprint",
					parent: null,
					level: 0,
					children: [
						"mind.blueprint.project",
						"mind.blueprint.publish",
						"mind.blueprint.extract"
					],
					inEdges: ["wsop3e", "tqeso6"],
					outEdges: [
						"1n6bmnu",
						"18vi4de",
						"s2mccw"
					],
					title: "Pipeline de Publicação do Blueprint",
					modelRef: "mind.blueprint",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Automatiza a cadeia da fonte LikeC4 até um snapshot publicado no Supabase\nque LLMs web podem consultar sem export manual a cada turno." },
					tags: [],
					technology: "Worker / automação / bridge",
					kind: "service",
					depth: 1,
					x: 8,
					y: 288,
					width: 1302,
					height: 281,
					labelBBox: {
						x: 6,
						y: 0,
						width: 231,
						height: 15
					}
				},
				{
					id: "gptweb",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1kwa3ch"],
					outEdges: ["fdzat7"],
					title: "GPT Web",
					modelRef: "gptweb",
					shape: "rectangle",
					color: "amber",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Consumidor conversacional do snapshot de arquitetura publicado." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Web LLM + integração nativa com Supabase",
					kind: "external-system",
					x: 1627,
					y: 349,
					width: 331,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 296,
						height: 85
					}
				},
				{
					id: "claudeweb",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1etcp60"],
					outEdges: ["z0ogn6"],
					title: "Claude Web",
					modelRef: "claudeweb",
					shape: "rectangle",
					color: "amber",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Segundo consumidor conversacional do snapshot de arquitetura publicado." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Web LLM + integração nativa com Supabase",
					kind: "external-system",
					x: 2069,
					y: 349,
					width: 371,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 336,
						height: 85
					}
				},
				{
					id: "mind.blueprint.project",
					parent: "mind.blueprint",
					level: 1,
					children: [],
					inEdges: ["wsop3e"],
					outEdges: ["18vi4de"],
					title: "Projetor de Snapshot para LLM",
					modelRef: "mind.blueprint.project",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Projeta o export técnico em um snapshot de blueprint amigável para LLMs." },
					tags: [],
					technology: "Etapa de transformação",
					kind: "component",
					x: 48,
					y: 349,
					width: 333,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 297,
						height: 85
					}
				},
				{
					id: "mind.blueprint.publish",
					parent: "mind.blueprint",
					level: 1,
					children: [],
					inEdges: ["tqeso6"],
					outEdges: ["s2mccw"],
					title: "Publicador Supabase",
					modelRef: "mind.blueprint.publish",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Publica o snapshot mais recente e metadados no repositório de continuidade." },
					tags: [],
					technology: "Cliente Supabase / API",
					kind: "component",
					x: 922,
					y: 349,
					width: 347,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 312,
						height: 85
					}
				},
				{
					id: "mind.blueprint.extract",
					parent: "mind.blueprint",
					level: 1,
					children: [],
					inEdges: [],
					outEdges: ["1n6bmnu"],
					title: "Gerador de Export",
					modelRef: "mind.blueprint.extract",
					shape: "rectangle",
					color: "green",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { txt: "Gera o export técnico a partir da fonte canônica LikeC4." },
					tags: [],
					technology: "LikeC4 CLI",
					kind: "component",
					x: 492,
					y: 349,
					width: 320,
					height: 180,
					labelBBox: {
						x: 32,
						y: 46,
						width: 257,
						height: 85
					}
				},
				{
					id: "supabase",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"s2mccw",
						"173cx30",
						"fdzat7",
						"z0ogn6"
					],
					outEdges: [],
					title: "Supabase / Estado do /op",
					modelRef: "supabase",
					shape: "storage",
					color: "secondary",
					icon: "tech:postgresql",
					style: {
						opacity: 12,
						size: "md"
					},
					description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
					tags: [],
					notation: "Banco de Dados",
					technology: "PostgreSQL / Supabase",
					kind: "database",
					navigateTo: "continuity",
					x: 1616,
					y: 688,
					width: 354,
					height: 180,
					labelBBox: {
						x: 46,
						y: 38,
						width: 292,
						height: 102
					}
				},
				{
					id: "likec4",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1n6bmnu", "18vi4de"],
					outEdges: [],
					title: "LikeC4 Blueprint",
					modelRef: "likec4",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 12,
						size: "md"
					},
					description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "LikeC4 DSL + CLI + MCP",
					kind: "external-system",
					navigateTo: "blueprint",
					x: 249,
					y: 688,
					width: 336,
					height: 180,
					labelBBox: {
						x: 18,
						y: 29,
						width: 300,
						height: 120
					}
				}
			],
			edges: [
				{
					id: "wsop3e",
					parent: null,
					source: "python",
					target: "mind.blueprint.project",
					label: "assume a lógica de projeção",
					relations: ["1qezf2r"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1277, 105],
						[1059, 125],
						[714, 174],
						[437, 288],
						[402, 302],
						[367, 322],
						[336, 343]
					],
					labelBBox: {
						x: 547,
						y: 249,
						width: 183,
						height: 18
					}
				},
				{
					id: "tqeso6",
					parent: null,
					source: "python",
					target: "mind.blueprint.publish",
					label: "executa o worker de publicação",
					relations: ["18h8oke"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1282, 180],
						[1254, 197],
						[1226, 217],
						[1203, 240],
						[1175, 268],
						[1152, 305],
						[1135, 340]
					],
					labelBBox: {
						x: 1204,
						y: 249,
						width: 202,
						height: 18
					}
				},
				{
					id: "1n6bmnu",
					parent: null,
					source: "mind.blueprint.extract",
					target: "likec4",
					label: "[...]",
					relations: ["1f429e", "1s7fls4"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[590, 529],
						[558, 575],
						[518, 632],
						[485, 680]
					],
					labelBBox: {
						x: 543,
						y: 596,
						width: 25,
						height: 18
					}
				},
				{
					id: "18vi4de",
					parent: null,
					source: "mind.blueprint.project",
					target: "likec4",
					label: "transforma o export estrutural",
					relations: ["d9v70d"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[225, 529],
						[231, 562],
						[242, 598],
						[259, 628],
						[270, 647],
						[284, 665],
						[299, 681]
					],
					labelBBox: {
						x: 260,
						y: 598,
						width: 188,
						height: 18
					}
				},
				{
					id: "s2mccw",
					parent: null,
					source: "mind.blueprint.publish",
					target: "supabase",
					label: "[...]",
					relations: [
						"1nigh98",
						"19wmxqn",
						"1dzqify"
					],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1216, 529],
						[1265, 563],
						[1324, 600],
						[1380, 628],
						[1451, 664],
						[1533, 696],
						[1605, 720]
					],
					labelBBox: {
						x: 1381,
						y: 596,
						width: 25,
						height: 18
					}
				},
				{
					id: "173cx30",
					parent: null,
					source: "python",
					target: "supabase",
					label: "[...]",
					relations: ["tbq3u7", "1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1481, 180],
						[1476, 280],
						[1479, 446],
						[1545, 569],
						[1569, 614],
						[1607, 653],
						[1647, 685]
					],
					labelBBox: {
						x: 1546,
						y: 426,
						width: 25,
						height: 18
					}
				},
				{
					id: "fdzat7",
					parent: null,
					source: "gptweb",
					target: "supabase",
					label: "lê o snapshot do blueprint amigável para \nLLM",
					relations: ["1inc88k"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1793, 529],
						[1793, 574],
						[1793, 630],
						[1793, 677]
					],
					labelBBox: {
						x: 1794,
						y: 590,
						width: 256,
						height: 35
					}
				},
				{
					id: "z0ogn6",
					parent: null,
					source: "claudeweb",
					target: "supabase",
					label: "lê o snapshot do blueprint amigável para \nLLM",
					relations: ["xu3y5m"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2183, 529],
						[2153, 562],
						[2116, 600],
						[2078, 628],
						[2048, 651],
						[2014, 672],
						[1980, 691]
					],
					labelBBox: {
						x: 2122,
						y: 590,
						width: 256,
						height: 35
					}
				},
				{
					id: "1kwa3ch",
					parent: null,
					source: "lucas",
					target: "gptweb",
					label: "pergunta sobre a arquitetura em \nlinguagem natural",
					relations: ["bz24s"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2005, 180],
						[1984, 199],
						[1962, 220],
						[1943, 240],
						[1914, 271],
						[1885, 308],
						[1860, 341]
					],
					labelBBox: {
						x: 1944,
						y: 241,
						width: 204,
						height: 35
					}
				},
				{
					id: "1etcp60",
					parent: null,
					source: "lucas",
					target: "claudeweb",
					label: "pede leituras alternativas do mesmo \nblueprint",
					relations: ["vfyv1w"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2150, 180],
						[2170, 229],
						[2195, 289],
						[2215, 339]
					],
					labelBBox: {
						x: 2190,
						y: 241,
						width: 229,
						height: 35
					}
				}
			]
		},
		hybrid: {
			_type: "element",
			tags: null,
			links: null,
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: { md: "Primeira iteração do desenho híbrido (matriz 2026-06-28, ClickUp descartado).\nQuatro fronteiras explícitas:\n- Braide = cockpit de execução local de código + LikeC4 (código → git, .c4 = ponte).\n- Harness Local /op = execution loop orientado a tasks do Supabase.\n- Supabase / Mind = data plane canônico (estado, fila, auditoria, vetorial).\n- Python / Hermes = enforcement determinístico + pipeline worker.\nRascunho sujeito a revisão pela T29." },
			title: "Desenho Híbrido — Cockpit, Loop, Data Plane e Enforcement (rascunho T28)",
			id: "hybrid",
			autoLayout: { direction: "TB" },
			notation: { nodes: [
				{
					title: "Aplicação Web",
					shape: "browser",
					color: "secondary",
					kinds: ["webapp"]
				},
				{
					title: "Cockpit de Execução Local",
					shape: "browser",
					color: "indigo",
					kinds: ["cockpit"]
				},
				{
					title: "Execution Loop /op",
					shape: "queue",
					color: "sky",
					kinds: ["executionloop"]
				},
				{
					title: "Sistema de Software",
					shape: "rectangle",
					color: "secondary",
					kinds: ["system"]
				},
				{
					title: "Sistema de Software Externo",
					shape: "rectangle",
					color: "secondary",
					kinds: ["external-system"]
				},
				{
					title: "Worker / Enforcement",
					shape: "rectangle",
					color: "amber",
					kinds: ["worker"]
				},
				{
					title: "Banco de Dados",
					shape: "storage",
					color: "green",
					kinds: ["database"]
				}
			] },
			hash: "zwwrX446bE8QiaOSAjaTfF23_EXC5JULjyUhjwwuRZU",
			bounds: {
				x: 0,
				y: 0,
				width: 2919,
				height: 1518
			},
			nodes: [
				{
					id: "lucas",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [
						"1iw2xej",
						"12hfhci",
						"sl92qm"
					],
					title: "Lucas",
					modelRef: "lucas",
					shape: "person",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 563,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 131,
						y: 76,
						width: 57,
						height: 24
					}
				},
				{
					id: "python",
					parent: null,
					level: 0,
					children: ["python.pipeline", "python.enforce"],
					inEdges: ["13afafc"],
					outEdges: ["5xku1w"],
					title: "Python / Hermes — Enforcement & Pipeline",
					modelRef: "python",
					shape: "rectangle",
					color: "amber",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Enforcement determinístico de protocolo + pipeline worker.\nValida outputs e ownership, aplica contratos e executa a publicação de snapshot.\nDeixou de ser candidato em avaliação (matriz 2026-06-28): papel fechado." },
					tags: [],
					notation: "Worker / Enforcement",
					technology: "Python · psycopg · worker",
					kind: "worker",
					depth: 1,
					x: 955,
					y: 937,
					width: 898,
					height: 282,
					labelBBox: {
						x: 6,
						y: 0,
						width: 270,
						height: 15
					}
				},
				{
					id: "python.pipeline",
					parent: "python",
					level: 1,
					children: [],
					inEdges: [],
					outEdges: [],
					title: "Worker de Pipeline",
					modelRef: "python.pipeline",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Executa a cadeia LikeC4 → snapshot → Supabase (T14C)." },
					tags: [],
					technology: "Worker de publicação",
					kind: "component",
					x: 995,
					y: 999,
					width: 376,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 340,
						height: 84
					}
				},
				{
					id: "mind",
					parent: null,
					level: 0,
					children: ["mind.ui"],
					inEdges: ["sl92qm"],
					outEdges: ["1d77gc4", "9ai0yy"],
					title: "Mind Runtime",
					modelRef: "mind",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { md: "Superfície de continuidade voltada ao humano e candidata a runtime do ecossistema multiagente.\nFase atual: arquitetura primeiro." },
					tags: [],
					notation: "Sistema de Software",
					kind: "system",
					depth: 1,
					navigateTo: "mind",
					x: 529,
					y: 945,
					width: 388,
					height: 266,
					labelBBox: {
						x: 6,
						y: 0,
						width: 85,
						height: 15
					}
				},
				{
					id: "braide",
					parent: null,
					level: 0,
					children: [
						"braide.acp",
						"braide.session",
						"braide.bridgeC4"
					],
					inEdges: ["1iw2xej"],
					outEdges: ["1fqmsax"],
					title: "Braide Cockpit",
					modelRef: "braide",
					shape: "browser",
					color: "indigo",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Cockpit de execução local para código e LikeC4 (Cenário C, 2026-06-22).\nHumano-no-loop: Lucas desenvolve aqui; o agente ACP gera código.\nProtocolo anti-bagunça: código vai para o git; o .c4 é o arquivo-ponte Braide → Mind." },
					tags: [],
					notation: "Cockpit de Execução Local",
					technology: "Electron + Next.js · agente Codex/GPT via ACP",
					kind: "cockpit",
					depth: 1,
					x: 8,
					y: 249,
					width: 513,
					height: 970,
					labelBBox: {
						x: 6,
						y: 0,
						width: 99,
						height: 15
					}
				},
				{
					id: "harness",
					parent: null,
					level: 0,
					children: [
						"harness.loop",
						"harness.runner",
						"harness.gates"
					],
					inEdges: ["12hfhci"],
					outEdges: [
						"13afafc",
						"1qesqzu",
						"1ggqana",
						"1lfvgvm",
						"t5aw9u"
					],
					title: "Harness Local /op",
					modelRef: "harness",
					shape: "queue",
					color: "sky",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Execution loop controlado, orientado a tasks do Supabase.\nSubordinado ao data plane: não é runtime autônomo." },
					tags: [],
					notation: "Execution Loop /op",
					technology: "claude --resume · codex exec · orchestrator.py · tmux · hooks",
					kind: "executionloop",
					depth: 1,
					x: 2120,
					y: 249,
					width: 529,
					height: 970,
					labelBBox: {
						x: 6,
						y: 0,
						width: 121,
						height: 15
					}
				},
				{
					id: "mind.ui",
					parent: "mind",
					level: 1,
					children: [],
					inEdges: ["sl92qm"],
					outEdges: ["1d77gc4", "9ai0yy"],
					title: "Mind UI",
					modelRef: "mind.ui",
					shape: "browser",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Mostra continuidade do projeto, contexto, outputs e próximos passos." },
					tags: ["teamA"],
					notation: "Aplicação Web",
					technology: "Web UI / Mini App / Dashboard",
					kind: "webapp",
					x: 561,
					y: 999,
					width: 323,
					height: 180,
					labelBBox: {
						x: 22,
						y: 46,
						width: 279,
						height: 84
					}
				},
				{
					id: "braide.acp",
					parent: "braide",
					level: 1,
					children: [],
					inEdges: [],
					outEdges: ["8vvjja"],
					title: "Agente ACP",
					modelRef: "braide.acp",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Gera e edita código dentro da sessão local." },
					tags: [],
					technology: "Codex / GPT via ACP",
					kind: "component",
					x: 55,
					y: 310,
					width: 329,
					height: 180,
					labelBBox: {
						x: 18,
						y: 55,
						width: 293,
						height: 67
					}
				},
				{
					id: "harness.loop",
					parent: "harness",
					level: 1,
					children: [],
					inEdges: [],
					outEdges: [
						"szi6yu",
						"1qesqzu",
						"t5aw9u"
					],
					title: "Orquestrador de Jobs",
					modelRef: "harness.loop",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "orquestrador → task → execução → validação → próxima decisão." },
					tags: [],
					technology: "orchestrator.py",
					kind: "component",
					x: 2160,
					y: 310,
					width: 361,
					height: 180,
					labelBBox: {
						x: 19,
						y: 46,
						width: 325,
						height: 85
					}
				},
				{
					id: "braide.session",
					parent: "braide",
					level: 1,
					children: [],
					inEdges: ["8vvjja"],
					outEdges: ["xz58xo"],
					title: "Sessão / Worktree",
					modelRef: "braide.session",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Isola trabalho paralelo; cada sessão tem seu slice de código." },
					tags: [],
					technology: "git worktree + sessão Braide",
					kind: "component",
					x: 51,
					y: 650,
					width: 337,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 302,
						height: 85
					}
				},
				{
					id: "harness.runner",
					parent: "harness",
					level: 1,
					children: [],
					inEdges: ["szi6yu"],
					outEdges: [
						"7w2cwu",
						"13afafc",
						"1ggqana"
					],
					title: "Runner de Agente",
					modelRef: "harness.runner",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Executa a task reivindicada e produz evidência." },
					tags: [],
					technology: "claude --resume / codex exec",
					kind: "component",
					x: 2181,
					y: 650,
					width: 320,
					height: 180,
					labelBBox: {
						x: 35,
						y: 46,
						width: 249,
						height: 85
					}
				},
				{
					id: "agents",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["t5aw9u"],
					outEdges: [],
					title: "Agentes de Execução",
					modelRef: "agents",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Hermes / Claude / Codex / futuros workers",
					kind: "external-system",
					x: 1729,
					y: 650,
					width: 341,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 305,
						height: 85
					}
				},
				{
					id: "braide.bridgeC4",
					parent: "braide",
					level: 1,
					children: [],
					inEdges: ["xz58xo"],
					outEdges: ["1fqmsax"],
					title: "Ponte .c4",
					modelRef: "braide.bridgeC4",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { md: "Handoff arquitetural: só decisão + arquitetura promovidas ao Mind.\nSync entre sessões/worktrees paralelas é por disciplina git — o Braide não tem sync nativo do .c4 (T18)." },
					tags: [],
					technology: "arquivo .c4 versionado em git",
					kind: "component",
					x: 48,
					y: 999,
					width: 343,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 307,
						height: 138
					}
				},
				{
					id: "harness.gates",
					parent: "harness",
					level: 1,
					children: [],
					inEdges: ["7w2cwu"],
					outEdges: ["1lfvgvm"],
					title: "Hooks & Gates",
					modelRef: "harness.gates",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Budget gates, stop conditions e continuidade." },
					tags: [],
					technology: "SessionStart / Stop / TeammateIdle",
					kind: "component",
					x: 2170,
					y: 999,
					width: 342,
					height: 180,
					labelBBox: {
						x: 18,
						y: 55,
						width: 307,
						height: 66
					}
				},
				{
					id: "likec4",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["1fqmsax", "9ai0yy"],
					outEdges: [],
					title: "LikeC4 Blueprint",
					modelRef: "likec4",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { md: "Blueprint arquitetural vivo do ecossistema Mind.\nNão é o runtime em si; é o modelo estrutural que o orienta." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "LikeC4 DSL + CLI + MCP",
					kind: "external-system",
					navigateTo: "blueprint",
					x: 283,
					y: 1338,
					width: 336,
					height: 180,
					labelBBox: {
						x: 18,
						y: 28,
						width: 300,
						height: 121
					}
				},
				{
					id: "python.enforce",
					parent: "python",
					level: 1,
					children: [],
					inEdges: ["13afafc"],
					outEdges: ["5xku1w"],
					title: "Enforcement de Contrato",
					modelRef: "python.enforce",
					shape: "rectangle",
					color: "secondary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Verifica contrato, identidade e ownership de execução antes de side-effects (T13/T19)." },
					tags: [],
					technology: "Validação determinística",
					kind: "component",
					x: 1481,
					y: 999,
					width: 331,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 296,
						height: 84
					}
				},
				{
					id: "supabase",
					parent: null,
					level: 0,
					children: [],
					inEdges: [
						"1qesqzu",
						"1ggqana",
						"1lfvgvm",
						"5xku1w",
						"1d77gc4"
					],
					outEdges: [],
					title: "Supabase / Estado do /op",
					modelRef: "supabase",
					shape: "storage",
					color: "green",
					icon: "tech:postgresql",
					style: {
						opacity: 100,
						size: "md"
					},
					description: { md: "Trilha operacional atual:\nProject Home, tasks, outputs, knowledge, artifacts e events." },
					tags: [],
					notation: "Banco de Dados",
					technology: "PostgreSQL / Supabase",
					kind: "database",
					navigateTo: "continuity",
					x: 1856,
					y: 1338,
					width: 354,
					height: 180,
					labelBBox: {
						x: 46,
						y: 37,
						width: 292,
						height: 103
					}
				}
			],
			edges: [
				{
					id: "xz58xo",
					parent: "braide",
					source: "braide.session",
					target: "braide.bridgeC4",
					label: "atualiza o .c4 quando a arquitetura muda",
					relations: ["1iest3y"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[220, 830],
						[220, 878],
						[220, 938],
						[220, 988]
					],
					labelBBox: {
						x: 221,
						y: 899,
						width: 259,
						height: 18
					}
				},
				{
					id: "8vvjja",
					parent: "braide",
					source: "braide.acp",
					target: "braide.session",
					label: "edita código na worktree",
					relations: ["19xnjer"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[220, 490],
						[220, 536],
						[220, 592],
						[220, 640]
					],
					labelBBox: {
						x: 221,
						y: 560,
						width: 157,
						height: 18
					}
				},
				{
					id: "szi6yu",
					parent: "harness",
					source: "harness.loop",
					target: "harness.runner",
					label: "despacha a task para execução",
					relations: ["9l25k0"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2341, 490],
						[2341, 536],
						[2341, 592],
						[2341, 640]
					],
					labelBBox: {
						x: 2342,
						y: 560,
						width: 202,
						height: 18
					}
				},
				{
					id: "7w2cwu",
					parent: "harness",
					source: "harness.runner",
					target: "harness.gates",
					label: "reporta estado para gates de orçamento e \nparada",
					relations: ["1qcthnj"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2326, 830],
						[2323, 849],
						[2320, 870],
						[2319, 890],
						[2316, 922],
						[2319, 957],
						[2323, 989]
					],
					labelBBox: {
						x: 2320,
						y: 891,
						width: 266,
						height: 35
					}
				},
				{
					id: "13afafc",
					parent: null,
					source: "harness.runner",
					target: "python.enforce",
					label: "submete output para validação antes de \nfechar",
					relations: ["1rglzw5"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2181, 812],
						[2163, 819],
						[2144, 825],
						[2126, 830],
						[2033, 855],
						[1766, 825],
						[1694, 890],
						[1667, 915],
						[1654, 953],
						[1648, 989]
					],
					labelBBox: {
						x: 1695,
						y: 891,
						width: 254,
						height: 35
					}
				},
				{
					id: "1qesqzu",
					parent: null,
					source: "harness.loop",
					target: "supabase",
					label: "reivindica, atualiza e encerra tasks",
					relations: ["1660z0j"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2518, 490],
						[2539, 507],
						[2558, 527],
						[2572, 550],
						[2728, 803],
						[2752, 986],
						[2567, 1219],
						[2483, 1324],
						[2339, 1376],
						[2221, 1402]
					],
					labelBBox: {
						x: 2699,
						y: 899,
						width: 219,
						height: 18
					}
				},
				{
					id: "1ggqana",
					parent: null,
					source: "harness.runner",
					target: "supabase",
					label: "[...]",
					relations: ["lcskfv", "1vz6r2x"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2186, 830],
						[2148, 859],
						[2112, 895],
						[2088, 937],
						[2020, 1059],
						[2016, 1223],
						[2022, 1327]
					],
					labelBBox: {
						x: 2089,
						y: 1076,
						width: 25,
						height: 18
					}
				},
				{
					id: "1lfvgvm",
					parent: null,
					source: "harness.gates",
					target: "supabase",
					label: "lê regras, budget gates e stop \nconditions",
					relations: ["1jxsfcs"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2260, 1178],
						[2218, 1225],
						[2166, 1282],
						[2122, 1330]
					],
					labelBBox: {
						x: 2197,
						y: 1240,
						width: 189,
						height: 34
					}
				},
				{
					id: "5xku1w",
					parent: null,
					source: "python.enforce",
					target: "supabase",
					label: "[...]",
					relations: ["tbq3u7", "1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[1749, 1179],
						[1802, 1225],
						[1868, 1283],
						[1923, 1331]
					],
					labelBBox: {
						x: 1853,
						y: 1246,
						width: 25,
						height: 18
					}
				},
				{
					id: "1fqmsax",
					parent: null,
					source: "braide.bridgeC4",
					target: "likec4",
					label: "promove a arquitetura ao blueprint \ncanônico",
					relations: ["1p8r6f5"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[239, 1178],
						[248, 1212],
						[262, 1248],
						[282, 1278],
						[294, 1297],
						[310, 1315],
						[326, 1331]
					],
					labelBBox: {
						x: 283,
						y: 1240,
						width: 218,
						height: 34
					}
				},
				{
					id: "t5aw9u",
					parent: null,
					source: "harness.loop",
					target: "agents",
					label: "invoca os agentes de execução",
					relations: ["1oidkd8"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[2196, 490],
						[2168, 509],
						[2138, 530],
						[2111, 550],
						[2074, 579],
						[2035, 612],
						[2001, 643]
					],
					labelBBox: {
						x: 2112,
						y: 560,
						width: 201,
						height: 18
					}
				},
				{
					id: "sl92qm",
					parent: null,
					source: "lucas",
					target: "mind.ui",
					label: "lê a continuidade e direciona \nprioridades",
					relations: ["2b4bsw"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[723, 180],
						[723, 366],
						[723, 794],
						[723, 988]
					],
					labelBBox: {
						x: 724,
						y: 551,
						width: 182,
						height: 35
					}
				},
				{
					id: "1d77gc4",
					parent: null,
					source: "mind.ui",
					target: "supabase",
					label: "mostra a continuidade do Project Home",
					relations: ["zbshh4"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[848, 1179],
						[874, 1194],
						[901, 1208],
						[928, 1219],
						[1236, 1339],
						[1620, 1392],
						[1845, 1413]
					],
					labelBBox: {
						x: 1103,
						y: 1248,
						width: 250,
						height: 18
					}
				},
				{
					id: "9ai0yy",
					parent: null,
					source: "mind.ui",
					target: "likec4",
					label: "abre as views do blueprint",
					relations: ["bplrub"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[652, 1178],
						[614, 1225],
						[568, 1282],
						[529, 1330]
					],
					labelBBox: {
						x: 596,
						y: 1248,
						width: 167,
						height: 18
					}
				},
				{
					id: "1iw2xej",
					parent: null,
					source: "lucas",
					target: "braide",
					label: "desenvolve código e arquitetura no \ncockpit local",
					relations: ["5uetep"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[578, 180],
						[545, 200],
						[509, 222],
						[474, 244]
					],
					labelBBox: {
						x: 299,
						y: 176,
						width: 222,
						height: 35
					}
				},
				{
					id: "12hfhci",
					parent: null,
					source: "lucas",
					target: "harness",
					label: "dispara e acompanha o loop /op",
					relations: ["1mx1b3e"],
					color: "gray",
					line: "dashed",
					head: "normal",
					points: [
						[883, 121],
						[1171, 176],
						[1777, 292],
						[2110, 355]
					],
					labelBBox: {
						x: 1297,
						y: 218,
						width: 204,
						height: 18
					}
				}
			]
		},
		flow: {
			_type: "dynamic",
			tags: null,
			links: null,
			_stage: "layouted",
			sourcePath: "src/model.views.c4",
			description: { md: "Traça o fluxo canônico do desenho híbrido (rascunho T28, refinado T29):\nLucas dispara, o Harness executa, o Python valida, o Supabase registra,\ne a arquitetura promovida pelo Braide retorna ao blueprint LikeC4." },
			title: "Fluxo típico ponta a ponta — task → execução → evidência → blueprint",
			id: "flow",
			variant: "diagram",
			autoLayout: { direction: "LR" },
			notation: { nodes: [{
				title: "Sistema de Software Externo",
				shape: "rectangle",
				color: "muted",
				kinds: ["external-system"]
			}, {
				title: "Tabela de Banco de Dados",
				shape: "storage",
				color: "primary",
				kinds: ["db-table"]
			}] },
			hash: "Mv2PKv-TYQrZVWSKPZWP915hEYEjlsP9kjfPDsQvEms",
			sequenceLayout: {
				actors: [
					{
						id: "lucas",
						x: 0,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-01_source",
							cx: 160,
							cy: 306,
							height: 40,
							type: "source",
							position: "right"
						}, {
							id: "step-08_source",
							cx: 160,
							cy: 749,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "harness.loop",
						x: 380,
						y: 0,
						width: 361,
						height: 180,
						ports: [
							{
								id: "step-01_target",
								cx: 181,
								cy: 306,
								height: 24,
								type: "target",
								position: "left"
							},
							{
								id: "step-02_source",
								cx: 181,
								cy: 328,
								height: 40,
								type: "source",
								position: "right"
							},
							{
								id: "step-03_source",
								cx: 181,
								cy: 422,
								height: 40,
								type: "source",
								position: "right"
							}
						]
					},
					{
						id: "supabase.tasks",
						x: 801,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-02_target",
							cx: 160,
							cy: 328,
							height: 24,
							type: "target",
							position: "left"
						}]
					},
					{
						id: "harness.runner",
						x: 1181,
						y: 0,
						width: 320,
						height: 180,
						ports: [
							{
								id: "step-03_target",
								cx: 160,
								cy: 422,
								height: 24,
								type: "target",
								position: "left"
							},
							{
								id: "step-04_source",
								cx: 160,
								cy: 444,
								height: 40,
								type: "source",
								position: "right"
							},
							{
								id: "step-05_source",
								cx: 160,
								cy: 538,
								height: 40,
								type: "source",
								position: "right"
							},
							{
								id: "step-07_source",
								cx: 160,
								cy: 654,
								height: 40,
								type: "source",
								position: "right"
							}
						]
					},
					{
						id: "agents",
						x: 1561,
						y: 0,
						width: 341,
						height: 180,
						ports: [{
							id: "step-04_target",
							cx: 171,
							cy: 444,
							height: 24,
							type: "target",
							position: "left"
						}]
					},
					{
						id: "python.enforce",
						x: 1962,
						y: 0,
						width: 331,
						height: 180,
						ports: [{
							id: "step-05_target",
							cx: 166,
							cy: 538,
							height: 24,
							type: "target",
							position: "left"
						}, {
							id: "step-06_source",
							cx: 166,
							cy: 560,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "supabase.outputs",
						x: 2353,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-06_target",
							cx: 160,
							cy: 560,
							height: 24,
							type: "target",
							position: "left"
						}]
					},
					{
						id: "supabase.artifacts",
						x: 2733,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-07_target",
							cx: 160,
							cy: 654,
							height: 24,
							type: "target",
							position: "left"
						}]
					},
					{
						id: "braide.acp",
						x: 3113,
						y: 0,
						width: 329,
						height: 180,
						ports: [{
							id: "step-08_target",
							cx: 165,
							cy: 749,
							height: 24,
							type: "target",
							position: "left"
						}, {
							id: "step-09_source",
							cx: 165,
							cy: 771,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "braide.bridgeC4",
						x: 3502,
						y: 0,
						width: 343,
						height: 180,
						ports: [{
							id: "step-09_target",
							cx: 172,
							cy: 771,
							height: 24,
							type: "target",
							position: "left"
						}, {
							id: "step-10_source",
							cx: 172,
							cy: 793,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "likec4.source",
						x: 3905,
						y: 0,
						width: 332,
						height: 180,
						ports: [{
							id: "step-10_target",
							cx: 166,
							cy: 793,
							height: 24,
							type: "target",
							position: "left"
						}]
					},
					{
						id: "python.pipeline",
						x: 4297,
						y: 0,
						width: 376,
						height: 180,
						ports: [{
							id: "step-11_source",
							cx: 188,
							cy: 888,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "mind.blueprint.publish",
						x: 4733,
						y: 0,
						width: 347,
						height: 180,
						ports: [{
							id: "step-11_target",
							cx: 174,
							cy: 888,
							height: 24,
							type: "target",
							position: "left"
						}, {
							id: "step-12_source",
							cx: 174,
							cy: 910,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "supabase.snapshots",
						x: 5140,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-12_target",
							cx: 160,
							cy: 910,
							height: 24,
							type: "target",
							position: "left"
						}]
					}
				],
				compounds: [],
				steps: [
					{
						id: "step-01",
						sourceHandle: "step-01_source",
						targetHandle: "step-01_target",
						labelBBox: {
							width: 156,
							height: 28
						}
					},
					{
						id: "step-02",
						sourceHandle: "step-02_source",
						targetHandle: "step-02_target",
						labelBBox: {
							width: 206,
							height: 28
						}
					},
					{
						id: "step-03",
						sourceHandle: "step-03_source",
						targetHandle: "step-03_target",
						labelBBox: {
							width: 199,
							height: 28
						}
					},
					{
						id: "step-04",
						sourceHandle: "step-04_source",
						targetHandle: "step-04_target",
						labelBBox: {
							width: 225,
							height: 28
						}
					},
					{
						id: "step-05",
						sourceHandle: "step-05_source",
						targetHandle: "step-05_target",
						labelBBox: {
							width: 234,
							height: 29
						}
					},
					{
						id: "step-06",
						sourceHandle: "step-06_source",
						targetHandle: "step-06_target",
						labelBBox: {
							width: 176,
							height: 28
						}
					},
					{
						id: "step-07",
						sourceHandle: "step-07_source",
						targetHandle: "step-07_target",
						labelBBox: {
							width: 202,
							height: 29
						}
					},
					{
						id: "step-08",
						sourceHandle: "step-08_source",
						targetHandle: "step-08_target",
						labelBBox: {
							width: 297,
							height: 43
						}
					},
					{
						id: "step-09",
						sourceHandle: "step-09_source",
						targetHandle: "step-09_target",
						labelBBox: {
							width: 239,
							height: 28
						}
					},
					{
						id: "step-10",
						sourceHandle: "step-10_source",
						targetHandle: "step-10_target",
						labelBBox: {
							width: 226,
							height: 29
						}
					},
					{
						id: "step-11",
						sourceHandle: "step-11_source",
						targetHandle: "step-11_target",
						labelBBox: {
							width: 233,
							height: 28
						}
					},
					{
						id: "step-12",
						sourceHandle: "step-12_source",
						targetHandle: "step-12_target",
						labelBBox: {
							width: 269,
							height: 28
						}
					}
				],
				parallelAreas: [],
				bounds: {
					x: 0,
					y: 0,
					width: 5460,
					height: 988
				}
			},
			bounds: {
				x: 0,
				y: 0,
				width: 3187,
				height: 1321
			},
			nodes: [
				{
					id: "lucas",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["step-01", "step-08"],
					title: "Lucas",
					modelRef: "lucas",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 28,
					y: 740,
					width: 320,
					height: 180,
					labelBBox: {
						x: 131,
						y: 76,
						width: 57,
						height: 24
					}
				},
				{
					id: "harness.loop",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-01"],
					outEdges: ["step-02", "step-03"],
					title: "Orquestrador de Jobs",
					modelRef: "harness.loop",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "orquestrador → task → execução → validação → próxima decisão." },
					tags: [],
					technology: "orchestrator.py",
					kind: "component",
					x: 790,
					y: 580,
					width: 361,
					height: 180,
					labelBBox: {
						x: 19,
						y: 46,
						width: 325,
						height: 85
					}
				},
				{
					id: "supabase.tasks",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-02"],
					outEdges: [],
					title: "Agent Tasks",
					modelRef: "supabase.tasks",
					shape: "storage",
					color: "primary",
					icon: "tech:postgresql",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 1550,
					y: 290,
					width: 320,
					height: 180,
					labelBBox: {
						x: 89,
						y: 66,
						width: 173,
						height: 45
					}
				},
				{
					id: "harness.runner",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-03"],
					outEdges: [
						"step-04",
						"step-05",
						"step-07"
					],
					title: "Runner de Agente",
					modelRef: "harness.runner",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Executa a task reivindicada e produz evidência." },
					tags: [],
					technology: "claude --resume / codex exec",
					kind: "component",
					x: 1550,
					y: 580,
					width: 320,
					height: 180,
					labelBBox: {
						x: 36,
						y: 46,
						width: 249,
						height: 85
					}
				},
				{
					id: "agents",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-04"],
					outEdges: [],
					title: "Agentes de Execução",
					modelRef: "agents",
					shape: "rectangle",
					color: "muted",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Agentes que executam o trabalho e publicam evidências de volta no runtime." },
					tags: [],
					notation: "Sistema de Software Externo",
					technology: "Hermes / Claude / Codex / futuros workers",
					kind: "external-system",
					x: 2233,
					y: 271,
					width: 341,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 305,
						height: 85
					}
				},
				{
					id: "python.enforce",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-05"],
					outEdges: ["step-06"],
					title: "Enforcement de Contrato",
					modelRef: "python.enforce",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Verifica contrato, identidade e ownership de execução antes de side-effects (T13/T19)." },
					tags: [],
					technology: "Validação determinística",
					kind: "component",
					x: 2238,
					y: 561,
					width: 331,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 296,
						height: 85
					}
				},
				{
					id: "supabase.outputs",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-06"],
					outEdges: [],
					title: "Task Outputs",
					modelRef: "supabase.outputs",
					shape: "storage",
					color: "primary",
					icon: "tech:postgresql",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 2867,
					y: 561,
					width: 320,
					height: 180,
					labelBBox: {
						x: 85,
						y: 66,
						width: 181,
						height: 45
					}
				},
				{
					id: "supabase.artifacts",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-07"],
					outEdges: [],
					title: "Artifacts",
					modelRef: "supabase.artifacts",
					shape: "storage",
					color: "primary",
					icon: "tech:postgresql",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 2244,
					y: 851,
					width: 320,
					height: 180,
					labelBBox: {
						x: 108,
						y: 66,
						width: 134,
						height: 45
					}
				},
				{
					id: "braide.acp",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-08"],
					outEdges: ["step-09"],
					title: "Agente ACP",
					modelRef: "braide.acp",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Gera e edita código dentro da sessão local." },
					tags: [],
					technology: "Codex / GPT via ACP",
					kind: "component",
					x: 806,
					y: 1015,
					width: 329,
					height: 180,
					labelBBox: {
						x: 18,
						y: 55,
						width: 293,
						height: 67
					}
				},
				{
					id: "braide.bridgeC4",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-09"],
					outEdges: ["step-10"],
					title: "Ponte .c4",
					modelRef: "braide.bridgeC4",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { md: "Handoff arquitetural: só decisão + arquitetura promovidas ao Mind.\nSync entre sessões/worktrees paralelas é por disciplina git — o Braide não tem sync nativo do .c4 (T18)." },
					tags: [],
					technology: "arquivo .c4 versionado em git",
					kind: "component",
					x: 1538,
					y: 1123,
					width: 343,
					height: 180,
					labelBBox: {
						x: 18,
						y: 19,
						width: 307,
						height: 139
					}
				},
				{
					id: "likec4.source",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-10"],
					outEdges: [],
					title: "Fonte do Blueprint",
					modelRef: "likec4.source",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Fonte canônica de arquitetura como código, escrita por humanos e agentes." },
					tags: [],
					technology: "model.c4 + model.views.c4",
					kind: "component",
					x: 2238,
					y: 1141,
					width: 332,
					height: 180,
					labelBBox: {
						x: 17,
						y: 46,
						width: 297,
						height: 85
					}
				},
				{
					id: "python.pipeline",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["step-11"],
					title: "Worker de Pipeline",
					modelRef: "python.pipeline",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Executa a cadeia LikeC4 → snapshot → Supabase (T14C)." },
					tags: [],
					technology: "Worker de publicação",
					kind: "component",
					x: 0,
					y: 0,
					width: 376,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 340,
						height: 85
					}
				},
				{
					id: "mind.blueprint.publish",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-11"],
					outEdges: ["step-12"],
					title: "Publicador Supabase",
					modelRef: "mind.blueprint.publish",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Publica o snapshot mais recente e metadados no repositório de continuidade." },
					tags: [],
					technology: "Cliente Supabase / API",
					kind: "component",
					x: 797,
					y: 0,
					width: 347,
					height: 180,
					labelBBox: {
						x: 18,
						y: 46,
						width: 312,
						height: 85
					}
				},
				{
					id: "supabase.snapshots",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-12"],
					outEdges: [],
					title: "Blueprint Snapshots",
					modelRef: "supabase.snapshots",
					shape: "storage",
					color: "primary",
					icon: "tech:postgresql",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					notation: "Tabela de Banco de Dados",
					technology: "Postgresql",
					kind: "db-table",
					x: 1550,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 55,
						y: 66,
						width: 241,
						height: 45
					}
				}
			],
			edges: [
				{
					id: "step-01",
					parent: null,
					source: "lucas",
					target: "harness.loop",
					label: "cria/dispara a task",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@0",
					points: [
						[348, 797],
						[473, 772],
						[648, 736],
						[781, 709]
					],
					labelBBox: {
						x: 516,
						y: 690,
						width: 140,
						height: 20
					}
				},
				{
					id: "step-02",
					parent: null,
					source: "harness.loop",
					target: "supabase.tasks",
					label: "reivindica e marca running",
					relations: ["1660z0j"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@1",
					points: [
						[1151, 599],
						[1270, 553],
						[1424, 492],
						[1540, 447]
					],
					labelBBox: {
						x: 1252,
						y: 442,
						width: 190,
						height: 20
					}
				},
				{
					id: "step-03",
					parent: null,
					source: "harness.loop",
					target: "harness.runner",
					label: "despacha para execução",
					relations: ["9l25k0"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@2",
					points: [
						[1151, 670],
						[1270, 670],
						[1424, 670],
						[1540, 670]
					],
					labelBBox: {
						x: 1256,
						y: 638,
						width: 183,
						height: 20
					}
				},
				{
					id: "step-04",
					parent: null,
					source: "harness.runner",
					target: "agents",
					label: "invoca o agente de execução",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@3",
					points: [
						[1870, 599],
						[1975, 552],
						[2114, 490],
						[2224, 441]
					],
					labelBBox: {
						x: 1956,
						y: 438,
						width: 209,
						height: 20
					}
				},
				{
					id: "step-05",
					parent: null,
					source: "harness.runner",
					target: "python.enforce",
					label: "submete output para validação",
					relations: ["1rglzw5"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@4",
					points: [
						[1870, 666],
						[1977, 663],
						[2118, 659],
						[2228, 656]
					],
					labelBBox: {
						x: 1951,
						y: 625,
						width: 218,
						height: 21
					}
				},
				{
					id: "step-06",
					parent: null,
					source: "python.enforce",
					target: "supabase.outputs",
					label: "grava output validado",
					relations: ["1g3qijg"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@5",
					points: [
						[2570, 651],
						[2658, 651],
						[2767, 651],
						[2856, 651]
					],
					labelBBox: {
						x: 2643,
						y: 619,
						width: 160,
						height: 20
					}
				},
				{
					id: "step-07",
					parent: null,
					source: "harness.runner",
					target: "supabase.artifacts",
					label: "ancora payloads pesados",
					relations: ["1vz6r2x"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@6",
					points: [
						[1870, 732],
						[1979, 775],
						[2123, 831],
						[2233, 875]
					],
					labelBBox: {
						x: 1967,
						y: 733,
						width: 186,
						height: 21
					}
				},
				{
					id: "step-08",
					parent: null,
					source: "lucas",
					target: "braide.acp",
					label: "desenvolve código/arquitetura via agente \nACP",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@7",
					points: [
						[348, 886],
						[478, 932],
						[663, 997],
						[797, 1044]
					],
					labelBBox: {
						x: 445,
						y: 877,
						width: 281,
						height: 35
					}
				},
				{
					id: "step-09",
					parent: null,
					source: "braide.acp",
					target: "braide.bridgeC4",
					label: "promove decisão de arquitetura",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@8",
					points: [
						[1136, 1129],
						[1252, 1146],
						[1408, 1169],
						[1528, 1187]
					],
					labelBBox: {
						x: 1236,
						y: 1111,
						width: 223,
						height: 20
					}
				},
				{
					id: "step-10",
					parent: null,
					source: "braide.bridgeC4",
					target: "likec4.source",
					label: "atualiza o blueprint canônico",
					relations: ["1p8r6f5"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@9",
					points: [
						[1882, 1217],
						[1987, 1220],
						[2121, 1224],
						[2227, 1226]
					],
					labelBBox: {
						x: 1955,
						y: 1187,
						width: 210,
						height: 21
					}
				},
				{
					id: "step-11",
					parent: null,
					source: "python.pipeline",
					target: "mind.blueprint.publish",
					label: "publica o snapshot atualizado",
					relations: ["18h8oke"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@10",
					points: [
						[376, 90],
						[501, 90],
						[663, 90],
						[787, 90]
					],
					labelBBox: {
						x: 477,
						y: 58,
						width: 217,
						height: 20
					}
				},
				{
					id: "step-12",
					parent: null,
					source: "mind.blueprint.publish",
					target: "supabase.snapshots",
					label: "snapshot disponível para consumo",
					relations: ["1nigh98"],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@11",
					points: [
						[1145, 90],
						[1264, 90],
						[1421, 90],
						[1539, 90]
					],
					labelBBox: {
						x: 1221,
						y: 58,
						width: 253,
						height: 20
					}
				}
			]
		}
	},
	deployments: {
		elements: {},
		relations: {}
	},
	imports: {},
	manualLayouts: {}
}));
//#endregion
//#region likec4:plugin/mind-blueprint-spike/react.js
function LikeC4ModelProvider({ children }) {
	return jsx(LikeC4ModelProvider$1, {
		likec4model: useLikeC4Model(),
		children
	});
}
function LikeC4View(props) {
	return jsx(LikeC4ModelProvider, { children: jsx(LikeC4View$1, {
		renderIcon: IconRenderer,
		...props
	}) });
}
function ReactLikeC4(props) {
	return jsx(LikeC4ModelProvider, { children: jsx(ReactLikeC4$1, {
		renderIcon: IconRenderer,
		...props
	}) });
}
//#endregion
//#region node_modules/likec4/__app__/codegen/react.mjs
var s = $likec4model.get();
function isLikeC4ViewId(e) {
	return e != null && typeof e == "string" && !!s.findView(e);
}
//#endregion
export { LikeC4ModelProvider, LikeC4View, ReactLikeC4, IconRenderer as RenderIcon, isLikeC4ViewId, s as likec4model, useLikeC4Model, useLikeC4View };
