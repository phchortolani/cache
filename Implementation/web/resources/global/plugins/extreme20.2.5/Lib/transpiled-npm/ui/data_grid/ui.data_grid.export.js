"use strict";

exports.ExportController = exports.DataProvider = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _class = _interopRequireDefault(require("../../core/class"));

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _position = require("../../core/utils/position");

var _array = require("../../core/utils/array");

var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));

var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.export_mixin"));

var _exporter = require("../../exporter");

var _message = _interopRequireDefault(require("../../localization/message"));

var _button = _interopRequireDefault(require("../button"));

var _list = _interopRequireDefault(require("../list"));

var _context_menu = _interopRequireDefault(require("../context_menu"));

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATAGRID_EXPORT_MENU_CLASS = 'dx-datagrid-export-menu';
var DATAGRID_EXPORT_BUTTON_CLASS = 'dx-datagrid-export-button';
var DATAGRID_EXPORT_ICON = 'export-to';
var DATAGRID_EXPORT_EXCEL_ICON = 'xlsxfile';
var DATAGRID_EXPORT_SELECTED_ICON = 'exportselected';
var DATAGRID_EXPORT_EXCEL_BUTTON_ICON = 'export-excel-button';
var TOOLBAR_ITEM_AUTO_HIDE_CLASS = 'dx-toolbar-item-auto-hide';
var TOOLBAR_HIDDEN_BUTTON_CLASS = 'dx-toolbar-hidden-button';
var BUTTON_CLASS = 'dx-button';
var DATA_STYLE_OFFSET = 3;

