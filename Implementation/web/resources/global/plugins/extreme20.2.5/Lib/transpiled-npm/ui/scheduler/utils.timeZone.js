"use strict";

exports.default = void 0;

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _utils = _interopRequireDefault(require("./timezones/utils.timezones_data"));

var _dateAdapter = _interopRequireDefault(require("./dateAdapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var toMs = _date.default.dateToMilliseconds;
var MINUTES_IN_HOUR = 60;

var createUTCDateWithLocalOffset = function createUTCDateWithLocalOffset(date) {
  if (!date) {
    return null;
  }

  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
};

var createDateFromUTCWithLocalOffset = function createDateFromUTCWithLocalOffset(date) {
  var result = (0, _dateAdapter.default)(date);
  var timezoneOffsetBeforeInMin = result.getTimezoneOffset();
  result.addTime(result.getTimezoneOffset('minute'));
  result.subtractMinutes(timezoneOffsetBeforeInMin - result.getTimezoneOffset());
  return result.source;
};

var getTimeZones = function getTimeZones() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var dateInUTC = createUTCDate(date);
  return _utils.default.getDisplayedTimeZones(dateInUTC.getTime());
};

var createUTCDate = function createUTCDate(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
};

var getTimezoneOffsetChangeInMinutes = function getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) {
  return getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);
};

var getTimezoneOffsetChangeInMs = function getTimezoneOffsetChangeInMs(startDate, endDate, updatedStartDate, updatedEndDate) {
  return getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
};

var getDaylightOffset = function getDaylightOffset(startDate, endDate) {
  return new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();
};

var getDaylightOffsetInMs = function getDaylightOffsetInMs(startDate, endDate) {
  return getDaylightOffset(startDate, endDate) * toMs('minute');
};

var calculateTimezoneByValue = function calculateTimezoneByValue(timezone) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

  // NOTE: This check could be removed. We don't support numerical timezones
  if (typeof timezone === 'string') {
    var dateUtc = createUTCDate(date);
    return _utils.default.getTimeZoneOffsetById(timezone, dateUtc.getTime());
  }

  return timezone;
};

var _getDaylightOffsetByTimezone = function _getDaylightOffsetByTimezone(startDate, endDate, timeZone) {
  return calculateTimezoneByValue(timeZone, startDate) - calculateTimezoneByValue(timeZone, endDate);
};

var getCorrectedDateByDaylightOffsets = function getCorrectedDateByDaylightOffsets(convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) {
  var daylightOffsetByCommonTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, timeZone);

  var daylightOffsetByAppointmentTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);

  var diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;
  return new Date(date.getTime() - diff * toMs('hour'));
};

var correctRecurrenceExceptionByTimezone = function correctRecurrenceExceptionByTimezone(exception, exceptionByStartDate, timeZone, startDateTimeZone) {
  var isBackConversion = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;

  if (startDateTimeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
  } else if (timeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
  }

  return new Date(exception.getTime() + (isBackConversion ? -1 : 1) * timezoneOffset * toMs('hour'));
};

var isTimezoneChangeInDate = function isTimezoneChangeInDate(date) {
  var startDayDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  var endDayDate = new Date(new Date(date).setHours(23, 59, 59, 0));
  return startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset() !== 0;
};

var getDateWithoutTimezoneChange = function getDateWithoutTimezoneChange(date) {
  var clonedDate = new Date(date);

  if (isTimezoneChangeInDate(clonedDate)) {
    var result = new Date(clonedDate);
    return new Date(result.setDate(result.getDate() + 1));
  }

  return clonedDate;
};

var isSameAppointmentDates = function isSameAppointmentDates(startDate, endDate) {
  // NOTE: subtract 1 millisecond to avoid 00.00 time. Method should return 'true' for "2020:10:10 22:00:00" and "2020:10:11 00:00:00", for example.
  endDate = new Date(endDate.getTime() - 1);
  return _date.default.sameDate(startDate, endDate);
};

var getClientTimezoneOffset = function getClientTimezoneOffset() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return date.getTimezoneOffset() * 60000;
};

var isEqualLocalTimeZone = function isEqualLocalTimeZone(timeZoneName) {
  if (Intl) {
    var localTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (localTimeZoneName) {
      return localTimeZoneName === timeZoneName;
    }
  }

  return isEqualLocalTimeZoneByNativeDate(timeZoneName);
};

var hasDSTInLocalTimeZone = function hasDSTInLocalTimeZone() {
  var _getExtremeDates = getExtremeDates(),
      _getExtremeDates2 = _slicedToArray(_getExtremeDates, 2),
      startDate = _getExtremeDates2[0],
      endDate = _getExtremeDates2[1];

  return startDate.getTimezoneOffset() !== endDate.getTimezoneOffset();
};

var isEqualLocalTimeZoneByNativeDate = function isEqualLocalTimeZoneByNativeDate(timeZoneName) {
  var _getExtremeDates3 = getExtremeDates(),
      _getExtremeDates4 = _slicedToArray(_getExtremeDates3, 2),
      startDate = _getExtremeDates4[0],
      endDate = _getExtremeDates4[1];

  var startDateLocalOffset = -startDate.getTimezoneOffset() / 60;
  var endDateLocalOffset = -endDate.getTimezoneOffset() / 60;
  var startDateOffset = calculateTimezoneByValue(timeZoneName, startDate);
  var endDateOffset = calculateTimezoneByValue(timeZoneName, endDate);

  if (startDateLocalOffset === startDateOffset && endDateLocalOffset === endDateOffset) {
    return true;
  }

  return false;
}; // TODO: Getting two dates in january or june is the standard mechanism for determining that an offset has occurred.


var getExtremeDates = function getExtremeDates() {
  var nowDate = new Date(Date.now());
  var startDate = new Date();
  var endDate = new Date();
  startDate.setFullYear(nowDate.getFullYear(), 0, 1);
  endDate.setFullYear(nowDate.getFullYear(), 6, 1);
  return [startDate, endDate];
};

var utils = {
  getDaylightOffset: getDaylightOffset,
  getDaylightOffsetInMs: getDaylightOffsetInMs,
  getTimezoneOffsetChangeInMinutes: getTimezoneOffsetChangeInMinutes,
  getTimezoneOffsetChangeInMs: getTimezoneOffsetChangeInMs,
  calculateTimezoneByValue: calculateTimezoneByValue,
  getCorrectedDateByDaylightOffsets: getCorrectedDateByDaylightOffsets,
  isSameAppointmentDates: isSameAppointmentDates,
  correctRecurrenceExceptionByTimezone: correctRecurrenceExceptionByTimezone,
  getClientTimezoneOffset: getClientTimezoneOffset,
  createUTCDateWithLocalOffset: createUTCDateWithLocalOffset,
  createDateFromUTCWithLocalOffset: createDateFromUTCWithLocalOffset,
  createUTCDate: createUTCDate,
  isTimezoneChangeInDate: isTimezoneChangeInDate,
  getDateWithoutTimezoneChange: getDateWithoutTimezoneChange,
  hasDSTInLocalTimeZone: hasDSTInLocalTimeZone,
  isEqualLocalTimeZone: isEqualLocalTimeZone,
  getTimeZones: getTimeZones
};
var _default = utils;
exports.default = _default;
module.exports = exports.default;