"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../../core/renderer"));

var _uiScheduler = _interopRequireDefault(require("./ui.scheduler.work_space"));

var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));

var _date = _interopRequireDefault(require("../../../core/utils/date"));

var _extend = require("../../../core/utils/extend");

var _position = require("../../../core/utils/position");

var _window = require("../../../core/utils/window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var toMs = _date.default.dateToMilliseconds;
var SCHEDULER_DATE_TIME_INDICATOR_CLASS = 'dx-scheduler-date-time-indicator';
var TIME_PANEL_CURRENT_TIME_CELL_CLASS = 'dx-scheduler-time-panel-current-time-cell';
var HEADER_CURRENT_TIME_CELL_CLASS = 'dx-scheduler-header-panel-current-time-cell';

var SchedulerWorkSpaceIndicator = /*#__PURE__*/function (_SchedulerWorkSpace) {
  _inherits(SchedulerWorkSpaceIndicator, _SchedulerWorkSpace);

  var _super = _createSuper(SchedulerWorkSpaceIndicator);

  function SchedulerWorkSpaceIndicator() {
    _classCallCheck(this, SchedulerWorkSpaceIndicator);

    return _super.apply(this, arguments);
  }

  _createClass(SchedulerWorkSpaceIndicator, [{
    key: "_getTimeZoneCalculator",
    value: function _getTimeZoneCalculator() {
      return this.invoke('getTimeZoneCalculator');
    }
  }, {
    key: "_getToday",
    value: function _getToday() {
      var todayDate = this.option('indicatorTime') || new Date();

      var timeZoneCalculator = this._getTimeZoneCalculator();

      return (timeZoneCalculator === null || timeZoneCalculator === void 0 ? void 0 : timeZoneCalculator.createDate(todayDate, {
        path: 'toGrid'
      })) || todayDate;
    }
  }, {
    key: "isIndicationOnView",
    value: function isIndicationOnView() {
      if (this.option('showCurrentTimeIndicator')) {
        var today = this._getToday();

        var endViewDate = _date.default.trimTime(this.getEndViewDate());

        return _date.default.dateInRange(today, this._firstViewDate, new Date(endViewDate.getTime() + toMs('day')));
      }

      return false;
    }
  }, {
    key: "isIndicationAvailable",
    value: function isIndicationAvailable() {
      if (!(0, _window.hasWindow)()) {
        return false;
      }

      var today = this._getToday();

      return today >= _date.default.trimTime(new Date(this.getStartViewDate()));
    }
  }, {
    key: "isIndicatorVisible",
    value: function isIndicatorVisible() {
      var today = this._getToday();

      var endViewDate = new Date(this.getEndViewDate());
      var firstViewDate = new Date(this.getStartViewDate());
      firstViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      endViewDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      return _date.default.dateInRange(today, firstViewDate, endViewDate);
    }
  }, {
    key: "_renderDateTimeIndication",
    value: function _renderDateTimeIndication() {
      if (this.isIndicationAvailable()) {
        if (this.option('shadeUntilCurrentTime')) {
          this._shader.render();
        }

        if (this.isIndicationOnView() && this.isIndicatorVisible()) {
          var groupCount = this._getGroupCount() || 1;

          var $container = this._dateTableScrollable.$content();

          var height = this.getIndicationHeight();

          var rtlOffset = this._getRtlOffset(this.getCellWidth());

          this._renderIndicator(height, rtlOffset, $container, groupCount);
        }
      }
    }
  }, {
    key: "_renderIndicator",
    value: function _renderIndicator(height, rtlOffset, $container, groupCount) {
      var groupedByDate = this.isGroupedByDate();
      var repeatCount = groupedByDate ? 1 : groupCount;

      for (var i = 0; i < repeatCount; i++) {
        var $indicator = this._createIndicator($container);

        $indicator.width(groupedByDate ? this.getCellWidth() * groupCount : this.getCellWidth());

        this._groupedStrategy.shiftIndicator($indicator, height, rtlOffset, i);
      }
    }
  }, {
    key: "_createIndicator",
    value: function _createIndicator($container) {
      var $indicator = (0, _renderer.default)('<div>').addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);
      $container.append($indicator);
      return $indicator;
    }
  }, {
    key: "_getRtlOffset",
    value: function _getRtlOffset(width) {
      return this.option('rtlEnabled') ? (0, _position.getBoundingRect)(this._dateTableScrollable.$content().get(0)).width - this.getTimePanelWidth() - width : 0;
    }
  }, {
    key: "_setIndicationUpdateInterval",
    value: function _setIndicationUpdateInterval() {
      if (!this.option('showCurrentTimeIndicator') || this.option('indicatorUpdateInterval') === 0) {
        return;
      }

      this._clearIndicatorUpdateInterval();

      this._indicatorInterval = setInterval(function () {
        this._refreshDateTimeIndication();
      }.bind(this), this.option('indicatorUpdateInterval'));
    }
  }, {
    key: "_clearIndicatorUpdateInterval",
    value: function _clearIndicatorUpdateInterval() {
      if (this._indicatorInterval) {
        clearInterval(this._indicatorInterval);
        delete this._indicatorInterval;
      }
    }
  }, {
    key: "_isVerticalShader",
    value: function _isVerticalShader() {
      return true;
    }
  }, {
    key: "getIndicationWidth",
    value: function getIndicationWidth(groupIndex) {
      var maxWidth = this.getCellWidth() * this._getCellCount();

      var difference = this._getIndicatorDuration();

      if (difference > this._getCellCount()) {
        difference = this._getCellCount();
      }

      var width = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);
      return maxWidth < width ? maxWidth : width;
    }
  }, {
    key: "getIndicatorOffset",
    value: function getIndicatorOffset(groupIndex) {
      var difference = this._getIndicatorDuration() - 1;
      var offset = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);
      return offset;
    }
  }, {
    key: "_getIndicatorDuration",
    value: function _getIndicatorDuration() {
      var today = this._getToday();

      var firstViewDate = new Date(this._firstViewDate);
      var timeDiff = today.getTime() - firstViewDate.getTime();

      if (this.option('type') === 'workWeek') {
        timeDiff = timeDiff - this._getWeekendsCount(Math.round(timeDiff / toMs('day'))) * toMs('day');
      }

      return Math.ceil((timeDiff + 1) / toMs('day'));
    }
  }, {
    key: "getIndicationHeight",
    value: function getIndicationHeight() {
      var today = this._getToday();

      var cellHeight = this.getCellHeight();
      var date = new Date(this._firstViewDate);

      if (this.isIndicationOnView()) {
        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      }

      var duration = today.getTime() - date.getTime();
      var cellCount = duration / this.getCellDuration();
      return cellCount * cellHeight;
    }
  }, {
    key: "_dispose",
    value: function _dispose() {
      this._clearIndicatorUpdateInterval();

      _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_dispose", this).apply(this, arguments);
    }
  }, {
    key: "_refreshDateTimeIndication",
    value: function _refreshDateTimeIndication() {
      this._cleanDateTimeIndicator();

      this._shader && this._shader.clean();

      this._renderDateTimeIndication();
    }
  }, {
    key: "_isCurrentTime",
    value: function _isCurrentTime(date) {
      if (this.isIndicationOnView()) {
        var today = this._getToday();

        var result = false;
        date = new Date(date);
        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
        var startCellDate = new Date(date);
        var endCellDate = new Date(date);

        if (_date.default.sameDate(today, date)) {
          startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration() + 1);
          endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());
          result = _date.default.dateInRange(today, startCellDate, endCellDate);
        }

        return result;
      }
    }
  }, {
    key: "_isCurrentTimeHeaderCell",
    value: function _isCurrentTimeHeaderCell(headerIndex) {
      if (this.isIndicationOnView()) {
        var date = this._getDateByIndex(headerIndex);

        return _date.default.sameDate(date, this._getToday());
      }

      return false;
    }
  }, {
    key: "_getTimeCellClass",
    value: function _getTimeCellClass(i) {
      var startViewDate = this._getTimeCellDate(i);

      var cellClass = _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_getTimeCellClass", this).call(this, i);

      if (this._isCurrentTime(startViewDate)) {
        return cellClass + ' ' + TIME_PANEL_CURRENT_TIME_CELL_CLASS;
      }

      return cellClass;
    }
  }, {
    key: "_getHeaderPanelCellClass",
    value: function _getHeaderPanelCellClass(i) {
      var cellClass = _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_getHeaderPanelCellClass", this).call(this, i);

      if (this._isCurrentTimeHeaderCell(i)) {
        return cellClass + ' ' + HEADER_CURRENT_TIME_CELL_CLASS;
      }

      return cellClass;
    }
  }, {
    key: "_cleanView",
    value: function _cleanView() {
      _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_cleanView", this).call(this);

      this._cleanDateTimeIndicator();
    }
  }, {
    key: "_dimensionChanged",
    value: function _dimensionChanged() {
      _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_dimensionChanged", this).call(this);

      this._refreshDateTimeIndication();
    }
  }, {
    key: "_cleanDateTimeIndicator",
    value: function _cleanDateTimeIndicator() {
      this.$element().find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).remove();
    }
  }, {
    key: "_cleanWorkSpace",
    value: function _cleanWorkSpace() {
      _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_cleanWorkSpace", this).call(this);

      this._renderDateTimeIndication();

      this._setIndicationUpdateInterval();
    }
  }, {
    key: "_optionChanged",
    value: function _optionChanged(args) {
      switch (args.name) {
        case 'showCurrentTimeIndicator':
        case 'indicatorTime':
          this._cleanWorkSpace();

          break;

        case 'indicatorUpdateInterval':
          this._setIndicationUpdateInterval();

          break;

        case 'showAllDayPanel':
          _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_optionChanged", this).call(this, args);

          this._refreshDateTimeIndication();

          break;

        case 'allDayExpanded':
          _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_optionChanged", this).call(this, args);

          this._refreshDateTimeIndication();

          break;

        case 'crossScrollingEnabled':
          _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_optionChanged", this).call(this, args);

          this._refreshDateTimeIndication();

          break;

        case 'shadeUntilCurrentTime':
          this._refreshDateTimeIndication();

          break;

        default:
          _get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_optionChanged", this).call(this, args);

      }
    }
  }, {
    key: "_getDefaultOptions",
    value: function _getDefaultOptions() {
      return (0, _extend.extend)(_get(_getPrototypeOf(SchedulerWorkSpaceIndicator.prototype), "_getDefaultOptions", this).call(this), {
        showCurrentTimeIndicator: true,
        indicatorTime: new Date(),
        indicatorUpdateInterval: 5 * toMs('minute'),
        shadeUntilCurrentTime: true
      });
    }
  }]);

  return SchedulerWorkSpaceIndicator;
}(_uiScheduler.default);

(0, _component_registrator.default)('dxSchedulerWorkSpace', SchedulerWorkSpaceIndicator);
var _default = SchedulerWorkSpaceIndicator;
exports.default = _default;
module.exports = exports.default;