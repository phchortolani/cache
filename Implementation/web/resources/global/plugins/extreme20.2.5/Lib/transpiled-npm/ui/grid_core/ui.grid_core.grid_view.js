"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _uiGrid_core = _interopRequireDefault(require("./ui.grid_core.modules"));

var _common = require("../../core/utils/common");

var _window = require("../../core/utils/window");

var _iterator = require("../../core/utils/iterator");

var _type = require("../../core/utils/type");

var _position = require("../../core/utils/position");

var _uiGrid_core2 = _interopRequireDefault(require("./ui.grid_core.utils"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _deferred = require("../../core/utils/deferred");

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

var accessibility = _interopRequireWildcard(require("../shared/accessibility"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABLE_CLASS = 'table';
var BORDERS_CLASS = 'borders';
var TABLE_FIXED_CLASS = 'table-fixed';
var IMPORTANT_MARGIN_CLASS = 'important-margin';
var TEXT_CONTENT_CLASS = 'text-content';
var HIDDEN_CLASS = 'dx-hidden';
var GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
var HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
var EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
var VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];

var isPercentWidth = function isPercentWidth(width) {
  return (0, _type.isString)(width) && width.slice(-1) === '%';
};

var isPixelWidth = function isPixelWidth(width) {
  return (0, _type.isString)(width) && width.slice(-2) === 'px';
};

var mergeArraysByMaxValue = function mergeArraysByMaxValue(values1, values2) {
  var result = [];

  if (values1 && values2 && values1.length && values1.length === values2.length) {
    for (var i = 0; i < values1.length; i++) {
      result.push(values1[i] > values2[i] ? values1[i] : values2[i]);
    }
  } else if (values1 && values1.length) {
    result = values1;
  } else if (values2) {
    result = values2;
  }

  return result;
};

var getContainerHeight = function getContainerHeight($container) {
  var clientHeight = $container.get(0).clientHeight;
  var paddingTop = parseFloat($container.css('paddingTop'));
  var paddingBottom = parseFloat($container.css('paddingBottom'));
  return clientHeight - paddingTop - paddingBottom;
};

var calculateFreeWidth = function calculateFreeWidth(that, widths) {
  var contentWidth = that._rowsView.contentWidth();

  var totalWidth = that._getTotalWidth(widths, contentWidth);

  return contentWidth - totalWidth;
};

var calculateFreeWidthWithCurrentMinWidth = function calculateFreeWidthWithCurrentMinWidth(that, columnIndex, currentMinWidth, widths) {
  return calculateFreeWidth(that, widths.map(function (width, index) {
    return index === columnIndex ? currentMinWidth : width;
  }));
};

var restoreFocus = function restoreFocus(focusedElement, selectionRange) {
  accessibility.hiddenFocus(focusedElement);

  _uiGrid_core2.default.setSelectionRange(focusedElement, selectionRange);
};

var ResizingController = _uiGrid_core.default.ViewController.inherit({
  _initPostRenderHandlers: function _initPostRenderHandlers() {
    var that = this;
    var dataController = that._dataController;

    if (!that._refreshSizesHandler) {
      that._refreshSizesHandler = function (e) {
        dataController.changed.remove(that._refreshSizesHandler);
        var resizeDeferred;
        var changeType = e && e.changeType;
        var isDelayed = e && e.isDelayed;
        var items = dataController.items();

        if (!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
          if (!isDelayed) {
            resizeDeferred = that.resize();
          }
        } else if (changeType === 'update' && e.changeTypes) {
          if ((items.length > 1 || e.changeTypes[0] !== 'insert') && !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
            (0, _common.deferUpdate)(function () {
              that._rowsView.resize();
            });
          } else {
            resizeDeferred = that.resize();
          }
        }

        if (changeType && changeType !== 'updateSelection' && changeType !== 'updateFocusedRow' && !isDelayed) {
          (0, _deferred.when)(resizeDeferred).done(function () {
            that._setAriaRowColCount();

            that.fireContentReadyAction();
          });
        }
      }; // TODO remove resubscribing


      that._dataController.changed.add(function () {
        that._dataController.changed.add(that._refreshSizesHandler);
      });
    }
  },
  fireContentReadyAction: function fireContentReadyAction() {
    this.component._fireContentReadyAction();
  },
  _setAriaRowColCount: function _setAriaRowColCount() {
    var component = this.component;
    component.setAria({
      'rowCount': this._dataController.totalItemsCount(),
      'colCount': component.columnCount()
    }, component.$element().children('.' + GRIDBASE_CONTAINER_CLASS));
  },
  _getBestFitWidths: function _getBestFitWidths() {
    if (!this.option('legacyRendering')) {
      return this._rowsView.getColumnWidths();
    }

    var rowsColumnWidths = this._rowsView.getColumnWidths();

    var headerColumnWidths = this._columnHeadersView && this._columnHeadersView.getColumnWidths();

    var footerColumnWidths = this._footerView && this._footerView.getColumnWidths();

    var resultWidths = mergeArraysByMaxValue(rowsColumnWidths, headerColumnWidths);
    resultWidths = mergeArraysByMaxValue(resultWidths, footerColumnWidths);
    return resultWidths;
  },
  _setVisibleWidths: function _setVisibleWidths(visibleColumns, widths) {
    var columnsController = this._columnsController;
    columnsController.beginUpdate();
    (0, _iterator.each)(visibleColumns, function (index, column) {
      var columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  },
  _toggleBestFitModeForView: function _toggleBestFitModeForView(view, className, isBestFit) {
    var _this = this;

    if (!view || !view.isVisible()) return;

    var $rowsTables = this._rowsView.getTableElements();

    var $viewTables = view.getTableElements();
    (0, _iterator.each)($rowsTables, function (index, tableElement) {
      var $tableBody;
      var $rowsTable = (0, _renderer.default)(tableElement);
      var $viewTable = $viewTables.eq(index);

      if ($viewTable && $viewTable.length) {
        if (isBestFit) {
          $tableBody = $viewTable.children('tbody').appendTo($rowsTable);
        } else {
          $tableBody = $rowsTable.children('.' + className).appendTo($viewTable);
        }

        $tableBody.toggleClass(className, isBestFit);
        $tableBody.toggleClass(_this.addWidgetPrefix('best-fit'), isBestFit);
      }
    });
  },
  _toggleBestFitMode: function _toggleBestFitMode(isBestFit) {
    var $element = this.component.$element();
    var that = this;

    if (!that.option('legacyRendering')) {
      var $rowsTable = that._rowsView._getTableElement();

      var $rowsFixedTable = that._rowsView.getTableElements().eq(1);

      if (!$rowsTable) return;
      $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
      $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');
      $rowsFixedTable.toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);

      that._toggleBestFitModeForView(that._columnHeadersView, 'dx-header', isBestFit);

      that._toggleBestFitModeForView(that._footerView, 'dx-footer', isBestFit);

      if (that._needStretch()) {
        $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
      }

      if (_browser.default.msie && parseInt(_browser.default.version) === 11) {
        $rowsTable.find('.' + this.addWidgetPrefix(TABLE_FIXED_CLASS)).each(function () {
          this.style.width = isBestFit ? '10px' : '';
        });
      }
    } else {
      $element.find('.' + this.addWidgetPrefix(TABLE_CLASS)).toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit); // B253906

      $element.find(EDITORS_INPUT_SELECTOR).toggleClass(HIDDEN_CLASS, isBestFit);
      $element.find('.dx-group-cell').toggleClass(HIDDEN_CLASS, isBestFit);
      $element.find('.dx-header-row .' + this.addWidgetPrefix(TEXT_CONTENT_CLASS)).css('maxWidth', '');
    }
  },
  _synchronizeColumns: function _synchronizeColumns() {
    var that = this;
    var columnsController = that._columnsController;
    var visibleColumns = columnsController.getVisibleColumns();
    var columnAutoWidth = that.option('columnAutoWidth');
    var legacyRendering = that.option('legacyRendering');

    var needBestFit = that._needBestFit();

    var hasMinWidth = false;
    var resetBestFitMode;
    var isColumnWidthsCorrected = false;
    var resultWidths = [];
    var focusedElement;
    var selectionRange;

    var normalizeWidthsByExpandColumns = function normalizeWidthsByExpandColumns() {
      var expandColumnWidth;
      (0, _iterator.each)(visibleColumns, function (index, column) {
        if (column.type === 'groupExpand') {
          expandColumnWidth = resultWidths[index];
        }
      });
      (0, _iterator.each)(visibleColumns, function (index, column) {
        if (column.type === 'groupExpand' && expandColumnWidth) {
          resultWidths[index] = expandColumnWidth;
        }
      });
    };

    !needBestFit && (0, _iterator.each)(visibleColumns, function (index, column) {
      if (column.width === 'auto' || legacyRendering && column.fixed) {
        needBestFit = true;
        return false;
      }
    });
    (0, _iterator.each)(visibleColumns, function (index, column) {
      if (column.minWidth) {
        hasMinWidth = true;
        return false;
      }
    });

    that._setVisibleWidths(visibleColumns, []);

    if (needBestFit) {
      focusedElement = _dom_adapter.default.getActiveElement();
      selectionRange = _uiGrid_core2.default.getSelectionRange(focusedElement);

      that._toggleBestFitMode(true);

      resetBestFitMode = true;
    }

    (0, _common.deferUpdate)(function () {
      if (needBestFit) {
        resultWidths = that._getBestFitWidths();
        (0, _iterator.each)(visibleColumns, function (index, column) {
          var columnId = columnsController.getColumnId(column);
          columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
        });
      } else if (hasMinWidth) {
        resultWidths = that._getBestFitWidths();
      }

      (0, _iterator.each)(visibleColumns, function (index) {
        var width = this.width;

        if (width !== 'auto') {
          if ((0, _type.isDefined)(width)) {
            resultWidths[index] = (0, _type.isNumeric)(width) || isPixelWidth(width) ? parseFloat(width) : width;
          } else if (!columnAutoWidth) {
            resultWidths[index] = undefined;
          }
        }
      });

      if (resetBestFitMode) {
        that._toggleBestFitMode(false);

        resetBestFitMode = false;

        if (focusedElement && focusedElement !== _dom_adapter.default.getActiveElement()) {
          var isFocusOutsideWindow = (0, _position.getBoundingRect)(focusedElement).bottom < 0;

          if (!isFocusOutsideWindow) {
            if (_browser.default.msie) {
              setTimeout(function () {
                restoreFocus(focusedElement, selectionRange);
              });
            } else {
              restoreFocus(focusedElement, selectionRange);
            }
          }
        }
      }

      isColumnWidthsCorrected = that._correctColumnWidths(resultWidths, visibleColumns);

      if (columnAutoWidth) {
        normalizeWidthsByExpandColumns();

        if (that._needStretch()) {
          that._processStretch(resultWidths, visibleColumns);
        }
      }

      (0, _common.deferRender)(function () {
        if (needBestFit || isColumnWidthsCorrected) {
          that._setVisibleWidths(visibleColumns, resultWidths);
        }
      });
    });
  },
  _needBestFit: function _needBestFit() {
    return this.option('columnAutoWidth');
  },
  _needStretch: function _needStretch() {
    return this.option('legacyRendering') || this._columnsController.getVisibleColumns().some(function (c) {
      return c.width === 'auto' && !c.command;
    });
  },
  _getAverageColumnsWidth: function _getAverageColumnsWidth(resultWidths) {
    var freeWidth = calculateFreeWidth(this, resultWidths);
    var columnCountWithoutWidth = resultWidths.filter(function (width) {
      return width === undefined;
    }).length;
    return freeWidth / columnCountWithoutWidth;
  },
  _correctColumnWidths: function _correctColumnWidths(resultWidths, visibleColumns) {
    var that = this;
    var i;
    var hasPercentWidth = false;
    var hasAutoWidth = false;
    var isColumnWidthsCorrected = false;
    var $element = that.component.$element();
    var hasWidth = that._hasWidth;

    var _loop = function _loop() {
      var index = i;
      var column = visibleColumns[index];
      var isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
      var width = resultWidths[index];
      var minWidth = column.minWidth;

      if (minWidth) {
        if (width === undefined) {
          var averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);

          width = averageColumnsWidth;
        } else if (isPercentWidth(width)) {
          var freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);

          if (freeWidth < 0) {
            width = -1;
          }
        }
      }

      var realColumnWidth = that._getRealColumnWidth(index, resultWidths.map(function (columnWidth, columnIndex) {
        return index === columnIndex ? width : columnWidth;
      }));

      if (minWidth && !isHiddenColumn && realColumnWidth < minWidth) {
        resultWidths[index] = minWidth;
        isColumnWidthsCorrected = true;
        i = -1;
      }

      if (!(0, _type.isDefined)(column.width)) {
        hasAutoWidth = true;
      }

      if (isPercentWidth(column.width)) {
        hasPercentWidth = true;
      }
    };

    for (i = 0; i < visibleColumns.length; i++) {
      _loop();
    }

    if ($element && that._maxWidth) {
      delete that._maxWidth;
      $element.css('maxWidth', '');
    }

    if (!hasAutoWidth && resultWidths.length) {
      var contentWidth = that._rowsView.contentWidth();

      var scrollbarWidth = that._rowsView.getScrollbarWidth();

      var totalWidth = that._getTotalWidth(resultWidths, contentWidth);

      if (totalWidth < contentWidth) {
        var lastColumnIndex = _uiGrid_core2.default.getLastResizableColumnIndex(visibleColumns, resultWidths);

        if (lastColumnIndex >= 0) {
          resultWidths[lastColumnIndex] = 'auto';
          isColumnWidthsCorrected = true;

          if (hasWidth === false && !hasPercentWidth) {
            that._maxWidth = totalWidth + scrollbarWidth + (that.option('showBorders') ? 2 : 0);
            $element.css('maxWidth', that._maxWidth);
          }
        }
      }
    }

    return isColumnWidthsCorrected;
  },
  _processStretch: function _processStretch(resultSizes, visibleColumns) {
    var groupSize = this._rowsView.contentWidth();

    var tableSize = this._getTotalWidth(resultSizes, groupSize);

    var unusedIndexes = {
      length: 0
    };
    if (!resultSizes.length) return;
    (0, _iterator.each)(visibleColumns, function (index) {
      if (this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
        unusedIndexes[index] = true;
        unusedIndexes.length++;
      }
    });
    var diff = groupSize - tableSize;
    var diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
    var onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);

    if (diff >= 0) {
      for (var i = 0; i < resultSizes.length; i++) {
        if (unusedIndexes[i]) {
          continue;
        }

        resultSizes[i] += diffElement;

        if (onePixelElementsCount > 0) {
          if (onePixelElementsCount < 1) {
            resultSizes[i] += onePixelElementsCount;
            onePixelElementsCount = 0;
          } else {
            resultSizes[i]++;
            onePixelElementsCount--;
          }
        }
      }
    }
  },
  _getRealColumnWidth: function _getRealColumnWidth(columnIndex, columnWidths, groupWidth) {
    var ratio = 1;
    var width = columnWidths[columnIndex];

    if (!isPercentWidth(width)) {
      return parseFloat(width);
    }

    var percentTotalWidth = columnWidths.reduce(function (sum, width, index) {
      if (!isPercentWidth(width)) {
        return sum;
      }

      return sum + parseFloat(width);
    }, 0);
    var pixelTotalWidth = columnWidths.reduce(function (sum, width) {
      if (!width || width === HIDDEN_COLUMNS_WIDTH || isPercentWidth(width)) {
        return sum;
      }

      return sum + parseFloat(width);
    }, 0);
    groupWidth = groupWidth || this._rowsView.contentWidth();
    var freeSpace = groupWidth - pixelTotalWidth;
    var percentTotalWidthInPixel = percentTotalWidth * groupWidth / 100;

    if (pixelTotalWidth > 0 && percentTotalWidthInPixel + pixelTotalWidth >= groupWidth) {
      ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1;
    }

    return parseFloat(width) * groupWidth * ratio / 100;
  },
  _getTotalWidth: function _getTotalWidth(widths, groupWidth) {
    var result = 0;

    for (var i = 0; i < widths.length; i++) {
      var width = widths[i];

      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }

    return result;
  },
  updateSize: function updateSize($rootElement) {
    var that = this;
    var $groupElement;
    var width;
    var importantMarginClass = that.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);

    if (that._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && $rootElement.width()) {
      $groupElement = $rootElement.children('.' + that.getWidgetContainerClass());

      if ($groupElement.length) {
        $groupElement.detach();
      }

      that._hasHeight = !!getContainerHeight($rootElement);
      width = $rootElement.width();
      $rootElement.addClass(importantMarginClass);
      that._hasWidth = $rootElement.width() === width;
      $rootElement.removeClass(importantMarginClass);

      if ($groupElement.length) {
        $groupElement.appendTo($rootElement);
      }
    }
  },
  publicMethods: function publicMethods() {
    return ['resize', 'updateDimensions'];
  },
  resize: function resize() {
    return !this.component._requireResize && this.updateDimensions();
  },
  updateDimensions: function updateDimensions(checkSize) {
    var that = this;

    that._initPostRenderHandlers(); // T335767


    if (!that._checkSize(checkSize)) {
      return;
    }

    var prevResult = that._resizeDeferred;
    var result = that._resizeDeferred = new _deferred.Deferred();
    (0, _deferred.when)(prevResult).always(function () {
      (0, _common.deferRender)(function () {
        if (that._dataController.isLoaded()) {
          that._synchronizeColumns();
        } // IE11


        that._resetGroupElementHeight();

        (0, _common.deferUpdate)(function () {
          (0, _common.deferRender)(function () {
            (0, _common.deferUpdate)(function () {
              that._updateDimensionsCore();
            });
          });
        });
      }).done(result.resolve).fail(result.reject);
    });
    return result.promise();
  },
  _resetGroupElementHeight: function _resetGroupElementHeight() {
    var groupElement = this.component.$element().children().get(0);

    var scrollable = this._rowsView.getScrollable();

    if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
      groupElement.style.height = '';
    }
  },
  _checkSize: function _checkSize(checkSize) {
    var $rootElement = this.component.$element();

    if (checkSize && (this._lastWidth === $rootElement.width() && this._lastHeight === $rootElement.height() || !$rootElement.is(':visible'))) {
      return false;
    }

    return true;
  },
  _setScrollerSpacingCore: function _setScrollerSpacingCore(hasHeight) {
    var that = this;
    var vScrollbarWidth = hasHeight ? that._rowsView.getScrollbarWidth() : 0;

    var hScrollbarWidth = that._rowsView.getScrollbarWidth(true);

    (0, _common.deferRender)(function () {
      that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
      that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);

      that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  },
  _setScrollerSpacing: function _setScrollerSpacing(hasHeight) {
    var _this2 = this;

    if (this.option('scrolling.useNative') === true) {
      // T722415, T758955
      (0, _common.deferRender)(function () {
        (0, _common.deferUpdate)(function () {
          _this2._setScrollerSpacingCore(hasHeight);
        });
      });
    } else {
      this._setScrollerSpacingCore(hasHeight);
    }
  },
  _updateDimensionsCore: function _updateDimensionsCore() {
    var that = this;
    var dataController = that._dataController;
    var rowsView = that._rowsView;
    var $rootElement = that.component.$element();
    var groupElement = $rootElement.children().get(0);
    var rootElementHeight = $rootElement && ($rootElement.get(0).clientHeight || $rootElement.height());
    var maxHeight = parseInt($rootElement.css('maxHeight'));
    var maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    var height = that.option('height') || $rootElement.get(0).style.height;
    var editorFactory = that.getController('editorFactory');
    var isMaxHeightApplied = maxHeightHappened && groupElement.scrollHeight === groupElement.offsetHeight;
    var $testDiv;
    that.updateSize($rootElement);
    var hasHeight = that._hasHeight || maxHeightHappened;

    if (height && that._hasHeight ^ height !== 'auto') {
      $testDiv = (0, _renderer.default)('<div>').height(height).appendTo($rootElement);
      that._hasHeight = !!$testDiv.height();
      $testDiv.remove();
    }

    (0, _common.deferRender)(function () {
      rowsView.height(null, hasHeight); // IE11

      if (maxHeightHappened && !isMaxHeightApplied) {
        (0, _renderer.default)(groupElement).css('height', maxHeight);
      }

      if (!dataController.isLoaded()) {
        rowsView.setLoading(dataController.isLoading());
        return;
      }

      (0, _common.deferUpdate)(function () {
        that._updateLastSizes($rootElement);

        that._setScrollerSpacing(hasHeight);

        (0, _iterator.each)(VIEW_NAMES, function (index, viewName) {
          var view = that.getView(viewName);

          if (view) {
            view.resize();
          }
        });
        editorFactory && editorFactory.resize();
      });
    });
  },
  _updateLastSizes: function _updateLastSizes($rootElement) {
    this._lastWidth = $rootElement.width();
    this._lastHeight = $rootElement.height();
  },
  optionChanged: function optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'height':
        this.component._renderDimensions();

        this.resize();

      /* falls through */

      case 'legacyRendering':
      case 'renderAsync':
        args.handled = true;
        return;

      default:
        this.callBase(args);
    }
  },
  init: function init() {
    var that = this;
    that._dataController = that.getController('data');
    that._columnsController = that.getController('columns');
    that._columnHeadersView = that.getView('columnHeadersView');
    that._footerView = that.getView('footerView');
    that._rowsView = that.getView('rowsView');
  }
});

