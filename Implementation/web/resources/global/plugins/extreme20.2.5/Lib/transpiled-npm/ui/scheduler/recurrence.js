"use strict";

exports.getRecurrenceProcessor = getRecurrenceProcessor;

var _errors = _interopRequireDefault(require("../../core/errors"));

var _iterator = require("../../core/utils/iterator");

var _array = require("../../core/utils/array");

var _rrule = require("rrule");

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _utilsTimeZone = _interopRequireDefault(require("./utils.timeZone.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var toMs = _date.default.dateToMilliseconds;
var ruleNames = ['freq', 'interval', 'byday', 'byweekno', 'byyearday', 'bymonth', 'bymonthday', 'count', 'until', 'byhour', 'byminute', 'bysecond', 'bysetpos', 'wkst'];
var freqNames = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SECONDLY', 'MINUTELY', 'HOURLY'];
var days = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};
var loggedWarnings = [];
var recurrence = null;

function getRecurrenceProcessor() {
  if (!recurrence) {
    recurrence = new RecurrenceProcessor();
  }

  return recurrence;
}

var RecurrenceProcessor = /*#__PURE__*/function () {
  function RecurrenceProcessor() {
    _classCallCheck(this, RecurrenceProcessor);

    this.rRule = null;
    this.rRuleSet = null;
    this.validator = new RecurrenceValidator();
  }

  _createClass(RecurrenceProcessor, [{
    key: "generateDates",
    value: function generateDates(options) {
      var result = [];
      var recurrenceRule = this.evalRecurrenceRule(options.rule);
      var rule = recurrenceRule.rule;

      if (!recurrenceRule.isValid || !rule.freq) {
        return result;
      }

      var startDateUtc = _utilsTimeZone.default.createUTCDateWithLocalOffset(options.start);

      var endDateUtc = _utilsTimeZone.default.createUTCDateWithLocalOffset(options.end);

      var minDateUtc = _utilsTimeZone.default.createUTCDateWithLocalOffset(options.min);

      var maxDateUtc = _utilsTimeZone.default.createUTCDateWithLocalOffset(options.max);

      var duration = endDateUtc ? endDateUtc.getTime() - startDateUtc.getTime() : 0;

      this._initializeRRule(options, startDateUtc);

      var minTime = minDateUtc.getTime();

      var leftBorder = this._getLeftBorder(options, minDateUtc, duration);

      this.rRuleSet.between(leftBorder, maxDateUtc, true).forEach(function (date) {
        var endAppointmentTime = date.getTime() + duration;

        if (endAppointmentTime >= minTime) {
          var correctDate = _utilsTimeZone.default.createDateFromUTCWithLocalOffset(date);

          result.push(correctDate);
        }
      });
      return result;
    }
  }, {
    key: "hasRecurrence",
    value: function hasRecurrence(options) {
      return !!this.generateDates(options).length;
    }
  }, {
    key: "evalRecurrenceRule",
    value: function evalRecurrenceRule(rule) {
      var result = {
        rule: {},
        isValid: false
      };

      if (rule) {
        result.rule = this._parseRecurrenceRule(rule);
        result.isValid = this.validator.validateRRule(result.rule, rule);
      }

      return result;
    }
  }, {
    key: "isValidRecurrenceRule",
    value: function isValidRecurrenceRule(rule) {
      return this.evalRecurrenceRule(rule).isValid;
    }
  }, {
    key: "daysFromByDayRule",
    value: function daysFromByDayRule(rule) {
      var result = [];

      if (rule['byday']) {
        if (Array.isArray(rule['byday'])) {
          result = rule['byday'];
        } else {
          result = rule['byday'].split(',');
        }
      }

      return result;
    }
  }, {
    key: "getAsciiStringByDate",
    value: function getAsciiStringByDate(date) {
      var currentOffset = this._getTimeZoneOffset() * toMs('minute');
      var offsetDate = new Date(date.getTime() + currentOffset);
      return offsetDate.getFullYear() + ('0' + (offsetDate.getMonth() + 1)).slice(-2) + ('0' + offsetDate.getDate()).slice(-2) + 'T' + ('0' + offsetDate.getHours()).slice(-2) + ('0' + offsetDate.getMinutes()).slice(-2) + ('0' + offsetDate.getSeconds()).slice(-2) + 'Z';
    }
  }, {
    key: "getRecurrenceString",
    value: function getRecurrenceString(object) {
      if (!object || !object.freq) {
        return;
      }

      var result = '';

      for (var field in object) {
        var value = object[field];

        if (field === 'interval' && value < 2) {
          continue;
        }

        if (field === 'until') {
          value = this.getAsciiStringByDate(value);
        }

        result += field + '=' + value + ';';
      }

      result = result.substring(0, result.length - 1);
      return result.toUpperCase();
    }
  }, {
    key: "_parseExceptionToRawArray",
    value: function _parseExceptionToRawArray(value) {
      return value.match(/(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2}))?(Z)?/);
    }
  }, {
    key: "getDateByAsciiString",
    value: function getDateByAsciiString(exceptionText) {
      if (typeof exceptionText !== 'string') {
        return exceptionText;
      }

      var result = this._parseExceptionToRawArray(exceptionText);

      if (!result) {
        return null;
      }

      var _this$_createDateTupl = this._createDateTuple(result),
          _this$_createDateTupl2 = _slicedToArray(_this$_createDateTupl, 7),
          year = _this$_createDateTupl2[0],
          month = _this$_createDateTupl2[1],
          date = _this$_createDateTupl2[2],
          hours = _this$_createDateTupl2[3],
          minutes = _this$_createDateTupl2[4],
          seconds = _this$_createDateTupl2[5],
          isUtc = _this$_createDateTupl2[6];

      if (isUtc) {
        return new Date(Date.UTC(year, month, date, hours, minutes, seconds));
      }

      return new Date(year, month, date, hours, minutes, seconds);
    }
  }, {
    key: "_dispose",
    value: function _dispose() {
      if (this.rRuleSet) {
        delete this.rRuleSet;
        this.rRuleSet = null;
      }

      if (this.rRule) {
        delete this.rRule;
        this.rRule = null;
      }
    }
  }, {
    key: "_getTimeZoneOffset",
    value: function _getTimeZoneOffset() {
      return new Date().getTimezoneOffset();
    }
  }, {
    key: "_initializeRRule",
    value: function _initializeRRule(options, startDateUtc) {
      var _this = this;

      var ruleOptions = _rrule.RRule.parseString(options.rule);

      var firstDayOfWeek = options.firstDayOfWeek;
      ruleOptions.dtstart = startDateUtc;

      if (!ruleOptions.wkst && firstDayOfWeek) {
        var weekDayNumbers = [6, 0, 1, 2, 3, 4, 5];
        ruleOptions.wkst = weekDayNumbers[firstDayOfWeek];
      }

      this._createRRule(ruleOptions);

      if (options.exception) {
        var exceptionStrings = options.exception;
        var exceptionDates = exceptionStrings.split(',').map(function (rule) {
          return _this.getDateByAsciiString(rule);
        });
        exceptionDates.forEach(function (date) {
          if (options.getPostProcessedException) {
            date = options.getPostProcessedException(date);
          }

          var utcDate = _utilsTimeZone.default.createUTCDateWithLocalOffset(date);

          _this.rRuleSet.exdate(utcDate);
        });
      }
    }
  }, {
    key: "_createRRule",
    value: function _createRRule(ruleOptions) {
      this._dispose();

      var rRuleSet = new _rrule.RRuleSet();
      this.rRuleSet = rRuleSet;
      this.rRule = new _rrule.RRule(ruleOptions);
      this.rRuleSet.rrule(this.rRule);
    }
  }, {
    key: "_getLeftBorder",
    value: function _getLeftBorder(options, minDateUtc, appointmentDuration) {
      if (options.end && !_utilsTimeZone.default.isSameAppointmentDates(options.start, options.end)) {
        return new Date(minDateUtc.getTime() - appointmentDuration);
      }

      return minDateUtc;
    }
  }, {
    key: "_parseRecurrenceRule",
    value: function _parseRecurrenceRule(recurrence) {
      var ruleObject = {};
      var ruleParts = recurrence.split(';');

      for (var i = 0, len = ruleParts.length; i < len; i++) {
        var rule = ruleParts[i].split('=');
        var ruleName = rule[0].toLowerCase();
        var ruleValue = rule[1];
        ruleObject[ruleName] = ruleValue;
      }

      var count = parseInt(ruleObject.count);

      if (!isNaN(count)) {
        ruleObject.count = count;
      }

      if (ruleObject.interval) {
        var interval = parseInt(ruleObject.interval);

        if (!isNaN(interval)) {
          ruleObject.interval = interval;
        }
      } else {
        ruleObject.interval = 1;
      }

      if (ruleObject.freq && ruleObject.until) {
        ruleObject.until = this.getDateByAsciiString(ruleObject.until);
      }

      return ruleObject;
    }
  }, {
    key: "_createDateTuple",
    value: function _createDateTuple(parseResult) {
      var isUtc = parseResult[8] !== undefined;
      parseResult.shift();

      if (parseResult[3] === undefined) {
        parseResult.splice(3);
      } else {
        parseResult.splice(3, 1);
        parseResult.splice(6);
      }

      parseResult[1]--;
      parseResult.unshift(null);
      return [parseInt(parseResult[1]), parseInt(parseResult[2]), parseInt(parseResult[3]), parseInt(parseResult[4]) || 0, parseInt(parseResult[5]) || 0, parseInt(parseResult[6]) || 0, isUtc];
    }
  }]);

  return RecurrenceProcessor;
}();