var DataProvider = _class.default.inherit({
  _getGroupValue: function _getGroupValue(item) {
    var key = item.key,
        data = item.data,
        rowType = item.rowType,
        groupIndex = item.groupIndex,
        summaryCells = item.summaryCells;
    var groupColumn = this._options.groupColumns[groupIndex];

    var value = _uiData_grid.default.getDisplayValue(groupColumn, groupColumn.deserializeValue ? groupColumn.deserializeValue(key[groupIndex]) : key[groupIndex], data, rowType);

    var result = groupColumn.caption + ': ' + _uiData_grid.default.formatValue(value, groupColumn);

    if (summaryCells && summaryCells[0] && summaryCells[0].length) {
      result += ' ' + _uiData_grid.default.getGroupRowSummaryText(summaryCells[0], this._options.summaryTexts);
    }

    return result;
  },
  _correctCellIndex: function _correctCellIndex(cellIndex) {
    return cellIndex;
  },
  _initOptions: function _initOptions() {
    var exportController = this._exportController;

    var groupColumns = exportController._columnsController.getGroupColumns();

    var excelWrapTextEnabled = exportController.option('export.excelWrapTextEnabled');
    this._options = {
      columns: exportController._getColumns(this._initialColumnWidthsByColumnIndex),
      groupColumns: groupColumns,
      items: this._selectedRowsOnly || exportController._selectionOnly ? exportController._getSelectedItems() : exportController._getAllItems(),
      getVisibleIndex: exportController._columnsController.getVisibleIndex.bind(exportController._columnsController),
      isHeadersVisible: exportController.option('showColumnHeaders'),
      summaryTexts: exportController.option('summary.texts'),
      customizeExportData: exportController.option('customizeExportData'),
      rtlEnabled: exportController.option('rtlEnabled'),
      wrapTextEnabled: (0, _type.isDefined)(excelWrapTextEnabled) ? excelWrapTextEnabled : !!exportController.option('wordWrapEnabled'),
      customizeExcelCell: exportController.option('export.customizeExcelCell')
    };
  },
  hasCustomizeExcelCell: function hasCustomizeExcelCell() {
    return (0, _type.isDefined)(this._options.customizeExcelCell);
  },
  customizeExcelCell: function customizeExcelCell(e, cellSourceData) {
    if (this._options.customizeExcelCell) {
      e.gridCell = cellSourceData;

      if ((0, _type.isDefined)(this._exportController) && (0, _type.isDefined)(this._exportController.component)) {
        e.component = this._exportController.component;
      }

      this._options.customizeExcelCell(e);
    }
  },
  ctor: function ctor(exportController, initialColumnWidthsByColumnIndex, selectedRowsOnly) {
    this._exportController = exportController;
    this._initialColumnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
    this._selectedRowsOnly = selectedRowsOnly;
  },
  getStyles: function getStyles() {
    var wrapTextEnabled = this._options.wrapTextEnabled;
    var styles = ['center', 'left', 'right'].map(function (alignment) {
      return {
        // Header, Total styles
        bold: true,
        alignment: alignment,
        wrapText: true
      };
    });
    this.getColumns().forEach(function (column) {
      styles.push({
        // column styles
        alignment: column.alignment || 'left',
        format: column.format,
        wrapText: wrapTextEnabled,
        dataType: column.dataType
      });
    });
    styles.push({
      // Group row style
      bold: true,
      wrapText: false,
      alignment: (0, _position.getDefaultAlignment)(this._options.rtlEnabled)
    });
    return styles;
  },
  _getTotalCellStyleId: function _getTotalCellStyleId(cellIndex) {
    var alignment = this.getColumns()[cellIndex] && this.getColumns()[cellIndex].alignment || 'right';
    return ['center', 'left', 'right'].indexOf(alignment);
  },
  getStyleId: function getStyleId(rowIndex, cellIndex) {
    if (rowIndex < this.getHeaderRowCount()) {
      return 0;
    } else if (this.isTotalCell(rowIndex - this.getHeaderRowCount(), cellIndex)) {
      return this._getTotalCellStyleId(cellIndex);
    } else if (this.isGroupRow(rowIndex - this.getHeaderRowCount())) {
      return DATA_STYLE_OFFSET + this.getColumns().length;
    } else {
      return cellIndex + DATA_STYLE_OFFSET; // header style offset
    }
  },
  getColumns: function getColumns(getColumnsByAllRows) {
    var columns = this._options.columns;
    return getColumnsByAllRows ? columns : columns[columns.length - 1];
  },
  getColumnsWidths: function getColumnsWidths() {
    var columns = this.getColumns();
    return (0, _type.isDefined)(columns) ? columns.map(function (c) {
      return c.width;
    }) : undefined;
  },
  getRowsCount: function getRowsCount() {
    return this._options.items.length + this.getHeaderRowCount();
  },
  getHeaderRowCount: function getHeaderRowCount() {
    if (this.isHeadersVisible()) {
      return this._options.columns.length - 1;
    }

    return 0;
  },
  isGroupRow: function isGroupRow(rowIndex) {
    return rowIndex < this._options.items.length && this._options.items[rowIndex].rowType === 'group';
  },
  getGroupLevel: function getGroupLevel(rowIndex) {
    var item = this._options.items[rowIndex - this.getHeaderRowCount()];

    var groupIndex = item && item.groupIndex;

    if (item && item.rowType === 'totalFooter') {
      return 0;
    }

    return (0, _type.isDefined)(groupIndex) ? groupIndex : this._options.groupColumns.length;
  },
  getCellType: function getCellType(rowIndex, cellIndex) {
    var columns = this.getColumns();

    if (rowIndex < this.getHeaderRowCount()) {
      return 'string';
    } else {
      rowIndex -= this.getHeaderRowCount();
    }

    if (cellIndex < columns.length) {
      var item = this._options.items.length && this._options.items[rowIndex];
      var column = columns[cellIndex];

      if (item && item.rowType === 'data') {
        if (isFinite(item.values[this._correctCellIndex(cellIndex)]) && !(0, _type.isDefined)(column.customizeText)) {
          return (0, _type.isDefined)(column.lookup) ? column.lookup.dataType : column.dataType;
        }
      }

      return 'string';
    }
  },
  ready: function ready() {
    var that = this;

    that._initOptions();

    var options = that._options;
    return (0, _deferred.when)(options.items).done(function (items) {
      options.customizeExportData && options.customizeExportData(that.getColumns(that.getHeaderRowCount() > 1), items);
      options.items = items;
    }).fail(function () {
      options.items = [];
    });
  },
  _convertFromGridGroupSummaryItems: function _convertFromGridGroupSummaryItems(gridGroupSummaryItems) {
    if ((0, _type.isDefined)(gridGroupSummaryItems) && gridGroupSummaryItems.length > 0) {
      return gridGroupSummaryItems.map(function (item) {
        return {
          value: item.value,
          name: item.name
        };
      });
    }
  },
  getCellData: function getCellData(rowIndex, cellIndex, isExcelJS) {
    var result = {
      cellSourceData: {},
      value: value
    };
    var column;
    var value;
    var columns = this.getColumns();

    var correctedCellIndex = this._correctCellIndex(cellIndex);

    if (rowIndex < this.getHeaderRowCount()) {
      var columnsRow = this.getColumns(true)[rowIndex];
      column = columnsRow[cellIndex];
      result.cellSourceData.rowType = 'header';
      result.cellSourceData.column = column && column.gridColumn;
      result.value = column && column.caption;
    } else {
      rowIndex -= this.getHeaderRowCount();
      var item = this._options.items.length && this._options.items[rowIndex];

      if (item) {
        var itemValues = item.values;
        result.cellSourceData.rowType = item.rowType;
        result.cellSourceData.column = columns[cellIndex] && columns[cellIndex].gridColumn;

        switch (item.rowType) {
          case 'groupFooter':
          case 'totalFooter':
            if (correctedCellIndex < itemValues.length) {
              value = itemValues[correctedCellIndex];

              if ((0, _type.isDefined)(value)) {
                result.cellSourceData.value = value.value;
                result.cellSourceData.totalSummaryItemName = value.name;
                result.value = _uiData_grid.default.getSummaryText(value, this._options.summaryTexts);
              } else {
                result.cellSourceData.value = undefined;
              }
            }

            break;

          case 'group':
            result.cellSourceData.groupIndex = item.groupIndex;

            if (cellIndex < 1) {
              result.cellSourceData.column = this._options.groupColumns[item.groupIndex];
              result.cellSourceData.value = item.key[item.groupIndex];
              result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(item.summaryCells[0]);
              result.value = this._getGroupValue(item);
            } else {
              var summaryItems = item.values[correctedCellIndex];

              if (Array.isArray(summaryItems)) {
                result.cellSourceData.groupSummaryItems = this._convertFromGridGroupSummaryItems(summaryItems);
                value = '';

                for (var i = 0; i < summaryItems.length; i++) {
                  value += (i > 0 ? isExcelJS ? '\n' : ' \n ' : '') + _uiData_grid.default.getSummaryText(summaryItems[i], this._options.summaryTexts);
                }

                result.value = value;
              } else {
                result.cellSourceData.value = undefined;
              }
            }

            break;

          default:
            column = columns[cellIndex];

            if (column) {
              var _value = itemValues[correctedCellIndex];

              var displayValue = _uiData_grid.default.getDisplayValue(column, _value, item.data, item.rowType); // from 'ui.grid_core.rows.js: _getCellOptions'


              if (!isFinite(displayValue) || (0, _type.isDefined)(column.customizeText)) {
                // similar to 'ui.grid_core.rows.js: _getCellOptions'
                if (isExcelJS && (0, _type.isDefined)(column.customizeText) && column.customizeText === this._exportController._columnsController.getCustomizeTextByDataType('boolean')) {
                  result.value = displayValue;
                } else {
                  result.value = _uiData_grid.default.formatValue(displayValue, column);
                }
              } else {
                result.value = displayValue;
              }

              result.cellSourceData.value = _value;
            }

            result.cellSourceData.data = item.data;
        }
      }
    }

    return result;
  },
  isHeadersVisible: function isHeadersVisible() {
    return this._options.isHeadersVisible;
  },
  isTotalCell: function isTotalCell(rowIndex, cellIndex) {
    var items = this._options.items;
    var item = items[rowIndex];

    var correctCellIndex = this._correctCellIndex(cellIndex);

    var isSummaryAlignByColumn = item.summaryCells && item.summaryCells[correctCellIndex] && item.summaryCells[correctCellIndex].length > 0 && item.summaryCells[correctCellIndex][0].alignByColumn;
    return item && item.rowType === 'groupFooter' || item.rowType === 'totalFooter' || isSummaryAlignByColumn;
  },
  getCellMerging: function getCellMerging(rowIndex, cellIndex) {
    var columns = this._options.columns;
    var column = columns[rowIndex] && columns[rowIndex][cellIndex];
    return column ? {
      colspan: (column.exportColspan || 1) - 1,
      rowspan: (column.rowspan || 1) - 1
    } : {
      colspan: 0,
      rowspan: 0
    };
  },
  getFrozenArea: function getFrozenArea() {
    var that = this;
    return {
      x: 0,
      y: that.getHeaderRowCount()
    };
  }
});