var SynchronizeScrollingController = _uiGrid_core.default.ViewController.inherit({
  _scrollChangedHandler: function _scrollChangedHandler(views, pos, viewName) {
    for (var j = 0; j < views.length; j++) {
      if (views[j] && views[j].name !== viewName) {
        views[j].scrollTo({
          left: pos.left,
          top: pos.top
        });
      }
    }
  },
  init: function init() {
    var views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];

    for (var i = 0; i < views.length; i++) {
      var view = views[i];

      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  }
});

var GridView = _uiGrid_core.default.View.inherit({
  _endUpdateCore: function _endUpdateCore() {
    if (this.component._requireResize) {
      this.component._requireResize = false;

      this._resizingController.resize();
    }
  },
  _getWidgetAriaLabel: function _getWidgetAriaLabel() {
    return 'dxDataGrid-ariaDataGrid';
  },
  init: function init() {
    var that = this;
    that._resizingController = that.getController('resizing');
    that._dataController = that.getController('data');
  },
  getView: function getView(name) {
    return this.component._views[name];
  },
  element: function element() {
    return this._groupElement;
  },
  optionChanged: function optionChanged(args) {
    var that = this;

    if ((0, _type.isDefined)(that._groupElement) && args.name === 'showBorders') {
      that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);

      args.handled = true;
    } else {
      that.callBase(args);
    }
  },
  _renderViews: function _renderViews($groupElement) {
    var that = this;
    (0, _iterator.each)(VIEW_NAMES, function (index, viewName) {
      var view = that.getView(viewName);

      if (view) {
        view.render($groupElement);
      }
    });
  },
  _getTableRoleName: function _getTableRoleName() {
    return 'grid';
  },
  render: function render($rootElement) {
    var that = this;
    var isFirstRender = !that._groupElement;
    var $groupElement = that._groupElement || (0, _renderer.default)('<div>').addClass(that.getWidgetContainerClass());
    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!that.option('showBorders'));
    that.setAria('role', 'presentation', $rootElement);
    that.component.setAria({
      'role': this._getTableRoleName(),
      'label': _message.default.format(that._getWidgetAriaLabel())
    }, $groupElement);
    that._rootElement = $rootElement || that._rootElement;

    if (isFirstRender) {
      that._groupElement = $groupElement;
      (0, _window.hasWindow)() && that.getController('resizing').updateSize($rootElement);
      $groupElement.appendTo($rootElement);
    }

    that._renderViews($groupElement);
  },
  update: function update() {
    var that = this;
    var $rootElement = that._rootElement;
    var $groupElement = that._groupElement;
    var resizingController = that.getController('resizing');

    if ($rootElement && $groupElement) {
      resizingController.resize();

      if (that._dataController.isLoaded()) {
        that._resizingController.fireContentReadyAction();
      }
    }
  }
});

var _default = {
  defaultOptions: function defaultOptions() {
    return {
      showBorders: false,
      renderAsync: false,
      legacyRendering: false
    };
  },
  controllers: {
    resizing: ResizingController,
    synchronizeScrolling: SynchronizeScrollingController
  },
  views: {
    gridView: GridView
  }
};
exports.default = _default;
module.exports = exports.default;