var RecurrenceValidator = /*#__PURE__*/function () {
  function RecurrenceValidator() {
    _classCallCheck(this, RecurrenceValidator);
  }

  _createClass(RecurrenceValidator, [{
    key: "validateRRule",
    value: function validateRRule(rule, recurrence) {
      if (this._brokenRuleNameExists(rule) || (0, _array.inArray)(rule.freq, freqNames) === -1 || this._wrongCountRule(rule) || this._wrongIntervalRule(rule) || this._wrongDayOfWeek(rule) || this._wrongByMonthDayRule(rule) || this._wrongByMonth(rule) || this._wrongUntilRule(rule)) {
        this._logBrokenRule(recurrence);

        return false;
      }

      return true;
    }
  }, {
    key: "_wrongUntilRule",
    value: function _wrongUntilRule(rule) {
      var wrongUntil = false;
      var until = rule.until;

      if (until !== undefined && !(until instanceof Date)) {
        wrongUntil = true;
      }

      return wrongUntil;
    }
  }, {
    key: "_wrongCountRule",
    value: function _wrongCountRule(rule) {
      var wrongCount = false;
      var count = rule.count;

      if (count && typeof count === 'string') {
        wrongCount = true;
      }

      return wrongCount;
    }
  }, {
    key: "_wrongByMonthDayRule",
    value: function _wrongByMonthDayRule(rule) {
      var wrongByMonthDay = false;
      var byMonthDay = rule['bymonthday'];

      if (byMonthDay && isNaN(parseInt(byMonthDay))) {
        wrongByMonthDay = true;
      }

      return wrongByMonthDay;
    }
  }, {
    key: "_wrongByMonth",
    value: function _wrongByMonth(rule) {
      var wrongByMonth = false;
      var byMonth = rule['bymonth'];

      if (byMonth && isNaN(parseInt(byMonth))) {
        wrongByMonth = true;
      }

      return wrongByMonth;
    }
  }, {
    key: "_wrongIntervalRule",
    value: function _wrongIntervalRule(rule) {
      var wrongInterval = false;
      var interval = rule.interval;

      if (interval && typeof interval === 'string') {
        wrongInterval = true;
      }

      return wrongInterval;
    }
  }, {
    key: "_wrongDayOfWeek",
    value: function _wrongDayOfWeek(rule) {
      var byDay = rule['byday'];
      var daysByRule = getRecurrenceProcessor().daysFromByDayRule(rule);
      var brokenDaysExist = false;

      if (byDay === '') {
        brokenDaysExist = true;
      }

      (0, _iterator.each)(daysByRule, function (_, day) {
        if (!Object.prototype.hasOwnProperty.call(days, day)) {
          brokenDaysExist = true;
          return false;
        }
      });
      return brokenDaysExist;
    }
  }, {
    key: "_brokenRuleNameExists",
    value: function _brokenRuleNameExists(rule) {
      var brokenRuleExists = false;
      (0, _iterator.each)(rule, function (ruleName) {
        if ((0, _array.inArray)(ruleName, ruleNames) === -1) {
          brokenRuleExists = true;
          return false;
        }
      });
      return brokenRuleExists;
    }
  }, {
    key: "_logBrokenRule",
    value: function _logBrokenRule(recurrence) {
      if ((0, _array.inArray)(recurrence, loggedWarnings) === -1) {
        _errors.default.log('W0006', recurrence);

        loggedWarnings.push(recurrence);
      }
    }
  }]);

  return RecurrenceValidator;
}();