exports.DataProvider = DataProvider;

var ExportController = _uiData_grid.default.ViewController.inherit({}).include(_uiGrid_core.default).inherit({
  _getEmptyCell: function _getEmptyCell() {
    return {
      caption: '',
      colspan: 1,
      rowspan: 1
    };
  },
  _updateColumnWidth: function _updateColumnWidth(column, width) {
    // this function is overridden in 'ui.grid_core.adaptivity.js'
    column.width = width;
  },
  _getColumns: function _getColumns(initialColumnWidthsByColumnIndex) {
    var result = [];
    var i;
    var columns;
    var columnsController = this._columnsController;
    var rowCount = columnsController.getRowCount();

    for (i = 0; i <= rowCount; i++) {
      var currentHeaderRow = [];
      columns = columnsController.getVisibleColumns(i, true);
      var columnWidthsByColumnIndex = void 0;

      if (i === rowCount) {
        if (this._updateLockCount) {
          columnWidthsByColumnIndex = initialColumnWidthsByColumnIndex;
        } else {
          var columnWidths = this._getColumnWidths(this._headersView, this._rowsView);

          if (columnWidths && columnWidths.length) {
            columnWidthsByColumnIndex = {};

            for (var _i = 0; _i < columns.length; _i++) {
              columnWidthsByColumnIndex[columns[_i].index] = columnWidths[_i];
            }
          }
        }
      }

      for (var j = 0; j < columns.length; j++) {
        var column = (0, _extend.extend)({}, columns[j], {
          dataType: columns[j].dataType === 'datetime' ? 'date' : columns[j].dataType,
          gridColumn: columns[j]
        });

        if (this._needColumnExporting(column)) {
          var currentColspan = this._calculateExportColspan(column);

          if ((0, _type.isDefined)(currentColspan)) {
            column.exportColspan = currentColspan;
          }

          if (columnWidthsByColumnIndex) {
            this._updateColumnWidth(column, columnWidthsByColumnIndex[column.index]);
          }

          currentHeaderRow.push(column);
        }
      }

      result.push(currentHeaderRow);
    }

    columns = result[rowCount];
    result = this._prepareItems(result.slice(0, -1));
    result.push(columns);
    return result;
  },
  _calculateExportColspan: function _calculateExportColspan(column) {
    var _this = this;

    if (!column.isBand) {
      return;
    }

    var childColumns = this._columnsController.getChildrenByBandColumn(column.index, true);

    if (!(0, _type.isDefined)(childColumns)) {
      return;
    }

    return childColumns.reduce(function (result, childColumn) {
      if (_this._needColumnExporting(childColumn)) {
        return result + (_this._calculateExportColspan(childColumn) || 1);
      } else {
        return result;
      }
    }, 0);
  },
  _needColumnExporting: function _needColumnExporting(column) {
    return !column.command && (column.allowExporting || column.allowExporting === undefined);
  },
  _getFooterSummaryItems: function _getFooterSummaryItems(summaryCells, isTotal) {
    var result = [];
    var estimatedItemsCount = 1;
    var i = 0;

    do {
      var values = [];

      for (var j = 0; j < summaryCells.length; j++) {
        var summaryCell = summaryCells[j];
        var itemsLength = summaryCell.length;

        if (estimatedItemsCount < itemsLength) {
          estimatedItemsCount = itemsLength;
        }

        values.push(summaryCell[i]);
      }

      result.push({
        values: values,
        rowType: isTotal ? 'totalFooter' : 'groupFooter'
      });
    } while (i++ < estimatedItemsCount - 1);

    return result;
  },
  _hasSummaryGroupFooters: function _hasSummaryGroupFooters() {
    var groupItems = this.option('summary.groupItems');

    if ((0, _type.isDefined)(groupItems)) {
      for (var i = 0; i < groupItems.length; i++) {
        if (groupItems[i].showInGroupFooter) {
          return true;
        }
      }
    }

    return false;
  },
  _getItemsWithSummaryGroupFooters: function _getItemsWithSummaryGroupFooters(sourceItems) {
    var result = [];
    var beforeGroupFooterItems = [];
    var groupFooterItems = [];

    for (var i = 0; i < sourceItems.length; i++) {
      var item = sourceItems[i];

      if (item.rowType === 'groupFooter') {
        groupFooterItems = this._getFooterSummaryItems(item.summaryCells);
        result = result.concat(beforeGroupFooterItems, groupFooterItems);
        beforeGroupFooterItems = [];
      } else {
        beforeGroupFooterItems.push(item);
      }
    }

    return result.length ? result : beforeGroupFooterItems;
  },
  _updateGroupValuesWithSummaryByColumn: function _updateGroupValuesWithSummaryByColumn(sourceItems) {
    var summaryValues = [];

    for (var i = 0; i < sourceItems.length; i++) {
      var item = sourceItems[i];
      var summaryCells = item.summaryCells;

      if (item.rowType === 'group' && summaryCells && summaryCells.length > 1) {
        var groupColumnCount = item.values.length;

        for (var j = 1; j < summaryCells.length; j++) {
          for (var k = 0; k < summaryCells[j].length; k++) {
            var summaryItem = summaryCells[j][k];

            if (summaryItem && summaryItem.alignByColumn) {
              if (!Array.isArray(summaryValues[j - groupColumnCount])) {
                summaryValues[j - groupColumnCount] = [];
              }

              summaryValues[j - groupColumnCount].push(summaryItem);
            }
          }
        }

        if (summaryValues.length > 0) {
          (0, _array.merge)(item.values, summaryValues);
          summaryValues = [];
        }
      }
    }
  },
  _processUnExportedItems: function _processUnExportedItems(items) {
    var columns = this._columnsController.getVisibleColumns(null, true);

    var groupColumns = this._columnsController.getGroupColumns();

    var values;
    var summaryCells;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isDetailExpandColumn = false;
      values = [];
      summaryCells = [];

      for (var j = 0; j < columns.length; j++) {
        var column = columns[j];
        isDetailExpandColumn = isDetailExpandColumn || column.type === 'detailExpand';

        if (this._needColumnExporting(column)) {
          if (item.values) {
            if (item.rowType === 'group' && !values.length) {
              values.push(item.key[item.groupIndex]);
            } else {
              values.push(item.values[j]);
            }
          }

          if (item.summaryCells) {
            if (item.rowType === 'group' && !summaryCells.length) {
              var index = j - groupColumns.length + item.groupIndex;
              summaryCells.push(item.summaryCells[isDetailExpandColumn ? index - 1 : index]);
            } else {
              summaryCells.push(item.summaryCells[j]);
            }
          }
        }
      }

      if (values.length) {
        item.values = values;
      }

      if (summaryCells.length) {
        item.summaryCells = summaryCells;
      }
    }
  },
  _getAllItems: function _getAllItems(data) {
    var that = this;
    var d = new _deferred.Deferred();
    var dataController = this.getController('data');
    var footerItems = dataController.footerItems();
    var totalItem = footerItems.length && footerItems[0];
    var summaryTotalItems = that.option('summary.totalItems');
    var summaryCells;
    (0, _deferred.when)(data).done(function (data) {
      dataController.loadAll(data).done(function (sourceItems, totalAggregates) {
        that._updateGroupValuesWithSummaryByColumn(sourceItems);

        if (that._hasSummaryGroupFooters()) {
          sourceItems = that._getItemsWithSummaryGroupFooters(sourceItems);
        }

        summaryCells = totalItem && totalItem.summaryCells;

        if ((0, _type.isDefined)(totalAggregates) && summaryTotalItems) {
          summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
        }

        var summaryItems = totalItem && that._getFooterSummaryItems(summaryCells, true);

        if (summaryItems) {
          sourceItems = sourceItems.concat(summaryItems);
        }

        that._processUnExportedItems(sourceItems);

        d.resolve(sourceItems);
      }).fail(d.reject);
    }).fail(d.reject);
    return d;
  },
  _getSummaryCells: function _getSummaryCells(summaryTotalItems, totalAggregates) {
    var dataController = this.getController('data');
    var columnsController = dataController._columnsController;
    return dataController._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(null, true), function (summaryItem, column) {
      return dataController._isDataColumn(column) ? column.index : -1;
    });
  },
  _getSelectedItems: function _getSelectedItems() {
    var selectionController = this.getController('selection');
    var selectedRowData = selectionController.getSelectedRowsData();
    return this._getAllItems(selectedRowData);
  },
  _getColumnWidths: function _getColumnWidths(headersView, rowsView) {
    return headersView && headersView.isVisible() ? headersView.getColumnWidths() : rowsView.getColumnWidths();
  },
  init: function init() {
    this._columnsController = this.getController('columns');
    this._rowsView = this.getView('rowsView');
    this._headersView = this.getView('columnHeadersView');
    this.createAction('onExporting', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onExported', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFileSaving', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  callbackNames: function callbackNames() {
    return ['selectionOnlyChanged'];
  },
  getExportFormat: function getExportFormat() {
    return ['EXCEL'];
  },
  getDataProvider: function getDataProvider(selectedRowsOnly) {
    var columnWidths = this._getColumnWidths(this._headersView, this._rowsView);

    var initialColumnWidthsByColumnIndex;

    if (columnWidths && columnWidths.length) {
      initialColumnWidthsByColumnIndex = {};

      var columnsLastRowVisibleColumns = this._columnsController.getVisibleColumns(this._columnsController.getRowCount(), true);

      for (var i = 0; i < columnsLastRowVisibleColumns.length; i++) {
        initialColumnWidthsByColumnIndex[columnsLastRowVisibleColumns[i].index] = columnWidths[i];
      }
    }

    return new DataProvider(this, initialColumnWidthsByColumnIndex, selectedRowsOnly);
  },
  exportToExcel: function exportToExcel(selectionOnly) {
    var that = this;
    that._selectionOnly = selectionOnly;
    (0, _exporter.export)(that.component.getDataProvider(), {
      fileName: that.option('export.fileName'),
      proxyUrl: that.option('export.proxyUrl'),
      format: 'EXCEL',
      autoFilterEnabled: !!that.option('export.excelFilterEnabled'),
      rtlEnabled: that.option('rtlEnabled'),
      ignoreErrors: that.option('export.ignoreExcelErrors'),
      exportingAction: that.getAction('onExporting'),
      exportedAction: that.getAction('onExported'),
      fileSavingAction: that.getAction('onFileSaving')
    }, _exporter.excel.getData);
  },
  publicMethods: function publicMethods() {
    return ['getDataProvider', 'getExportFormat', 'exportToExcel'];
  },
  selectionOnly: function selectionOnly(value) {
    if ((0, _type.isDefined)(value)) {
      this._isSelectedRows = value;
      this.selectionOnlyChanged.fire();
    } else {
      return this._isSelectedRows;
    }
  }
});

