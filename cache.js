"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
/**
 * TTL cache implementation
 *
 * TODO Comment
 */
var time_1 = require("./time");
var Cache = /** @class */ (function () {
    function Cache(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.cache = new Map();
        var defaultOptions = {
            maxItems: 1000,
            resolution: 1000,
            // Default timeout is infinity
            defaultTTL: Number.POSITIVE_INFINITY
        };
        this.options = __assign(__assign({}, defaultOptions), options);
        this.timer = setInterval(function () { return _this.cleanup(); }, options.resolution);
        this.timer.unref();
    }
    Cache.prototype.set = function (key, value, ttl) {
        var now = time_1.Time.getMiliseconds();
        var wrapped = {
            created: now,
            value: value,
            ttl: ttl !== null && ttl !== void 0 ? ttl : this.options.defaultTTL
        };
        this.cache.set(key, wrapped);
        return this;
    };
    /**
     * Returns value by its key
     *
     * @param key Key of value to get
     * @param refresh True to refresh item TTL or false to not
     */
    Cache.prototype.get = function (key, refresh) {
        if (refresh === void 0) { refresh = false; }
        var wrapped = this.cache.get(key);
        if (wrapped) {
            if (refresh) {
                var now = time_1.Time.getMiliseconds();
                wrapped.created = now;
            }
        }
        return wrapped === null || wrapped === void 0 ? void 0 : wrapped.value;
    };
    Cache.prototype.has = function (key) {
        return this.cache.has(key);
    };
    Cache.prototype["delete"] = function (key) {
        return this.cache["delete"](key);
    };
    Object.defineProperty(Cache.prototype, "size", {
        get: function () {
            return this.cache.size;
        },
        enumerable: true,
        configurable: true
    });
    Cache.prototype.forEach = function (cb) {
        this.cache.forEach(function (value, key) {
            cb(value.value, key);
        });
    };
    Cache.prototype.destroy = function () {
        clearInterval(this.timer);
        delete this.cache;
    };
    Cache.prototype.cleanup = function () {
        if (this.cache.size === 0) {
            return;
        }
        var now = time_1.Time.getMiliseconds();
        for (var _i = 0, _a = this.cache; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (now > (value.created + value.ttl)) {
                this.cache["delete"](key);
            }
        }
    };
    return Cache;
}());
exports.Cache = Cache;
