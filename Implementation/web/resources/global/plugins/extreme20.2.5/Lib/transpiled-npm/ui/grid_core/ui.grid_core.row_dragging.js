"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _sortable = _interopRequireDefault(require("../sortable"));

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.utils"));

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND_HANDLE_CLASS = 'dx-command-drag';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var HANDLE_ICON_CLASS = 'drag-icon';
var ROWS_VIEW = 'rowsview';
var SORTABLE_WITHOUT_HANDLE_CLASS = 'dx-sortable-without-handle';
var RowDraggingExtender = {
  init: function init() {
    this.callBase.apply(this, arguments);

    this._updateHandleColumn();
  },
  _allowReordering: function _allowReordering() {
    var rowDragging = this.option('rowDragging');
    return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
  },
  _updateHandleColumn: function _updateHandleColumn() {
    var rowDragging = this.option('rowDragging');

    var allowReordering = this._allowReordering();

    var columnsController = this._columnsController;
    var isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;
    columnsController && columnsController.addCommandColumn({
      type: 'drag',
      command: 'drag',
      visibleIndex: -2,
      alignment: 'center',
      cssClass: COMMAND_HANDLE_CLASS,
      width: 'auto',
      cellTemplate: this._getHandleTemplate(),
      visible: isHandleColumnVisible
    });
    columnsController.columnOption('type:drag', 'visible', isHandleColumnVisible);
  },
  _renderContent: function _renderContent() {
    var _this = this;

    var rowDragging = this.option('rowDragging');

    var allowReordering = this._allowReordering();

    var $content = this.callBase.apply(this, arguments);
    var isFixedTableRendering = this._isFixedTableRendering;
    var sortableName = '_sortable';
    var sortableFixedName = '_sortableFixed';
    var currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
    var anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;

    var togglePointerEventsStyle = function togglePointerEventsStyle(toggle) {
      var _this$sortableFixedNa;

      // T929503
      (_this$sortableFixedNa = _this[sortableFixedName]) === null || _this$sortableFixedNa === void 0 ? void 0 : _this$sortableFixedNa.$element().css('pointerEvents', toggle ? 'auto' : '');
    };

    if (allowReordering && $content.length) {
      this[currentSortableName] = this._createComponent($content, _sortable.default, (0, _extend.extend)({
        component: this.component,
        contentTemplate: null,
        filter: '> table > tbody > .dx-row:not(.dx-freespace-row):not(.dx-virtual-row)',
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && ".".concat(COMMAND_HANDLE_CLASS),
        dropFeedbackMode: 'indicate'
      }, rowDragging, {
        onDragStart: function onDragStart(e) {
          var _rowDragging$onDragSt;

          var row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row && row.data;
          var isDataRow = row && row.rowType === 'data';
          e.cancel = !isDataRow;
          (_rowDragging$onDragSt = rowDragging.onDragStart) === null || _rowDragging$onDragSt === void 0 ? void 0 : _rowDragging$onDragSt.call(rowDragging, e);
        },
        onDragEnter: function onDragEnter() {
          togglePointerEventsStyle(true);
        },
        onDragLeave: function onDragLeave() {
          togglePointerEventsStyle(false);
        },
        onDragEnd: function onDragEnd(e) {
          var _rowDragging$onDragEn;

          togglePointerEventsStyle(false);
          (_rowDragging$onDragEn = rowDragging.onDragEnd) === null || _rowDragging$onDragEn === void 0 ? void 0 : _rowDragging$onDragEn.call(rowDragging, e);
        },
        dropFeedbackMode: _browser.default.msie ? 'indicate' : rowDragging.dropFeedbackMode,
        onOptionChanged: function onOptionChanged(e) {
          var hasFixedSortable = _this[sortableFixedName];

          if (hasFixedSortable) {
            if (e.name === 'fromIndex' || e.name === 'toIndex') {
              _this[anotherSortableName].option(e.name, e.value);
            }
          }
        }
      }));
      $content.toggleClass(SORTABLE_WITHOUT_HANDLE_CLASS, !rowDragging.showDragIcons);
    }

    return $content;
  },
  _resizeCore: function _resizeCore() {
    this.callBase.apply(this, arguments);

    var offset = this._dataController.getRowIndexOffset();

    [this._sortable, this._sortableFixed].forEach(function (sortable) {
      sortable === null || sortable === void 0 ? void 0 : sortable.option('offset', offset);
      sortable === null || sortable === void 0 ? void 0 : sortable.update();
    });
  },
  _getDraggableGridOptions: function _getDraggableGridOptions(options) {
    var gridOptions = this.option();
    var columns = this.getColumns();
    var $rowElement = (0, _renderer.default)(this.getRowElement(options.rowIndex));
    return {
      dataSource: [{
        id: 1,
        parentId: 0
      }],
      showBorders: true,
      showColumnHeaders: false,
      scrolling: {
        useNative: false,
        showScrollbar: false
      },
      pager: {
        visible: false
      },
      loadingTimeout: undefined,
      columnFixing: gridOptions.columnFixing,
      columnAutoWidth: gridOptions.columnAutoWidth,
      showColumnLines: gridOptions.showColumnLines,
      columns: columns.map(function (column) {
        return {
          width: column.width || column.visibleWidth,
          fixed: column.fixed,
          fixedPosition: column.fixedPosition
        };
      }),
      onRowPrepared: function onRowPrepared(e) {
        var rowsView = e.component.getView('rowsView');
        (0, _renderer.default)(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
      }
    };
  },
  _getDraggableRowTemplate: function _getDraggableRowTemplate() {
    var _this2 = this;

    return function (options) {
      var $rootElement = _this2.component.$element();

      var $dataGridContainer = (0, _renderer.default)('<div>').width($rootElement.width());

      var items = _this2._dataController.items();

      var row = items && items[options.fromIndex];

      var gridOptions = _this2._getDraggableGridOptions(row);

      _this2._createComponent($dataGridContainer, _this2.component.NAME, gridOptions);

      $dataGridContainer.find('.dx-gridbase-container').children(":not(.".concat(_this2.addWidgetPrefix(ROWS_VIEW), ")")).hide();
      return $dataGridContainer;
    };
  },
  _getHandleTemplate: function _getHandleTemplate() {
    var _this3 = this;

    return function (container, options) {
      if (options.rowType === 'data') {
        (0, _renderer.default)(container).addClass(CELL_FOCUS_DISABLED_CLASS);
        return (0, _renderer.default)('<span>').addClass(_this3.addWidgetPrefix(HANDLE_ICON_CLASS));
      } else {
        _uiGrid_core.default.setEmptyText((0, _renderer.default)(container));
      }
    };
  },
  optionChanged: function optionChanged(args) {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();

      this._invalidate(true, true);

      args.handled = true;
    }

    this.callBase.apply(this, arguments);
  }
};
var _default = {
  defaultOptions: function defaultOptions() {
    return {
      rowDragging: {
        /**
        * @name GridBaseOptions.rowDragging.showDragIcons
        * @type boolean
        * @default true
        */
        showDragIcons: true,

        /**
         * @name GridBaseOptions.rowDragging.dropFeedbackMode
         * @type Enums.DropFeedbackMode
         * @default "indicate"
         */
        dropFeedbackMode: 'indicate',

        /**
         * @name GridBaseOptions.rowDragging.allowReordering
         * @type boolean
         * @default false
         */
        allowReordering: false,

        /**
         * @name GridBaseOptions.rowDragging.allowDropInsideItem
         * @type boolean
         * @default false
         */
        allowDropInsideItem: false
        /**
         * @name GridBaseOptions.rowDragging.filter
         * @type string
         * @default "> *"
         */

        /**
         * @name GridBaseOptions.rowDragging.dragDirection
         * @type Enums.DragDirection
         * @default "both"
         */

        /**
         * @name GridBaseOptions.rowDragging.boundary
         * @type string|Element|jQuery
         * @default undefined
         */

        /**
         * @name GridBaseOptions.rowDragging.container
         * @type string|Element|jQuery
         * @default undefined
         */

        /**
         * @name GridBaseOptions.rowDragging.dragTemplate
         * @type template|function
         * @type_function_param1 dragInfo:object
         * @type_function_param1_field1 itemData:any
         * @type_function_param1_field2 itemElement:dxElement
         * @type_function_param2 containerElement:dxElement
         * @type_function_return string|Element|jQuery
         * @default undefined
         */

        /**
         * @name GridBaseOptions.rowDragging.handle
         * @type string
         * @default ""
         */

        /**
         * @name GridBaseOptions.rowDragging.autoScroll
         * @type boolean
         * @default true
         */

        /**
         * @name GridBaseOptions.rowDragging.scrollSpeed
         * @type number
         * @default 30
         */

        /**
         * @name GridBaseOptions.rowDragging.scrollSensitivity
         * @type number
         * @default 60
         */

        /**
         * @name GridBaseOptions.rowDragging.group
         * @type string
         * @default undefined
         */

        /**
         * @name GridBaseOptions.rowDragging.data
         * @type any
         * @default undefined
         */

        /**
         * @name GridBaseOptions.rowDragging.cursorOffset
         * @type string|object
         */

        /**
         * @name GridBaseOptions.rowDragging.cursorOffset.x
         * @type number
         * @default 0
         */

        /**
         * @name GridBaseOptions.rowDragging.cursorOffset.y
         * @type number
         * @default 0
         */

        /**
         * @name GridBaseOptions.rowDragging.onDragStart
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 cancel:boolean
         * @type_function_param1_field4 itemData:any
         * @type_function_param1_field5 itemElement:dxElement
         * @type_function_param1_field6 fromIndex:number
         * @type_function_param1_field7 fromData:any
         */

        /**
         * @name GridBaseOptions.rowDragging.onDragMove
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 cancel:boolean
         * @type_function_param1_field4 itemData:any
         * @type_function_param1_field5 itemElement:dxElement
         * @type_function_param1_field6 fromIndex:number
         * @type_function_param1_field7 toIndex:number
         * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
         * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
         * @type_function_param1_field10 fromData:any
         * @type_function_param1_field11 toData:any
         * @type_function_param1_field12 dropInsideItem:boolean
         */

        /**
         * @name GridBaseOptions.rowDragging.onDragEnd
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 cancel:boolean
         * @type_function_param1_field4 itemData:any
         * @type_function_param1_field5 itemElement:dxElement
         * @type_function_param1_field6 fromIndex:number
         * @type_function_param1_field7 toIndex:number
         * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
         * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
         * @type_function_param1_field10 fromData:any
         * @type_function_param1_field11 toData:any
         * @type_function_param1_field12 dropInsideItem:boolean
         */

        /**
         * @name GridBaseOptions.rowDragging.onDragChange
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 cancel:boolean
         * @type_function_param1_field4 itemData:any
         * @type_function_param1_field5 itemElement:dxElement
         * @type_function_param1_field6 fromIndex:number
         * @type_function_param1_field7 toIndex:number
         * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
         * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
         * @type_function_param1_field10 fromData:any
         * @type_function_param1_field11 toData:any
         * @type_function_param1_field12 dropInsideItem:boolean
         */

        /**
         * @name GridBaseOptions.rowDragging.onAdd
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 itemData:any
         * @type_function_param1_field4 itemElement:dxElement
         * @type_function_param1_field5 fromIndex:number
         * @type_function_param1_field6 toIndex:number
         * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
         * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
         * @type_function_param1_field9 fromData:any
         * @type_function_param1_field10 toData:any
         * @type_function_param1_field11 dropInsideItem:boolean
         */

        /**
         * @name GridBaseOptions.rowDragging.onRemove
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 itemData:any
         * @type_function_param1_field4 itemElement:dxElement
         * @type_function_param1_field5 fromIndex:number
         * @type_function_param1_field6 toIndex:number
         * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
         * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
         * @type_function_param1_field9 fromData:any
         * @type_function_param1_field10 toData:any
         */

        /**
         * @name GridBaseOptions.rowDragging.onReorder
         * @type function(e)
         * @type_function_param1 e:object
         * @type_function_param1_field1 component:this
         * @type_function_param1_field2 event:event
         * @type_function_param1_field3 itemData:any
         * @type_function_param1_field4 itemElement:dxElement
         * @type_function_param1_field5 fromIndex:number
         * @type_function_param1_field6 toIndex:number
         * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
         * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
         * @type_function_param1_field9 fromData:any
         * @type_function_param1_field10 toData:any
         * @type_function_param1_field11 dropInsideItem:boolean
         * @type_function_param1_field12 promise:Promise<void>
         */

      }
    };
  },
  extenders: {
    views: {
      rowsView: RowDraggingExtender
    }
  }
};
exports.default = _default;
module.exports = exports.default;