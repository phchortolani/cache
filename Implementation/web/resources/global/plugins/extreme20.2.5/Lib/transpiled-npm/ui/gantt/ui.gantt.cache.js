"use strict";

exports.GanttDataCache = void 0;

var _extend = require("../../core/utils/extend");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GanttDataCache = /*#__PURE__*/function () {
  function GanttDataCache() {
    _classCallCheck(this, GanttDataCache);

    this._cache = {};
    this._timers = {};
  }

  _createClass(GanttDataCache, [{
    key: "saveData",
    value: function saveData(key, data, keyExpireCallback) {
      if (data) {
        this._clearTimer(key);

        var storage = this._getCache(key, true);

        (0, _extend.extendFromObject)(storage, data, true);

        if (keyExpireCallback) {
          this._setExpireTimer(key, keyExpireCallback);
        }
      }
    }
  }, {
    key: "pullDataFromCache",
    value: function pullDataFromCache(key, target) {
      var data = this._getCache(key);

      if (data) {
        (0, _extend.extendFromObject)(target, data);
      }

      this._onKeyExpired(key);
    }
  }, {
    key: "hasData",
    value: function hasData(key) {
      return !!this._cache[key];
    }
  }, {
    key: "_getCache",
    value: function _getCache(key, forceCreate) {
      if (!this._cache[key] && forceCreate) {
        this._cache[key] = {};
      }

      return this._cache[key];
    }
  }, {
    key: "_setExpireTimer",
    value: function _setExpireTimer(key, callback) {
      var _this = this;

      this._timers[key] = setTimeout(function () {
        callback(key, _this._getCache(key));

        _this._onKeyExpired(key);
      }, 200);
    }
  }, {
    key: "_onKeyExpired",
    value: function _onKeyExpired(key) {
      this._clearCache(key);

      this._clearTimer(key);
    }
  }, {
    key: "_clearCache",
    value: function _clearCache(key) {
      delete this._cache[key];
    }
  }, {
    key: "_clearTimer",
    value: function _clearTimer(key) {
      var timers = this._timers;

      if (timers && timers[key]) {
        clearTimeout(timers[key]);
        delete timers[key];
      }
    }
  }]);

  return GanttDataCache;
}();

exports.GanttDataCache = GanttDataCache;