"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));

var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));

var _window = require("../../../core/utils/window");

var _index = require("../../../events/utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ROW_HEIGHT = 50;
var CELL_WIDTH = 150;
var MIN_SCROLL_OFFSET = 10;
var VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 15;
var DOCUMENT_SCROLL_EVENT_NAMESPACE = (0, _index.addNamespace)('scroll', 'dxSchedulerVirtualScrolling');
var scrollingTypes = {
  vertical: 'vertical',
  horizontal: 'horizontal',
  both: 'both'
};
var DefaultScrollingType = scrollingTypes.vertical;

var VirtualScrollingDispatcher = /*#__PURE__*/function () {
  function VirtualScrollingDispatcher(workspace) {
    _classCallCheck(this, VirtualScrollingDispatcher);

    this._workspace = workspace;
    this._rowHeight = ROW_HEIGHT;
    this._cellWidth = CELL_WIDTH;
    this._renderer = new Renderer(this.workspace);

    this._createVirtualScrolling();

    this._attachScrollableEvents();
  }

  _createClass(VirtualScrollingDispatcher, [{
    key: "calculateCoordinatesByDataAndPosition",
    value: function calculateCoordinatesByDataAndPosition(cellData, position, date) {
      var workSpace = this._workspace;
      var rowIndex = position.rowIndex,
          columnIndex = position.columnIndex;
      var startDate = cellData.startDate,
          endDate = cellData.endDate,
          allDay = cellData.allDay;
      var timeToScroll = date.getTime();
      var cellStartTime = startDate.getTime();
      var cellEndTime = endDate.getTime();
      var scrollInCell = allDay ? 0 : (timeToScroll - cellStartTime) / (cellEndTime - cellStartTime);
      var cellWidth = workSpace.getCellWidth();
      var top = (rowIndex + scrollInCell) * this.rowHeight;
      var left = cellWidth * columnIndex;

      if (workSpace.option('rtlEnabled')) {
        left = workSpace.getScrollableOuterWidth() - left;
      }

      return {
        top: top,
        left: left
      };
    }
  }, {
    key: "dispose",
    value: function dispose() {
      if (this._onScrollHandler) {
        _events_engine.default.off(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
      }
    }
  }, {
    key: "_createVirtualScrolling",
    value: function _createVirtualScrolling() {
      if (this.verticalScrollingAllowed) {
        this.verticalVirtualScrolling = new VerticalVirtualScrolling({
          workspace: this.workspace,
          viewportHeight: this.viewportHeight,
          rowHeight: this.rowHeight
        });
      }

      if (this.horizontalScrollingAllowed) {
        this.horizontalVirtualScrolling = new HorizontalVirtualScrolling({
          workspace: this.workspace,
          viewportWidth: this.viewportWidth,
          cellWidth: this.cellWidth
        });
      }
    }
  }, {
    key: "_attachScrollableEvents",
    value: function _attachScrollableEvents() {
      if (this.height || this.width) {
        this._attachScrollableScroll();
      }

      if (!this.height || !this.width) {
        this._attachWindowScroll();
      }
    }
  }, {
    key: "_attachScrollableScroll",
    value: function _attachScrollableScroll() {
      var _this = this;

      var scrollable = this.workspace.getScrollable();
      var currentOnScroll = scrollable.option('onScroll');
      scrollable.option('onScroll', function (e) {
        currentOnScroll === null || currentOnScroll === void 0 ? void 0 : currentOnScroll.apply(scrollable, [e]);

        _this._process(e === null || e === void 0 ? void 0 : e.scrollOffset);
      });
    }
  }, {
    key: "_attachWindowScroll",
    value: function _attachWindowScroll() {
      var _this2 = this;

      var window = (0, _window.getWindow)();
      this._onScrollHandler = this.workspace._createAction(function () {
        var scrollX = window.scrollX,
            scrollY = window.scrollY;

        if (scrollX >= _this2.minScrollOffset || scrollY >= _this2.minScrollOffset) {
          _this2._process({
            left: scrollX,
            top: scrollY
          });
        }
      });

      _events_engine.default.on(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
    }
  }, {
    key: "_process",
    value: function _process(scrollPosition) {
      if (scrollPosition) {
        var _this$verticalVirtual, _this$horizontalVirtu;

        var left = scrollPosition.left,
            top = scrollPosition.top;
        (_this$verticalVirtual = this.verticalVirtualScrolling) === null || _this$verticalVirtual === void 0 ? void 0 : _this$verticalVirtual.updateState(top);
        (_this$horizontalVirtu = this.horizontalVirtualScrolling) === null || _this$horizontalVirtu === void 0 ? void 0 : _this$horizontalVirtu.updateState(left);
        this.renderer.updateRender();
      }
    }
  }, {
    key: "updateDimensions",
    value: function updateDimensions() {
      var cellHeight = this.workspace.getCellHeight(false);
      var cellWidth = this.workspace.getCellWidth();
      var needUpdate = cellHeight !== this.rowHeight || cellWidth !== this.cellWidth;

      if (needUpdate) {
        this.rowHeight = cellHeight;
        this.cellWidth = cellWidth;

        this._createVirtualScrolling();

        this.renderer._renderDateTable();
      }
    }
  }, {
    key: "workspace",
    get: function get() {
      return this._workspace;
    }
  }, {
    key: "renderer",
    get: function get() {
      return this._renderer;
    }
  }, {
    key: "isVirtualScrolling",
    get: function get() {
      return this.workspace.isVirtualScrolling();
    }
  }, {
    key: "minScrollOffset",
    get: function get() {
      return MIN_SCROLL_OFFSET;
    }
  }, {
    key: "verticalVirtualScrolling",
    get: function get() {
      return this._verticalVirtualScrolling;
    },
    set: function set(value) {
      this._verticalVirtualScrolling = value;
    }
  }, {
    key: "horizontalVirtualScrolling",
    get: function get() {
      return this._horizontalVirtualScrolling;
    },
    set: function set(value) {
      this._horizontalVirtualScrolling = value;
    }
  }, {
    key: "document",
    get: function get() {
      return _dom_adapter.default.getDocument();
    }
  }, {
    key: "height",
    get: function get() {
      return this.workspace.invoke('getOption', 'height');
    }
  }, {
    key: "width",
    get: function get() {
      return this.workspace.invoke('getOption', 'width');
    }
  }, {
    key: "rowHeight",
    get: function get() {
      return this._rowHeight;
    },
    set: function set(value) {
      this._rowHeight = value;
    }
  }, {
    key: "viewportHeight",
    get: function get() {
      return this.height ? this.workspace.$element().height() : (0, _window.getWindow)().innerHeight;
    }
  }, {
    key: "cellWidth",
    get: function get() {
      return this._cellWidth;
    },
    set: function set(value) {
      this._cellWidth = value;
    }
  }, {
    key: "viewportWidth",
    get: function get() {
      return this.width ? this.workspace.$element().width() : (0, _window.getWindow)().innerWidth;
    }
  }, {
    key: "topVirtualRowsCount",
    get: function get() {
      return this.verticalScrollingState.virtualItemCountBefore > 0 ? 1 : 0;
    }
  }, {
    key: "scrollingState",
    get: function get() {
      var _this$verticalVirtual2, _this$horizontalVirtu2;

      return {
        vertical: (_this$verticalVirtual2 = this.verticalVirtualScrolling) === null || _this$verticalVirtual2 === void 0 ? void 0 : _this$verticalVirtual2.state,
        horizontal: (_this$horizontalVirtu2 = this.horizontalVirtualScrolling) === null || _this$horizontalVirtu2 === void 0 ? void 0 : _this$horizontalVirtu2.state
      };
    }
  }, {
    key: "verticalScrollingState",
    get: function get() {
      return this.scrollingState.vertical;
    }
  }, {
    key: "horizontalScrollingState",
    get: function get() {
      return this.scrollingState.horizontal;
    }
  }, {
    key: "renderState",
    get: function get() {
      var _this$verticalVirtual3, _this$horizontalVirtu3;

      var verticalRenderState = ((_this$verticalVirtual3 = this.verticalVirtualScrolling) === null || _this$verticalVirtual3 === void 0 ? void 0 : _this$verticalVirtual3.getRenderState()) || {};
      var horizontalRenderState = ((_this$horizontalVirtu3 = this.horizontalVirtualScrolling) === null || _this$horizontalVirtu3 === void 0 ? void 0 : _this$horizontalVirtu3.getRenderState()) || {};
      return _objectSpread(_objectSpread({}, verticalRenderState), horizontalRenderState);
    }
  }, {
    key: "scrollingType",
    get: function get() {
      return this.workspace.option('scrolling.type') || DefaultScrollingType;
    }
  }, {
    key: "verticalScrollingAllowed",
    get: function get() {
      return this.scrollingType === scrollingTypes.vertical || this.scrollingType === scrollingTypes.both;
    }
  }, {
    key: "horizontalScrollingAllowed",
    get: function get() {
      return this.scrollingType === scrollingTypes.horizontal || this.scrollingType === scrollingTypes.both;
    }
  }]);

  return VirtualScrollingDispatcher;
}();

exports.default = VirtualScrollingDispatcher;

var VirtualScrollingBase = /*#__PURE__*/function () {
  function VirtualScrollingBase(options) {
    _classCallCheck(this, VirtualScrollingBase);

    this._workspace = options.workspace;
    this._state = this.defaultState;
    this._viewportSize = options.viewportSize;
    this._itemSize = options.itemSize;
    this.updateState(0);
  }

  _createClass(VirtualScrollingBase, [{
    key: "needUpdateState",
    value: function needUpdateState(position) {
      var _this$state = this.state,
          prevPosition = _this$state.prevPosition,
          startIndex = _this$state.startIndex;
      var isFirstInitialization = startIndex < 0;

      if (!isFirstInitialization && (position === 0 || position === this.maxScrollPosition)) {
        return true;
      }

      var currentPosition = prevPosition;
      var currentItemsCount = Math.floor(currentPosition / this.itemSize);
      var itemsCount = Math.floor(position / this.itemSize);
      var isStartIndexChanged = Math.abs(currentItemsCount - itemsCount) >= this.outlineCount;
      return isFirstInitialization || isStartIndexChanged;
    }
  }, {
    key: "_correctPosition",
    value: function _correctPosition(position) {
      if (position < 0) {
        return 0;
      }

      return Math.min(position, this.maxScrollPosition);
    }
  }, {
    key: "updateState",
    value: function updateState(position) {
      position = this._correctPosition(position);

      if (!this.needUpdateState(position)) {
        return false;
      }

      var itemsInfoBefore = this._calcItemInfoBefore(position);

      var itemsDeltaBefore = this._calcItemDeltaBefore(itemsInfoBefore);

      var _this$_calcItemInfoAf = this._calcItemInfoAfter(itemsDeltaBefore),
          outlineCountAfter = _this$_calcItemInfoAf.outlineCountAfter,
          virtualItemCountAfter = _this$_calcItemInfoAf.virtualItemCountAfter,
          itemCountWithAfter = _this$_calcItemInfoAf.itemCountWithAfter;

      var virtualItemCountBefore = itemsInfoBefore.virtualItemCountBefore,
          outlineCountBefore = itemsInfoBefore.outlineCountBefore;
      var itemCount = outlineCountBefore + itemCountWithAfter + outlineCountAfter;
      var itemCountAfter = Math.floor(position / this.itemSize);
      this.state.prevPosition = itemCountAfter * this.itemSize;
      this.state.startIndex = itemCountAfter - outlineCountBefore;
      this.state.virtualItemCountBefore = virtualItemCountBefore;
      this.state.outlineCountBefore = outlineCountBefore;
      this.state.itemCount = itemCount;
      this.state.outlineCountAfter = outlineCountAfter;
      this.state.virtualItemCountAfter = virtualItemCountAfter;

      this._updateStateCore();

      return true;
    }
  }, {
    key: "_calcItemInfoBefore",
    value: function _calcItemInfoBefore(position) {
      var virtualItemCountBefore = Math.floor(position / this.itemSize);
      var outlineCountBefore = Math.min(virtualItemCountBefore, this.outlineCount);
      virtualItemCountBefore -= outlineCountBefore;
      return {
        virtualItemCountBefore: virtualItemCountBefore,
        outlineCountBefore: outlineCountBefore
      };
    }
  }, {
    key: "_calcItemDeltaBefore",
    value: function _calcItemDeltaBefore(itemInfoBefore) {
      var virtualItemCountBefore = itemInfoBefore.virtualItemCountBefore,
          outlineCountBefore = itemInfoBefore.outlineCountBefore;
      var totalItemCount = this.getTotalItemCount();
      return totalItemCount - virtualItemCountBefore - outlineCountBefore;
    }
  }, {
    key: "getTotalItemCount",
    value: function getTotalItemCount() {
      throw 'getTotalItemCount method should be implemented';
    }
  }, {
    key: "getRenderState",
    value: function getRenderState() {
      throw 'getRenderState method should be implemented';
    }
  }, {
    key: "_calcItemInfoAfter",
    value: function _calcItemInfoAfter(itemsDeltaBefore) {
      var itemCountWithAfter = itemsDeltaBefore >= this.pageSize ? this.pageSize : itemsDeltaBefore;
      var virtualItemCountAfter = itemsDeltaBefore - itemCountWithAfter;
      var outlineCountAfter = virtualItemCountAfter > 0 ? Math.min(virtualItemCountAfter, this.outlineCount) : 0;

      if (virtualItemCountAfter > 0) {
        virtualItemCountAfter -= outlineCountAfter;
      }

      return {
        virtualItemCountAfter: virtualItemCountAfter,
        outlineCountAfter: outlineCountAfter,
        itemCountWithAfter: itemCountWithAfter
      };
    }
  }, {
    key: "_updateStateCore",
    value: function _updateStateCore() {
      var state = this.state;
      var virtualItemCountBefore = state.virtualItemCountBefore;
      var virtualItemCountAfter = state.virtualItemCountAfter;
      var outlineCountBefore = state.outlineCountBefore;
      var outlineCountAfter = state.outlineCountAfter;
      var prevVirtualItemSizeBefore = state.virtualItemSizeBefore;
      var prevVirtualItemSizeAfter = state.virtualItemSizeAfter;
      var prevOutlineSizeBefore = state.outlineSizeBefore;
      var prevOutlineSizeAfter = state.outlineSizeAfter;
      var virtualItemSizeBefore = this.itemSize * virtualItemCountBefore;
      var virtualItemSizeAfter = this.itemSize * virtualItemCountAfter;
      var outlineSizeBefore = this.itemSize * outlineCountBefore;
      var outlineSizeAfter = this.itemSize * outlineCountAfter;
      var prevVirtualSizeBefore = prevVirtualItemSizeBefore + prevOutlineSizeBefore;
      var virtualSizeBefore = virtualItemSizeBefore + outlineSizeBefore;
      var prevVirtualSizeAfter = prevVirtualItemSizeAfter + prevOutlineSizeAfter;
      var virtualSizeAfter = virtualItemSizeAfter + outlineSizeAfter;
      var isAppend = prevVirtualSizeBefore < virtualSizeBefore;
      var isPrepend = prevVirtualSizeAfter < virtualSizeAfter;
      var needAddItems = isAppend || isPrepend;

      if (needAddItems) {
        state.virtualItemSizeBefore = virtualItemSizeBefore;
        state.virtualItemSizeAfter = virtualItemSizeAfter;
      }
    }
  }, {
    key: "viewportSize",
    get: function get() {
      return this._viewportSize;
    }
  }, {
    key: "itemSize",
    get: function get() {
      return this._itemSize;
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    },
    set: function set(value) {
      this._state = value;
    }
  }, {
    key: "startIndex",
    get: function get() {
      return this.state.startIndex;
    }
  }, {
    key: "pageSize",
    get: function get() {
      return Math.ceil(this.viewportSize / this.itemSize);
    }
  }, {
    key: "outlineCount",
    get: function get() {
      return Math.floor(this.pageSize / 2);
    }
  }, {
    key: "workspace",
    get: function get() {
      return this._workspace;
    }
  }, {
    key: "groupCount",
    get: function get() {
      return this.workspace._getGroupCount();
    }
  }, {
    key: "isVerticalGrouping",
    get: function get() {
      return this.workspace._isVerticalGroupedWorkSpace();
    }
  }, {
    key: "defaultState",
    get: function get() {
      return {
        prevPosition: 0,
        startIndex: -1,
        itemCount: 0,
        virtualItemCountBefore: 0,
        virtualItemCountAfter: 0,
        outlineCountBefore: 0,
        outlineCountAfter: 0,
        virtualItemSizeBefore: 0,
        virtualItemSizeAfter: 0,
        outlineSizeBefore: 0,
        outlineSizeAfter: 0
      };
    }
  }, {
    key: "maxScrollPosition",
    get: function get() {
      return this.getTotalItemCount() * this.itemSize - this.viewportSize;
    }
  }]);

  return VirtualScrollingBase;
}();

var VerticalVirtualScrolling = /*#__PURE__*/function (_VirtualScrollingBase) {
  _inherits(VerticalVirtualScrolling, _VirtualScrollingBase);

  var _super = _createSuper(VerticalVirtualScrolling);

  function VerticalVirtualScrolling(options) {
    _classCallCheck(this, VerticalVirtualScrolling);

    return _super.call(this, {
      workspace: options.workspace,
      viewportSize: options.viewportHeight,
      itemSize: options.rowHeight
    });
  }

  _createClass(VerticalVirtualScrolling, [{
    key: "getTotalItemCount",
    value: function getTotalItemCount() {
      return this.workspace._getTotalRowCount(this.groupCount, this.isVerticalGrouping);
    }
  }, {
    key: "getRenderState",
    value: function getRenderState() {
      return {
        topVirtualRowHeight: this.state.virtualItemSizeBefore,
        bottomVirtualRowHeight: this.state.virtualItemSizeAfter,
        startRowIndex: this.state.startIndex,
        rowCount: this.state.itemCount,
        startIndex: this.state.startIndex
      };
    }
  }, {
    key: "prevTopPosition",
    get: function get() {
      return this.state.prevPosition;
    }
  }, {
    key: "rowCount",
    get: function get() {
      return this.state.itemCount;
    }
  }, {
    key: "topVirtualRowCount",
    get: function get() {
      return this.state.virtualItemCountBefore;
    }
  }, {
    key: "bottomVirtualRowCount",
    get: function get() {
      return this.state.virtualItemCountAfter;
    }
  }]);

  return VerticalVirtualScrolling;
}(VirtualScrollingBase);

var HorizontalVirtualScrolling = /*#__PURE__*/function (_VirtualScrollingBase2) {
  _inherits(HorizontalVirtualScrolling, _VirtualScrollingBase2);

  var _super2 = _createSuper(HorizontalVirtualScrolling);

  function HorizontalVirtualScrolling(options) {
    _classCallCheck(this, HorizontalVirtualScrolling);

    return _super2.call(this, {
      workspace: options.workspace,
      viewportSize: options.viewportWidth,
      itemSize: options.cellWidth
    });
  }

  _createClass(HorizontalVirtualScrolling, [{
    key: "getTotalItemCount",
    value: function getTotalItemCount() {
      return this.workspace._getTotalCellCount(this.groupCount, this.isVerticalGrouping);
    }
  }, {
    key: "getRenderState",
    value: function getRenderState() {
      return {
        leftVirtualCellWidth: this.state.virtualItemSizeBefore,
        rightVirtualCellWidth: this.state.virtualItemSizeAfter,
        startCellIndex: this.state.startIndex,
        cellCount: this.state.itemCount,
        cellWidth: this.state.itemSize
      };
    }
  }]);

  return HorizontalVirtualScrolling;
}(VirtualScrollingBase);

var Renderer = /*#__PURE__*/function () {
  function Renderer(workspace) {
    _classCallCheck(this, Renderer);

    this._workspace = workspace;
    this._renderAppointmentTimeout = null;
  }

  _createClass(Renderer, [{
    key: "getRenderTimeout",
    value: function getRenderTimeout() {
      return VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT;
    }
  }, {
    key: "updateRender",
    value: function updateRender() {
      this._renderDateTable();

      this._renderAppointments();
    }
  }, {
    key: "_renderDateTable",
    value: function _renderDateTable() {
      this.workspace.renderRWorkspace(false);
    }
  }, {
    key: "_renderAppointments",
    value: function _renderAppointments() {
      var _this3 = this;

      var renderTimeout = this.getRenderTimeout();

      if (renderTimeout >= 0) {
        clearTimeout(this._renderAppointmentTimeout);
        this._renderAppointmentTimeout = setTimeout(function () {
          return _this3.workspace.updateAppointments();
        }, renderTimeout);
      } else {
        this.workspace.updateAppointments();
      }
    }
  }, {
    key: "workspace",
    get: function get() {
      return this._workspace;
    }
  }]);

  return Renderer;
}();

module.exports = exports.default;