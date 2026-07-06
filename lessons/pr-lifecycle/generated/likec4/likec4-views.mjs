import { jsx } from "react/jsx-runtime";
import { LikeC4Model } from "@likec4/core/model";
import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { LikeC4ModelProvider as LikeC4ModelProvider$1, LikeC4View as LikeC4View$1, ReactLikeC4 as ReactLikeC4$1 } from "likec4/react";
//#region likec4:plugin/default/icons.jsx
var Icons = {};
function IconRenderer({ node, ...props }) {
	const IconComponent = Icons[node.icon ?? ""];
	if (!IconComponent) return null;
	return jsx(IconComponent, props);
}
//#endregion
//#region ../../.npm/_npx/f8ded909d942c3b7/node_modules/likec4/dist/vite-plugin/internal/index.mjs
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
	projectId: "default",
	project: {
		id: "default",
		title: "default"
	},
	specification: {
		tags: {},
		elements: {
			actor: { style: {
				shape: "person",
				color: "green"
			} },
			repository: {
				notation: "Repositório",
				style: {
					shape: "storage",
					opacity: 20
				}
			},
			component: {
				notation: "Componente",
				style: { opacity: 20 }
			}
		},
		relationships: {},
		deployments: {},
		customColors: {}
	},
	elements: {
		dev: {
			style: {
				shape: "person",
				color: "green"
			},
			title: "Dev",
			kind: "actor",
			id: "dev"
		},
		reviewer: {
			style: {
				shape: "person",
				color: "green"
			},
			title: "Revisor",
			kind: "actor",
			id: "reviewer"
		},
		repo: {
			notation: "Repositório",
			style: {
				shape: "storage",
				opacity: 20
			},
			title: "Repositório Git",
			kind: "repository",
			id: "repo"
		},
		"repo.pr": {
			notation: "Componente",
			style: { opacity: 20 },
			description: { txt: "Proposta de mudança aberta para revisão." },
			title: "Pull Request",
			kind: "component",
			id: "repo.pr"
		},
		"repo.main": {
			notation: "Componente",
			style: { opacity: 20 },
			description: { txt: "Branch estável, protegida por revisão obrigatória." },
			title: "Branch main",
			kind: "component",
			id: "repo.main"
		}
	},
	relations: {},
	globals: {
		predicates: {},
		dynamicPredicates: {},
		styles: {}
	},
	views: {
		index: {
			_stage: "layouted",
			_type: "element",
			id: "index",
			title: "Landscape view",
			description: null,
			autoLayout: { direction: "TB" },
			notation: { nodes: [{
				title: "Repositório",
				shape: "storage",
				color: "primary",
				kinds: ["repository"]
			}] },
			hash: "Bh8cfe3UiaUvEaAv561tJDzxcrS7y2NsU970UHia_F4",
			bounds: {
				x: 0,
				y: 0,
				width: 320,
				height: 780
			},
			nodes: [
				{
					id: "dev",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [],
					title: "Dev",
					modelRef: "dev",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 0,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 140,
						y: 76,
						width: 40,
						height: 24
					}
				},
				{
					id: "reviewer",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [],
					title: "Revisor",
					modelRef: "reviewer",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 0,
					y: 300,
					width: 320,
					height: 180,
					labelBBox: {
						x: 124,
						y: 76,
						width: 72,
						height: 24
					}
				},
				{
					id: "repo",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: [],
					title: "Repositório Git",
					modelRef: "repo",
					shape: "storage",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					tags: [],
					notation: "Repositório",
					kind: "repository",
					x: 0,
					y: 600,
					width: 320,
					height: 180,
					labelBBox: {
						x: 92,
						y: 76,
						width: 136,
						height: 24
					}
				}
			],
			edges: []
		},
		flow: {
			_type: "dynamic",
			tags: null,
			links: null,
			_stage: "layouted",
			sourcePath: "flow.c4",
			description: { md: "Aula de teste técnico — fluxo mínimo: abrir, revisar/aprovar e fazer merge.\nNão tem valor pedagógico real; existe só para validar que o contrato\nde aula generaliza além de mind-task-flow." },
			title: "Ciclo de vida de um Pull Request",
			id: "flow",
			variant: "diagram",
			autoLayout: { direction: "LR" },
			notation: { nodes: [{
				title: "Componente",
				shape: "rectangle",
				color: "primary",
				kinds: ["component"]
			}] },
			hash: "ZBxbtvQVtuXlzJbHSH1zOpDDucrFeAsXUNGJ0rfF30g",
			sequenceLayout: {
				actors: [
					{
						id: "dev",
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
						}]
					},
					{
						id: "reviewer",
						x: 380,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-02_source",
							cx: 160,
							cy: 400,
							height: 40,
							type: "source",
							position: "right"
						}]
					},
					{
						id: "repo.pr",
						x: 760,
						y: 0,
						width: 325,
						height: 180,
						ports: [
							{
								id: "step-01_target",
								cx: 163,
								cy: 306,
								height: 24,
								type: "target",
								position: "left"
							},
							{
								id: "step-02_target",
								cx: 163,
								cy: 400,
								height: 24,
								type: "target",
								position: "left"
							},
							{
								id: "step-03_source",
								cx: 163,
								cy: 422,
								height: 40,
								type: "source",
								position: "right"
							}
						]
					},
					{
						id: "repo.main",
						x: 1145,
						y: 0,
						width: 320,
						height: 180,
						ports: [{
							id: "step-03_target",
							cx: 160,
							cy: 422,
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
							width: 223,
							height: 28
						}
					},
					{
						id: "step-02",
						sourceHandle: "step-02_source",
						targetHandle: "step-02_target",
						labelBBox: {
							width: 138,
							height: 28
						}
					},
					{
						id: "step-03",
						sourceHandle: "step-03_source",
						targetHandle: "step-03_target",
						labelBBox: {
							width: 226,
							height: 28
						}
					}
				],
				parallelAreas: [],
				bounds: {
					x: 0,
					y: 0,
					width: 1465,
					height: 500
				}
			},
			bounds: {
				x: 0,
				y: 0,
				width: 1649,
				height: 470
			},
			nodes: [
				{
					id: "dev",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["step-01"],
					title: "Dev",
					modelRef: "dev",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 0,
					y: 0,
					width: 320,
					height: 180,
					labelBBox: {
						x: 140,
						y: 76,
						width: 40,
						height: 24
					}
				},
				{
					id: "reviewer",
					parent: null,
					level: 0,
					children: [],
					inEdges: [],
					outEdges: ["step-02"],
					title: "Revisor",
					modelRef: "reviewer",
					shape: "person",
					color: "green",
					style: {
						opacity: 15,
						size: "md"
					},
					tags: [],
					kind: "actor",
					x: 0,
					y: 290,
					width: 320,
					height: 180,
					labelBBox: {
						x: 124,
						y: 76,
						width: 72,
						height: 24
					}
				},
				{
					id: "repo.pr",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-01", "step-02"],
					outEdges: ["step-03"],
					title: "Pull Request",
					modelRef: "repo.pr",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Proposta de mudança aberta para revisão." },
					tags: [],
					notation: "Componente",
					kind: "component",
					x: 660,
					y: 145,
					width: 325,
					height: 180,
					labelBBox: {
						x: 18,
						y: 65,
						width: 289,
						height: 47
					}
				},
				{
					id: "repo.main",
					parent: null,
					level: 0,
					children: [],
					inEdges: ["step-03"],
					outEdges: [],
					title: "Branch main",
					modelRef: "repo.main",
					shape: "rectangle",
					color: "primary",
					style: {
						opacity: 20,
						size: "md"
					},
					description: { txt: "Branch estável, protegida por revisão obrigatória." },
					tags: [],
					notation: "Componente",
					kind: "component",
					x: 1329,
					y: 145,
					width: 320,
					height: 180,
					labelBBox: {
						x: 34,
						y: 56,
						width: 252,
						height: 65
					}
				}
			],
			edges: [
				{
					id: "step-01",
					parent: null,
					source: "dev",
					target: "repo.pr",
					label: "abre o PR com as mudanças",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@0",
					points: [
						[320, 125],
						[420, 147],
						[548, 175],
						[650, 197]
					],
					labelBBox: {
						x: 389,
						y: 109,
						width: 207,
						height: 20
					}
				},
				{
					id: "step-02",
					parent: null,
					source: "reviewer",
					target: "repo.pr",
					label: "revisa e aprova",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@1",
					points: [
						[320, 345],
						[420, 323],
						[548, 295],
						[650, 273]
					],
					labelBBox: {
						x: 432,
						y: 254,
						width: 122,
						height: 20
					}
				},
				{
					id: "step-03",
					parent: null,
					source: "repo.pr",
					target: "repo.main",
					label: "faz merge na branch principal",
					relations: [],
					color: "gray",
					line: "dashed",
					head: "normal",
					tags: [],
					astPath: "/steps@2",
					points: [
						[986, 235],
						[1087, 235],
						[1216, 235],
						[1319, 235]
					],
					labelBBox: {
						x: 1055,
						y: 203,
						width: 210,
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
//#region likec4:plugin/default/react.js
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
//#region ../../.npm/_npx/f8ded909d942c3b7/node_modules/likec4/__app__/codegen/react.mjs
var s = $likec4model.get();
function isLikeC4ViewId(e) {
	return e != null && typeof e == "string" && !!s.findView(e);
}
//#endregion
export { LikeC4ModelProvider, LikeC4View, ReactLikeC4, IconRenderer as RenderIcon, isLikeC4ViewId, s as likec4model, useLikeC4Model, useLikeC4View };