exports.ExportController = ExportController;

_uiData_grid.default.registerModule('export', {
  defaultOptions: function defaultOptions() {
    return {
      'export': {
        /**
         * @name dxDataGridOptions.export.enabled
         * @type boolean
         * @default false
         */
        enabled: false,

        /**
         * @name dxDataGridOptions.export.fileName
         * @type string
         * @default "DataGrid"
         * @deprecated
         */
        fileName: 'DataGrid',

        /**
         * @name dxDataGridOptions.export.excelFilterEnabled
         * @type boolean
         * @default false
         * @deprecated
         */
        excelFilterEnabled: false,

        /**
         * @name dxDataGridOptions.export.excelWrapTextEnabled
         * @type boolean
         * @default undefined
         * @deprecated
         */
        excelWrapTextEnabled: undefined,

        /**
         * @name dxDataGridOptions.export.proxyUrl
         * @type string
         * @default undefined
         * @deprecated
         */
        proxyUrl: undefined,

        /**
         * @name dxDataGridOptions.export.allowExportSelectedData
         * @type boolean
         * @default false
         */
        allowExportSelectedData: false,

        /**
        * @name dxDataGridOptions.export.ignoreExcelErrors
        * @type boolean
        * @default true
        * @deprecated
        */
        ignoreExcelErrors: true,

        /**
         * @name dxDataGridOptions.export.texts
         * @type object
         */
        texts: {
          /**
           * @name dxDataGridOptions.export.texts.exportTo
           * @type string
           * @default "Export"
           */
          exportTo: _message.default.format('dxDataGrid-exportTo'),

          /**
           * @name dxDataGridOptions.export.texts.exportAll
           * @type string
           * @default "Export all data"
           */
          exportAll: _message.default.format('dxDataGrid-exportAll'),

          /**
           * @name dxDataGridOptions.export.texts.exportSelectedRows
           * @type string
           * @default "Export selected rows"
           */
          exportSelectedRows: _message.default.format('dxDataGrid-exportSelectedRows')
        }
        /**
         * @name dxDataGridOptions.export.customizeExcelCell
         * @deprecated
         * @type function(options)
         * @type_function_param1 options:object
         * @type_function_param1_field1 component:dxDataGrid
         * @type_function_param1_field2 horizontalAlignment:Enums.ExcelCellHorizontalAlignment
         * @type_function_param1_field3 verticalAlignment:Enums.ExcelCellVerticalAlignment
         * @type_function_param1_field4 wrapTextEnabled:boolean
         * @type_function_param1_field5 backgroundColor:string
         * @type_function_param1_field6 fillPatternType:Enums.ExcelCellPatternType
         * @type_function_param1_field7 fillPatternColor:string
         * @type_function_param1_field8 font:ExcelFont
         * @type_function_param1_field9 value:string|number|date
         * @type_function_param1_field10 numberFormat:string
         * @type_function_param1_field11 gridCell:ExcelDataGridCell
         */

      }
    };
  },
  controllers: {
    'export': ExportController
  },
  extenders: {
    controllers: {
      editing: {
        callbackNames: function callbackNames() {
          var callbackList = this.callBase();
          return (0, _type.isDefined)(callbackList) ? callbackList.push('editingChanged') : ['editingChanged'];
        },
        _updateEditButtons: function _updateEditButtons() {
          this.callBase();
          this.editingChanged.fire(this.hasChanges());
        }
      }
    },
    views: {
      headerPanel: {
        _getToolbarItems: function _getToolbarItems() {
          var items = this.callBase();
          return this._appendExportItems(items);
        },
        _appendExportItems: function _appendExportItems(items) {
          var that = this;
          var exportOptions = that.option('export');

          if (exportOptions.enabled) {
            var exportItems = [];

            if (exportOptions.allowExportSelectedData) {
              exportItems.push({
                template: function template(data, index, container) {
                  var $container = (0, _renderer.default)(container);

                  that._renderButton(data, $container);

                  that._renderExportMenu($container);
                },
                menuItemTemplate: function menuItemTemplate(data, index, container) {
                  that._renderList(data, (0, _renderer.default)(container));
                },
                name: 'exportButton',
                allowExportSelected: true,
                location: 'after',
                locateInMenu: 'auto',
                sortIndex: 30
              });
            } else {
              exportItems.push({
                template: function template(data, index, container) {
                  that._renderButton(data, (0, _renderer.default)(container));
                },
                menuItemTemplate: function menuItemTemplate(data, index, container) {
                  that._renderButton(data, (0, _renderer.default)(container), true);
                },
                name: 'exportButton',
                location: 'after',
                locateInMenu: 'auto',
                sortIndex: 30
              });
            }

            items = items.concat(exportItems);

            that._correctItemsPosition(items);
          }

          return items;
        },
        _renderButton: function _renderButton(data, $container, withText) {
          var that = this;

          var buttonOptions = that._getButtonOptions(data.allowExportSelected);

          var $buttonContainer = that._getButtonContainer().addClass(DATAGRID_EXPORT_BUTTON_CLASS).appendTo($container);

          if (withText) {
            var wrapperNode = (0, _renderer.default)('<div>').addClass(TOOLBAR_ITEM_AUTO_HIDE_CLASS);
            $container.wrapInner(wrapperNode).parent().addClass('dx-toolbar-menu-action dx-toolbar-menu-button ' + TOOLBAR_HIDDEN_BUTTON_CLASS);
            buttonOptions.text = buttonOptions.hint;
          }

          that._createComponent($buttonContainer, _button.default, buttonOptions);
        },
        _renderList: function _renderList(data, $container) {
          var that = this;
          var texts = that.option('export.texts');
          var items = [{
            template: function template(data, index, container) {
              that._renderFakeButton(data, (0, _renderer.default)(container), DATAGRID_EXPORT_EXCEL_ICON);
            },
            text: texts.exportAll
          }, {
            template: function template(data, index, container) {
              that._renderFakeButton(data, (0, _renderer.default)(container), DATAGRID_EXPORT_SELECTED_ICON);
            },
            text: texts.exportSelectedRows,
            exportSelected: true
          }];

          that._createComponent($container, _list.default, {
            items: items,
            onItemClick: function onItemClick(e) {
              that._exportController.exportToExcel(e.itemData.exportSelected);
            },
            scrollingEnabled: false
          });
        },
        _renderFakeButton: function _renderFakeButton(data, $container, iconName) {
          var $icon = (0, _renderer.default)('<div>').addClass('dx-icon dx-icon-' + iconName);
          var $text = (0, _renderer.default)('<span>').addClass('dx-button-text').text(data.text);
          var $content = (0, _renderer.default)('<div>').addClass('dx-button-content').append($icon).append($text);
          var $button = (0, _renderer.default)('<div>').addClass(BUTTON_CLASS + ' dx-button-has-text dx-button-has-icon dx-datagrid-toolbar-button').append($content);
          var $toolbarItem = (0, _renderer.default)('<div>').addClass(TOOLBAR_ITEM_AUTO_HIDE_CLASS).append($button);
          $container.append($toolbarItem).parent().addClass('dx-toolbar-menu-custom ' + TOOLBAR_HIDDEN_BUTTON_CLASS);
        },
        _correctItemsPosition: function _correctItemsPosition(items) {
          items.sort(function (itemA, itemB) {
            return itemA.sortIndex - itemB.sortIndex;
          });
        },
        _renderExportMenu: function _renderExportMenu($buttonContainer) {
          var that = this;
          var $button = $buttonContainer.find('.' + BUTTON_CLASS);
          var texts = that.option('export.texts');
          var menuItems = [{
            text: texts.exportAll,
            icon: DATAGRID_EXPORT_EXCEL_ICON
          }, {
            text: texts.exportSelectedRows,
            exportSelected: true,
            icon: DATAGRID_EXPORT_SELECTED_ICON
          }];
          var $menuContainer = (0, _renderer.default)('<div>').appendTo($buttonContainer);
          that._contextMenu = that._createComponent($menuContainer, _context_menu.default, {
            showEvent: 'dxclick',
            items: menuItems,
            cssClass: DATAGRID_EXPORT_MENU_CLASS,
            onItemClick: function onItemClick(e) {
              that._exportController.exportToExcel(e.itemData.exportSelected);
            },
            target: $button,
            position: {
              at: 'left bottom',
              my: 'left top',
              offset: '0 3',
              collision: 'fit',
              boundary: that._$parent,
              boundaryOffset: '1 1'
            }
          });
        },
        _isExportButtonVisible: function _isExportButtonVisible() {
          return this.option('export.enabled');
        },
        _getButtonOptions: function _getButtonOptions(allowExportSelected) {
          var that = this;
          var texts = that.option('export.texts');
          var options;

          if (allowExportSelected) {
            options = {
              hint: texts.exportTo,
              icon: DATAGRID_EXPORT_ICON
            };
          } else {
            options = {
              hint: texts.exportAll,
              icon: DATAGRID_EXPORT_EXCEL_BUTTON_ICON,
              onClick: function onClick() {
                that._exportController.exportToExcel();
              }
            };
          }

          return options;
        },
        optionChanged: function optionChanged(args) {
          this.callBase(args);

          if (args.name === 'export') {
            args.handled = true;

            this._invalidate();
          }
        },
        init: function init() {
          var that = this;
          this.callBase();
          this._exportController = this.getController('export');
          this._editingController = this.getController('editing');

          this._editingController.editingChanged.add(function (hasChanges) {
            that.setToolbarItemDisabled('exportButton', hasChanges);
          });
        },
        isVisible: function isVisible() {
          return this.callBase() || this._isExportButtonVisible();
        }
      }
    }
  }
});