"use strict";

exports.default = void 0;

var _uiSchedulerAppointmentsPositioningStrategy = _interopRequireDefault(require("./ui.scheduler.appointmentsPositioning.strategy.base"));

var _uiSchedulerAppointmentsPositioningStrategy2 = _interopRequireDefault(require("./ui.scheduler.appointmentsPositioning.strategy.adaptive"));

var _extend = require("../../../core/utils/extend");

var _date = _interopRequireDefault(require("../../../core/utils/date"));

var _type = require("../../../core/utils/type");

var _themes = require("../../themes");

var _utils = _interopRequireDefault(require("../utils.timeZone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var toMs = _date.default.dateToMilliseconds;
var APPOINTMENT_MIN_SIZE = 2;
var APPOINTMENT_DEFAULT_HEIGHT = 20;
var COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;
var DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;

var BaseRenderingStrategy = /*#__PURE__*/function () {
  function BaseRenderingStrategy(instance) {
    _classCallCheck(this, BaseRenderingStrategy);

    this.instance = instance;

    this._initPositioningStrategy();
  }

  _createClass(BaseRenderingStrategy, [{
    key: "_isAdaptive",
    value: function _isAdaptive() {
      return this.instance.fire('isAdaptive');
    }
  }, {
    key: "_correctCollectorCoordinatesInAdaptive",
    value: function _correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
      coordinates.top = coordinates.top + this.getCollectorTopOffset(isAllDay);
      coordinates.left = coordinates.left + this.getCollectorLeftOffset();
    }
  }, {
    key: "_initPositioningStrategy",
    value: function _initPositioningStrategy() {
      this._positioningStrategy = this._isAdaptive() ? new _uiSchedulerAppointmentsPositioningStrategy2.default(this) : new _uiSchedulerAppointmentsPositioningStrategy.default(this);
    }
  }, {
    key: "getPositioningStrategy",
    value: function getPositioningStrategy() {
      return this._positioningStrategy;
    }
  }, {
    key: "getAppointmentMinSize",
    value: function getAppointmentMinSize() {
      return APPOINTMENT_MIN_SIZE;
    }
  }, {
    key: "keepAppointmentSettings",
    value: function keepAppointmentSettings() {
      return false;
    }
  }, {
    key: "getDeltaTime",
    value: function getDeltaTime() {}
  }, {
    key: "getAppointmentGeometry",
    value: function getAppointmentGeometry(coordinates) {
      return coordinates;
    }
  }, {
    key: "needCorrectAppointmentDates",
    value: function needCorrectAppointmentDates() {
      return true;
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      return 'horizontal';
    }
  }, {
    key: "createTaskPositionMap",
    value: function createTaskPositionMap(items) {
      delete this._maxAppointmentCountPerCell;
      var length = items && items.length;
      if (!length) return;
      this._defaultWidth = this.instance.fire('getCellWidth');
      this._defaultHeight = this.instance.fire('getCellHeight');
      this._allDayHeight = this.instance._allDayCellHeight;
      var map = [];

      for (var i = 0; i < length; i++) {
        var coordinates = this._getItemPosition(items[i]);

        if (this._isRtl()) {
          coordinates = this._correctRtlCoordinates(coordinates);
        }

        map.push(coordinates);
      }

      var positionArray = this._getSortedPositions(map);

      var resultPositions = this._getResultPositions(positionArray);

      return this._getExtendedPositionMap(map, resultPositions);
    }
  }, {
    key: "_getDeltaWidth",
    value: function _getDeltaWidth(args, initialSize) {
      var intervalWidth = this.instance.fire('getResizableStep') || this.getAppointmentMinSize();
      var initialWidth = initialSize.width;
      return Math.round((args.width - initialWidth) / intervalWidth);
    }
  }, {
    key: "_correctRtlCoordinates",
    value: function _correctRtlCoordinates(coordinates) {
      var width = coordinates[0].width || this._getAppointmentMaxWidth();

      coordinates.forEach(function (coordinate) {
        if (!coordinate.appointmentReduced) {
          coordinate.left -= width;
        }
      });
      return coordinates;
    }
  }, {
    key: "_getAppointmentMaxWidth",
    value: function _getAppointmentMaxWidth() {
      return this.getDefaultCellWidth();
    }
  }, {
    key: "_getItemPosition",
    value: function _getItemPosition(appointment) {
      var adapter = this.instance.createAppointmentAdapter(appointment);

      var position = this._getAppointmentCoordinates(appointment);

      var allDay = this.isAllDay(appointment);
      var startDate = new Date(adapter.startDate);
      var result = [];

      for (var j = 0; j < position.length; j++) {
        var height = this.calculateAppointmentHeight(appointment, position[j]);
        var width = this.calculateAppointmentWidth(appointment, position[j]);
        var resultWidth = width;
        var appointmentReduced = null;
        var multiWeekAppointmentParts = [];
        var initialRowIndex = position[j].rowIndex;
        var initialCellIndex = position[j].cellIndex;

        if (this._needVerifyItemSize() || allDay) {
          var currentMaxAllowedPosition = position[j].hMax;

          if (this.isAppointmentGreaterThan(currentMaxAllowedPosition, {
            left: position[j].left,
            width: width
          })) {
            appointmentReduced = 'head';
            initialRowIndex = position[j].rowIndex;
            initialCellIndex = position[j].cellIndex;
            resultWidth = this._reduceMultiWeekAppointment(width, {
              left: position[j].left,
              right: currentMaxAllowedPosition
            });
            multiWeekAppointmentParts = this._getAppointmentParts({
              sourceAppointmentWidth: width,
              reducedWidth: resultWidth,
              height: height
            }, position[j], startDate);

            if (this._isRtl()) {
              position[j].left = currentMaxAllowedPosition;
            }
          }
        }

        (0, _extend.extend)(position[j], {
          height: height,
          width: resultWidth,
          allDay: allDay,
          rowIndex: initialRowIndex,
          cellIndex: initialCellIndex,
          appointmentReduced: appointmentReduced
        });
        result = this._getAppointmentPartsPosition(multiWeekAppointmentParts, position[j], result);
      }

      return result;
    }
  }, {
    key: "_getAppointmentPartsPosition",
    value: function _getAppointmentPartsPosition(appointmentParts, position, result) {
      if (appointmentParts.length) {
        appointmentParts.unshift(position);
        result = result.concat(appointmentParts);
      } else {
        result.push(position);
      }

      return result;
    }
  }, {
    key: "_getAppointmentCoordinates",
    value: function _getAppointmentCoordinates(appointment) {
      return this.instance.fire('createAppointmentSettings', appointment);
    }
  }, {
    key: "_isRtl",
    value: function _isRtl() {
      return this.instance.option('rtlEnabled');
    }
  }, {
    key: "_getAppointmentParts",
    value: function _getAppointmentParts() {
      return [];
    }
  }, {
    key: "_getCompactAppointmentParts",
    value: function _getCompactAppointmentParts(appointmentWidth) {
      var cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
      return Math.round(appointmentWidth / cellWidth);
    }
  }, {
    key: "_reduceMultiWeekAppointment",
    value: function _reduceMultiWeekAppointment(sourceAppointmentWidth, bound) {
      if (this._isRtl()) {
        sourceAppointmentWidth = Math.floor(bound.left - bound.right);
      } else {
        sourceAppointmentWidth = bound.right - Math.floor(bound.left);
      }

      return sourceAppointmentWidth;
    }
  }, {
    key: "calculateAppointmentHeight",
    value: function calculateAppointmentHeight() {
      return 0;
    }
  }, {
    key: "calculateAppointmentWidth",
    value: function calculateAppointmentWidth() {
      return 0;
    }
  }, {
    key: "isAppointmentGreaterThan",
    value: function isAppointmentGreaterThan(etalon, comparisonParameters) {
      var result = comparisonParameters.left + comparisonParameters.width - etalon;

      if (this._isRtl()) {
        result = etalon + comparisonParameters.width - comparisonParameters.left;
      }

      return result > this.getDefaultCellWidth() / 2;
    }
  }, {
    key: "isAllDay",
    value: function isAllDay() {
      return false;
    }
  }, {
    key: "cropAppointmentWidth",
    value: function cropAppointmentWidth(width, cellWidth) {
      if (this.instance.fire('isGroupedByDate')) {
        width = cellWidth;
      }

      return width;
    }
  }, {
    key: "_getSortedPositions",
    value: function _getSortedPositions(positionList) {
      var _this = this;

      var result = [];

      var round = function round(value) {
        return Math.round(value * 100) / 100;
      };

      var createItem = function createItem(rowIndex, cellIndex, top, left, bottom, right, position, allDay) {
        return {
          i: rowIndex,
          j: cellIndex,
          top: round(top),
          left: round(left),
          bottom: round(bottom),
          right: round(right),
          cellPosition: position,
          allDay: allDay
        };
      };

      for (var rowIndex = 0, rowCount = positionList.length; rowIndex < rowCount; rowIndex++) {
        for (var cellIndex = 0, cellCount = positionList[rowIndex].length; cellIndex < cellCount; cellIndex++) {
          var _positionList$rowInde = positionList[rowIndex][cellIndex],
              top = _positionList$rowInde.top,
              left = _positionList$rowInde.left,
              height = _positionList$rowInde.height,
              width = _positionList$rowInde.width,
              cellPosition = _positionList$rowInde.cellPosition,
              allDay = _positionList$rowInde.allDay;
          result.push(createItem(rowIndex, cellIndex, top, left, top + height, left + width, cellPosition, allDay));
        }
      }

      return result.sort(function (a, b) {
        return _this._sortCondition(a, b);
      });
    }
  }, {
    key: "_sortCondition",
    value: function _sortCondition() {}
  }, {
    key: "_getConditions",
    value: function _getConditions(a, b) {
      var isSomeEdge = this._isSomeEdge(a, b);

      return {
        columnCondition: isSomeEdge || this._normalizeCondition(a.left, b.left),
        rowCondition: isSomeEdge || this._normalizeCondition(a.top, b.top),
        cellPositionCondition: isSomeEdge || this._normalizeCondition(a.cellPosition, b.cellPosition)
      };
    }
  }, {
    key: "_rowCondition",
    value: function _rowCondition(a, b) {
      var conditions = this._getConditions(a, b);

      return conditions.columnCondition || conditions.rowCondition;
    }
  }, {
    key: "_columnCondition",
    value: function _columnCondition(a, b) {
      var conditions = this._getConditions(a, b);

      return conditions.rowCondition || conditions.columnCondition;
    }
  }, {
    key: "_isSomeEdge",
    value: function _isSomeEdge(a, b) {
      return a.i === b.i && a.j === b.j;
    }
  }, {
    key: "_normalizeCondition",
    value: function _normalizeCondition(first, second) {
      // NOTE: ie & ff pixels
      var result = first - second;
      return Math.abs(result) > 1 ? result : 0;
    }
  }, {
    key: "_isItemsCross",
    value: function _isItemsCross(firstItem, secondItem) {
      var areItemsInTheSameTable = !!firstItem.allDay === !!secondItem.allDay;
      var areItemsAllDay = firstItem.allDay && secondItem.allDay;

      if (areItemsInTheSameTable) {
        var orientation = this._getOrientation(areItemsAllDay);

        return this._checkItemsCrossing(firstItem, secondItem, orientation);
      } else {
        return false;
      }
    }
  }, {
    key: "_checkItemsCrossing",
    value: function _checkItemsCrossing(firstItem, secondItem, orientation) {
      var firstItemSide_1 = Math.floor(firstItem[orientation[0]]);
      var firstItemSide_2 = Math.floor(firstItem[orientation[1]]);
      var secondItemSide_1 = Math.ceil(secondItem[orientation[0]]);
      var secondItemSide_2 = Math.ceil(secondItem[orientation[1]]);
      var isItemCross = Math.abs(firstItem[orientation[2]] - secondItem[orientation[2]]) <= 1;
      return isItemCross && (firstItemSide_1 <= secondItemSide_1 && firstItemSide_2 > secondItemSide_1 || firstItemSide_1 < secondItemSide_2 && firstItemSide_2 >= secondItemSide_2 || firstItemSide_1 === secondItemSide_1 && firstItemSide_2 === secondItemSide_2);
    }
  }, {
    key: "_getOrientation",
    value: function _getOrientation(isAllDay) {
      return isAllDay ? ['left', 'right', 'top'] : ['top', 'bottom', 'left'];
    }
  }, {
    key: "_getResultPositions",
    value: function _getResultPositions(sortedArray) {
      var _this2 = this;

      var result = [];
      var i;
      var sortedIndex = 0;
      var currentItem;
      var indexes;
      var itemIndex;
      var maxIndexInStack = 0;
      var stack = {};

      var findFreeIndex = function findFreeIndex(indexes, index) {
        var isFind = indexes.some(function (item) {
          return item === index;
        });

        if (isFind) {
          return findFreeIndex(indexes, ++index);
        } else {
          return index;
        }
      };

      var createItem = function createItem(currentItem, index) {
        var currentIndex = index || 0;
        return {
          index: currentIndex,
          i: currentItem.i,
          j: currentItem.j,
          left: currentItem.left,
          right: currentItem.right,
          top: currentItem.top,
          bottom: currentItem.bottom,
          allDay: currentItem.allDay,
          sortedIndex: _this2._skipSortedIndex(currentIndex) ? null : sortedIndex++
        };
      };

      var startNewStack = function startNewStack(currentItem) {
        stack.items = [createItem(currentItem)];
        stack.left = currentItem.left;
        stack.right = currentItem.right;
        stack.top = currentItem.top;
        stack.bottom = currentItem.bottom;
        stack.allDay = currentItem.allDay;
      };

      var pushItemsInResult = function pushItemsInResult(items) {
        items.forEach(function (item) {
          result.push({
            index: item.index,
            count: maxIndexInStack + 1,
            i: item.i,
            j: item.j,
            sortedIndex: item.sortedIndex
          });
        });
      };

      for (i = 0; i < sortedArray.length; i++) {
        currentItem = sortedArray[i];
        indexes = [];

        if (!stack.items) {
          startNewStack(currentItem);
        } else {
          if (this._isItemsCross(stack, currentItem)) {
            stack.items.forEach(function (item, index) {
              if (_this2._isItemsCross(item, currentItem)) {
                indexes.push(item.index);
              }
            });
            itemIndex = indexes.length ? findFreeIndex(indexes, 0) : 0;
            stack.items.push(createItem(currentItem, itemIndex));
            maxIndexInStack = Math.max(itemIndex, maxIndexInStack);
            stack.left = Math.min(stack.left, currentItem.left);
            stack.right = Math.max(stack.right, currentItem.right);
            stack.top = Math.min(stack.top, currentItem.top);
            stack.bottom = Math.max(stack.bottom, currentItem.bottom);
            stack.allDay = currentItem.allDay;
          } else {
            pushItemsInResult(stack.items);
            stack = {};
            startNewStack(currentItem);
            maxIndexInStack = 0;
          }
        }
      }

      if (stack.items) {
        pushItemsInResult(stack.items);
      }

      return result.sort(function (a, b) {
        var columnCondition = a.j - b.j;
        var rowCondition = a.i - b.i;
        return rowCondition ? rowCondition : columnCondition;
      });
    }
  }, {
    key: "_skipSortedIndex",
    value: function _skipSortedIndex(index) {
      return index > this._getMaxAppointmentCountPerCell() - 1;
    }
  }, {
    key: "_findIndexByKey",
    value: function _findIndexByKey(arr, iKey, jKey, iValue, jValue) {
      var result = 0;

      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i][iKey] === iValue && arr[i][jKey] === jValue) {
          result = i;
          break;
        }
      }

      return result;
    }
  }, {
    key: "_getExtendedPositionMap",
    value: function _getExtendedPositionMap(map, positions) {
      var positionCounter = 0;
      var result = [];

      for (var i = 0, mapLength = map.length; i < mapLength; i++) {
        var resultString = [];

        for (var j = 0, itemLength = map[i].length; j < itemLength; j++) {
          map[i][j].index = positions[positionCounter].index;
          map[i][j].sortedIndex = positions[positionCounter].sortedIndex;
          map[i][j].count = positions[positionCounter++].count;
          resultString.push(map[i][j]);

          this._checkLongCompactAppointment(map[i][j], resultString);
        }

        result.push(resultString);
      }

      return result;
    }
  }, {
    key: "_checkLongCompactAppointment",
    value: function _checkLongCompactAppointment(item, result) {
      this._splitLongCompactAppointment(item, result);

      return result;
    }
  }, {
    key: "_splitLongCompactAppointment",
    value: function _splitLongCompactAppointment(item, result) {
      var appointmentCountPerCell = this._getMaxAppointmentCountPerCellByType(item.allDay);

      var compactCount = 0;

      if (appointmentCountPerCell !== undefined && item.index > appointmentCountPerCell - 1) {
        item.isCompact = true;
        compactCount = this._getCompactAppointmentParts(item.width);

        for (var k = 1; k < compactCount; k++) {
          var compactPart = (0, _extend.extend)(true, {}, item);
          compactPart.left = this._getCompactLeftCoordinate(item.left, k);
          compactPart.cellIndex = compactPart.cellIndex + k;
          compactPart.sortedIndex = null;
          result.push(compactPart);
        }
      }

      return result;
    }
  }, {
    key: "normalizeEndDateByViewEnd",
    value: function normalizeEndDateByViewEnd(appointment, endDate) {
      var result = new Date(endDate.getTime());

      if (!this.isAllDay(appointment)) {
        var viewEndDate = _date.default.roundToHour(this.instance.fire('getEndViewDate'));

        if (result > viewEndDate) {
          result = viewEndDate;
        }
      }

      var endDayHour = this.instance._getCurrentViewOption('endDayHour');

      var allDay = this.instance.fire('getField', 'allDay', appointment);
      var currentViewEndTime = new Date(new Date(endDate.getTime()).setHours(endDayHour, 0, 0, 0));

      if (result.getTime() > currentViewEndTime.getTime() || allDay && result.getHours() < endDayHour) {
        result = currentViewEndTime;
      }

      return result;
    }
  }, {
    key: "_adjustDurationByDaylightDiff",
    value: function _adjustDurationByDaylightDiff(duration, startDate, endDate) {
      var daylightDiff = _utils.default.getDaylightOffset(startDate, endDate);

      return this._needAdjustDuration(daylightDiff) ? this._calculateDurationByDaylightDiff(duration, daylightDiff) : duration;
    }
  }, {
    key: "_needAdjustDuration",
    value: function _needAdjustDuration(diff) {
      return diff !== 0;
    }
  }, {
    key: "_calculateDurationByDaylightDiff",
    value: function _calculateDurationByDaylightDiff(duration, diff) {
      return duration + diff * toMs('minute');
    }
  }, {
    key: "_getAppointmentDurationInMs",
    value: function _getAppointmentDurationInMs(startDate, endDate, allDay) {
      return this.instance.fire('getAppointmentDurationInMs', {
        startDate: startDate,
        endDate: endDate,
        allDay: allDay
      });
    }
  }, {
    key: "_markAppointmentAsVirtual",
    value: function _markAppointmentAsVirtual(coordinates, isAllDay) {
      var countFullWidthAppointmentInCell = this._getMaxAppointmentCountPerCellByType(isAllDay);

      if (coordinates.count - countFullWidthAppointmentInCell > 0) {
        coordinates.virtual = {
          top: coordinates.top,
          left: coordinates.left,
          index: coordinates.appointmentReduced === 'tail' ? coordinates.groupIndex + '-' + coordinates.rowIndex + '-' + coordinates.cellIndex : coordinates.groupIndex + '-' + coordinates.rowIndex + '-' + coordinates.cellIndex + '-tail',
          isAllDay: isAllDay
        };
      }
    }
  }, {
    key: "_getMaxAppointmentCountPerCellByType",
    value: function _getMaxAppointmentCountPerCellByType(isAllDay) {
      var appointmentCountPerCell = this._getMaxAppointmentCountPerCell();

      if ((0, _type.isObject)(appointmentCountPerCell)) {
        return isAllDay ? this._getMaxAppointmentCountPerCell().allDay : this._getMaxAppointmentCountPerCell().simple;
      } else {
        return appointmentCountPerCell;
      }
    }
  }, {
    key: "getDropDownAppointmentWidth",
    value: function getDropDownAppointmentWidth(intervalCount, isAllDay) {
      return this.getPositioningStrategy().getDropDownAppointmentWidth(intervalCount, isAllDay);
    }
  }, {
    key: "getDropDownAppointmentHeight",
    value: function getDropDownAppointmentHeight() {
      return this.getPositioningStrategy().getDropDownAppointmentHeight();
    }
  }, {
    key: "getDropDownButtonAdaptiveSize",
    value: function getDropDownButtonAdaptiveSize() {
      return DROP_DOWN_BUTTON_ADAPTIVE_SIZE;
    }
  }, {
    key: "getDefaultCellWidth",
    value: function getDefaultCellWidth() {
      return this._defaultWidth;
    }
  }, {
    key: "getDefaultCellHeight",
    value: function getDefaultCellHeight() {
      return this._defaultHeight;
    }
  }, {
    key: "getDefaultAllDayCellHeight",
    value: function getDefaultAllDayCellHeight() {
      return this._allDayHeight;
    }
  }, {
    key: "getCollectorTopOffset",
    value: function getCollectorTopOffset(allDay) {
      return this.getPositioningStrategy().getCollectorTopOffset(allDay);
    }
  }, {
    key: "getCollectorLeftOffset",
    value: function getCollectorLeftOffset() {
      return this.getPositioningStrategy().getCollectorLeftOffset();
    }
  }, {
    key: "getAppointmentDataCalculator",
    value: function getAppointmentDataCalculator() {}
  }, {
    key: "_customizeCoordinates",
    value: function _customizeCoordinates(coordinates, height, appointmentCountPerCell, topOffset, isAllDay) {
      var index = coordinates.index;
      var appointmentHeight = height / appointmentCountPerCell;
      var appointmentTop = coordinates.top + index * appointmentHeight;
      var top = appointmentTop + topOffset;
      var width = coordinates.width;
      var left = coordinates.left;

      if (coordinates.isCompact) {
        this._isAdaptive() && this._correctCollectorCoordinatesInAdaptive(coordinates, isAllDay);

        this._markAppointmentAsVirtual(coordinates, isAllDay);
      }

      return {
        height: appointmentHeight,
        width: width,
        top: top,
        left: left,
        empty: this._isAppointmentEmpty(height, width)
      };
    }
  }, {
    key: "_isAppointmentEmpty",
    value: function _isAppointmentEmpty(height, width) {
      return height < this._getAppointmentMinHeight() || width < this._getAppointmentMinWidth();
    }
  }, {
    key: "_calculateGeometryConfig",
    value: function _calculateGeometryConfig(coordinates) {
      var overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');

      var offsets = this._getOffsets();

      var appointmentDefaultOffset = this._getAppointmentDefaultOffset();

      var appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);

      var ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);

      var maxHeight = this._getMaxHeight();

      if (!(0, _type.isNumeric)(appointmentCountPerCell)) {
        appointmentCountPerCell = coordinates.count;
        ratio = (maxHeight - offsets.unlimited) / maxHeight;
      }

      var topOffset = (1 - ratio) * maxHeight;

      if (overlappingMode === 'auto' || (0, _type.isNumeric)(overlappingMode)) {
        ratio = 1;
        maxHeight = maxHeight - appointmentDefaultOffset;
        topOffset = appointmentDefaultOffset;
      }

      return {
        height: ratio * maxHeight,
        appointmentCountPerCell: appointmentCountPerCell,
        offset: topOffset
      };
    }
  }, {
    key: "_getAppointmentCount",
    value: function _getAppointmentCount() {}
  }, {
    key: "_getDefaultRatio",
    value: function _getDefaultRatio() {}
  }, {
    key: "_getOffsets",
    value: function _getOffsets() {}
  }, {
    key: "_getMaxHeight",
    value: function _getMaxHeight() {}
  }, {
    key: "_needVerifyItemSize",
    value: function _needVerifyItemSize() {
      return false;
    }
  }, {
    key: "needSeparateAppointment",
    value: function needSeparateAppointment(allDay) {
      return this.instance.fire('isGroupedByDate') && allDay;
    }
  }, {
    key: "_getMaxAppointmentCountPerCell",
    value: function _getMaxAppointmentCountPerCell() {
      if (!this._maxAppointmentCountPerCell) {
        var overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');
        var appointmentCountPerCell;

        if ((0, _type.isNumeric)(overlappingMode)) {
          appointmentCountPerCell = overlappingMode;
        }

        if (overlappingMode === 'auto') {
          appointmentCountPerCell = this._getDynamicAppointmentCountPerCell();
        }

        if (overlappingMode === 'unlimited') {
          appointmentCountPerCell = undefined;
        }

        this._maxAppointmentCountPerCell = appointmentCountPerCell;
      }

      return this._maxAppointmentCountPerCell;
    }
  }, {
    key: "_getDynamicAppointmentCountPerCell",
    value: function _getDynamicAppointmentCountPerCell() {
      return this.getPositioningStrategy().getDynamicAppointmentCountPerCell();
    }
  }, {
    key: "hasAllDayAppointments",
    value: function hasAllDayAppointments() {
      return false;
    }
  }, {
    key: "_isCompactTheme",
    value: function _isCompactTheme() {
      return ((0, _themes.current)() || '').split('.').pop() === 'compact';
    }
  }, {
    key: "_getAppointmentDefaultOffset",
    value: function _getAppointmentDefaultOffset() {
      return this.getPositioningStrategy().getAppointmentDefaultOffset();
    }
  }, {
    key: "_getAppointmentDefaultHeight",
    value: function _getAppointmentDefaultHeight() {
      return this._getAppointmentHeightByTheme();
    }
  }, {
    key: "_getAppointmentMinHeight",
    value: function _getAppointmentMinHeight() {
      return this._getAppointmentDefaultHeight();
    }
  }, {
    key: "_getAppointmentHeightByTheme",
    value: function _getAppointmentHeightByTheme() {
      return this._isCompactTheme() ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT : APPOINTMENT_DEFAULT_HEIGHT;
    }
  }, {
    key: "_getAppointmentDefaultWidth",
    value: function _getAppointmentDefaultWidth() {
      return this.getPositioningStrategy()._getAppointmentDefaultWidth();
    }
  }, {
    key: "_getAppointmentMinWidth",
    value: function _getAppointmentMinWidth() {
      return this._getAppointmentDefaultWidth();
    }
  }, {
    key: "_needVerticalGroupBounds",
    value: function _needVerticalGroupBounds() {
      return false;
    }
  }, {
    key: "_needHorizontalGroupBounds",
    value: function _needHorizontalGroupBounds() {
      return false;
    }
  }, {
    key: "isVirtualScrolling",
    get: function get() {
      return this.instance.fire('isVirtualScrolling');
    }
  }]);

  return BaseRenderingStrategy;
}();

var _default = BaseRenderingStrategy;
exports.default = _default;
module.exports = exports.default;