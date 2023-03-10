"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _array = require("../../core/utils/array");

var _type = require("../../core/utils/type");

var _deferred = require("../../core/utils/deferred");

var _hold = _interopRequireDefault(require("../../events/hold"));

var _index = require("../../events/utils/index");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _bindable_template = require("../../core/templates/bindable_template");

var _scroll_view = _interopRequireDefault(require("../scroll_view"));

var _uiCollection_widget = _interopRequireDefault(require("../collection/ui.collection_widget.edit"));

var _selection = _interopRequireDefault(require("../selection/selection"));

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

var FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS = 'dx-filemanager-thumbnails-view-port';
var FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS = 'dx-filemanager-thumbnails-container';
var FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
var FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS = 'dx-filemanager-thumbnails-item-name';
var FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS = 'dx-filemanager-thumbnails-item-spacer';
var FILE_MANAGER_THUMBNAILS_ITEM_DATA_KEY = 'dxFileManagerItemData';
var FILE_MANAGER_THUMBNAILS_LIST_BOX_NAMESPACE = 'dxFileManagerThumbnailsListBox';
var FILE_MANAGER_THUMBNAILS_LIST_BOX_HOLD_EVENT_NAME = (0, _index.addNamespace)(_hold.default.name, FILE_MANAGER_THUMBNAILS_LIST_BOX_NAMESPACE);

var FileManagerThumbnailListBox = /*#__PURE__*/function (_CollectionWidget) {
  _inherits(FileManagerThumbnailListBox, _CollectionWidget);

  var _super = _createSuper(FileManagerThumbnailListBox);

  function FileManagerThumbnailListBox() {
    _classCallCheck(this, FileManagerThumbnailListBox);

    return _super.apply(this, arguments);
  }

  _createClass(FileManagerThumbnailListBox, [{
    key: "_initMarkup",
    value: function _initMarkup() {
      this._initActions();

      this._lockFocusedItemProcessing = false;
      this.$element().addClass(FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS);

      this._renderScrollView();

      this._renderItemsContainer();

      this._createScrollViewControl();

      _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_initMarkup", this).call(this);

      this.onFocusedItemChanged = this._onFocusedItemChanged.bind(this);
      this._layoutUtils = new ListBoxLayoutUtils(this._scrollView, this.$element(), this._$itemContainer, this.itemElements().first());

      this._syncFocusedItemKey();
    }
  }, {
    key: "_initActions",
    value: function _initActions() {
      this._actions = {
        onItemEnterKeyPressed: this._createActionByOption('onItemEnterKeyPressed'),
        onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged')
      };
    }
  }, {
    key: "_initTemplates",
    value: function _initTemplates() {
      _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_initTemplates", this).call(this);

      this._itemThumbnailTemplate = this.option('itemThumbnailTemplate');
      this._getTooltipText = this.option('getTooltipText');

      this._templateManager.addDefaultTemplates({
        item: new _bindable_template.BindableTemplate(function ($container, data, itemModel) {
          var $itemElement = this._getDefaultItemTemplate(itemModel, $container);

          $container.append($itemElement);
        }.bind(this), ['fileItem'], this.option('integrationOptions.watchMethod'))
      });
    }
  }, {
    key: "_createScrollViewControl",
    value: function _createScrollViewControl() {
      if (!this._scrollView) {
        this._scrollView = this._createComponent(this._$scrollView, _scroll_view.default, {
          scrollByContent: true,
          scrollByThumb: true,
          useKeyboard: false,
          showScrollbar: 'onHover'
        });
      }
    }
  }, {
    key: "_renderScrollView",
    value: function _renderScrollView() {
      if (!this._$scrollView) {
        this._$scrollView = (0, _renderer.default)('<div>').appendTo(this.$element());
      }
    }
  }, {
    key: "_renderItemsContainer",
    value: function _renderItemsContainer() {
      if (!this._$itemContainer) {
        this._$itemContainer = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS).appendTo(this._$scrollView);
      }
    }
  }, {
    key: "_render",
    value: function _render() {
      _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_render", this).call(this);

      this._detachEventHandlers();

      this._attachEventHandlers();
    }
  }, {
    key: "_clean",
    value: function _clean() {
      this._detachEventHandlers();

      _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_clean", this).call(this);
    }
  }, {
    key: "_supportedKeys",
    value: function _supportedKeys() {
      return (0, _extend.extend)(_get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_supportedKeys", this).call(this), {
        upArrow: function upArrow(e) {
          this._beforeKeyProcessing(e);

          this._processArrowKeys(-1, false, e);
        },
        downArrow: function downArrow(e) {
          this._beforeKeyProcessing(e);

          this._processArrowKeys(1, false, e);
        },
        home: function home(e) {
          this._beforeKeyProcessing(e);

          this._processHomeEndKeys(0, true, e);
        },
        end: function end(e) {
          this._beforeKeyProcessing(e);

          this._processHomeEndKeys(this._getItemsLength() - 1, true, e);
        },
        pageUp: function pageUp(e) {
          this._beforeKeyProcessing(e);

          this._processPageChange(true, e);
        },
        pageDown: function pageDown(e) {
          this._beforeKeyProcessing(e);

          this._processPageChange(false, e);
        },
        enter: function enter(e) {
          this._beforeKeyProcessing(e);

          this._actions.onItemEnterKeyPressed(this._getFocusedItem());
        },
        A: function A(e) {
          this._beforeKeyProcessing(e);

          if ((0, _index.isCommandKeyPressed)(e)) {
            this.selectAll();
          }
        }
      });
    }
  }, {
    key: "_beforeKeyProcessing",
    value: function _beforeKeyProcessing(e) {
      e.preventDefault();

      this._layoutUtils.reset();
    }
  }, {
    key: "_processArrowKeys",
    value: function _processArrowKeys(offset, horizontal, eventArgs) {
      var item = this._getFocusedItem();

      if (item) {
        if (!horizontal) {
          var layout = this._layoutUtils.getLayoutModel();

          if (!layout) {
            return;
          }

          offset *= layout.itemPerRowCount;
        }

        var newItemIndex = this._getIndexByItem(item) + offset;

        this._focusItemByIndex(newItemIndex, true, eventArgs);
      }
    }
  }, {
    key: "_processHomeEndKeys",
    value: function _processHomeEndKeys(index, scrollToItem, eventArgs) {
      this._focusItemByIndex(index, scrollToItem, eventArgs);
    }
  }, {
    key: "_processPageChange",
    value: function _processPageChange(pageUp, eventArgs) {
      var item = this._getFocusedItem();

      if (!item) {
        return;
      }

      var layout = this._layoutUtils.getLayoutModel();

      if (!layout) {
        return;
      }

      var itemLayout = this._layoutUtils.createItemLayoutModel(this._getIndexByItem(item));

      var rowOffset = pageUp ? layout.rowPerPageRate : -layout.rowPerPageRate;
      var newRowRate = itemLayout.itemRowIndex - rowOffset;
      var roundFunc = pageUp ? Math.ceil : Math.floor;
      var newRowIndex = roundFunc(newRowRate);
      var newItemIndex = newRowIndex * layout.itemPerRowCount + itemLayout.itemColumnIndex;

      if (newItemIndex < 0) {
        newItemIndex = 0;
      } else if (newItemIndex >= this._getItemsLength()) {
        newItemIndex = this._getItemsLength() - 1;
      }

      this._focusItemByIndex(newItemIndex, true, eventArgs);
    }
  }, {
    key: "_processLongTap",
    value: function _processLongTap(e) {
      var $targetItem = this._closestItemElement((0, _renderer.default)(e.target));

      var itemIndex = this._getIndexByItemElement($targetItem);

      this._selection.changeItemSelection(itemIndex, {
        control: true
      });
    }
  }, {
    key: "_attachEventHandlers",
    value: function _attachEventHandlers() {
      var _this = this;

      if (this.option('selectionMode') === 'multiple') {
        _events_engine.default.on(this._itemContainer(), FILE_MANAGER_THUMBNAILS_LIST_BOX_HOLD_EVENT_NAME, ".".concat(this._itemContentClass()), function (e) {
          _this._processLongTap(e);

          e.stopPropagation();
        });
      }

      _events_engine.default.on(this._itemContainer(), 'mousedown selectstart', function (e) {
        if (e.shiftKey) {
          e.preventDefault();
        }
      });
    }
  }, {
    key: "_detachEventHandlers",
    value: function _detachEventHandlers() {
      _events_engine.default.off(this._itemContainer(), FILE_MANAGER_THUMBNAILS_LIST_BOX_HOLD_EVENT_NAME);

      _events_engine.default.off(this._itemContainer(), 'mousedown selectstart');
    }
  }, {
    key: "_itemContainer",
    value: function _itemContainer() {
      return this._$itemContainer;
    }
  }, {
    key: "_itemClass",
    value: function _itemClass() {
      return FILE_MANAGER_THUMBNAILS_ITEM_CLASS;
    }
  }, {
    key: "_itemDataKey",
    value: function _itemDataKey() {
      return FILE_MANAGER_THUMBNAILS_ITEM_DATA_KEY;
    }
  }, {
    key: "_getDefaultItemTemplate",
    value: function _getDefaultItemTemplate(fileItemInfo, $itemElement) {
      $itemElement.attr('title', this._getTooltipText(fileItemInfo));

      var $itemThumbnail = this._itemThumbnailTemplate(fileItemInfo);

      var $itemSpacer = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS);
      var $itemName = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS).text(fileItemInfo.fileItem.name);
      $itemElement.append($itemThumbnail, $itemSpacer, $itemName);
    }
  }, {
    key: "_itemSelectHandler",
    value: function _itemSelectHandler(e) {
      var options = {};

      if (this.option('selectionMode') === 'multiple') {
        if (!this._isPreserveSelectionMode) {
          this._isPreserveSelectionMode = (0, _index.isCommandKeyPressed)(e) || e.shiftKey;
        }

        options = {
          control: this._isPreserveSelectionMode,
          shift: e.shiftKey
        };
      }

      var index = this._getIndexByItemElement(e.currentTarget);

      this._selection.changeItemSelection(index, options);
    }
  }, {
    key: "_initSelectionModule",
    value: function _initSelectionModule() {
      var _this2 = this;

      _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_initSelectionModule", this).call(this);

      var options = (0, _extend.extend)(this._selection.options, {
        selectedKeys: this.option('selectedItemKeys'),
        onSelectionChanged: function onSelectionChanged(args) {
          _this2.option('selectedItems', _this2._getItemsByKeys(args.selectedItemKeys, args.selectedItems));

          _this2._updateSelectedItems(args);
        }
      });
      this._selection = new _selection.default(options);
    }
  }, {
    key: "_updateSelectedItems",
    value: function _updateSelectedItems(args) {
      var _this3 = this;

      var addedItemKeys = args.addedItemKeys;
      var removedItemKeys = args.removedItemKeys;

      if (this._rendered && (addedItemKeys.length || removedItemKeys.length)) {
        var selectionChangePromise = this._selectionChangePromise;

        if (!this._rendering) {
          var addedSelection = [];
          var normalizedIndex;
          var removedSelection = [];

          this._editStrategy.beginCache();

          for (var i = 0; i < removedItemKeys.length; i++) {
            normalizedIndex = this._getIndexByKey(removedItemKeys[i]);
            removedSelection.push(normalizedIndex);

            this._removeSelection(normalizedIndex);
          }

          for (var _i = 0; _i < addedItemKeys.length; _i++) {
            normalizedIndex = this._getIndexByKey(addedItemKeys[_i]);
            addedSelection.push(normalizedIndex);

            this._addSelection(normalizedIndex);
          }

          this._editStrategy.endCache();

          this._updateSelection(addedSelection, removedSelection);
        }

        (0, _deferred.when)(selectionChangePromise).done(function () {
          return _this3._fireSelectionChangeEvent(args);
        });
      }
    }
  }, {
    key: "_fireSelectionChangeEvent",
    value: function _fireSelectionChangeEvent(args) {
      this._createActionByOption('onSelectionChanged', {
        excludeValidators: ['disabled', 'readOnly']
      })(args);
    }
  }, {
    key: "_updateSelection",
    value: function _updateSelection(addedSelection, removedSelection) {
      var selectedItemsCount = this.getSelectedItems().length;

      if (selectedItemsCount === 0) {
        this._isPreserveSelectionMode = false;
      }
    }
  }, {
    key: "_normalizeSelectedItems",
    value: function _normalizeSelectedItems() {
      var newKeys = this._getKeysByItems(this.option('selectedItems'));

      var oldKeys = this._selection.getSelectedItemKeys();

      if (!this._compareKeys(oldKeys, newKeys)) {
        this._selection.setSelection(newKeys);
      }

      return new _deferred.Deferred().resolve().promise();
    }
  }, {
    key: "_focusOutHandler",
    value: function _focusOutHandler() {}
  }, {
    key: "_getItems",
    value: function _getItems() {
      return this.option('items') || [];
    }
  }, {
    key: "_getItemsLength",
    value: function _getItemsLength() {
      return this._getItems().length;
    }
  }, {
    key: "_getIndexByItemElement",
    value: function _getIndexByItemElement(itemElement) {
      return this._editStrategy.getNormalizedIndex(itemElement);
    }
  }, {
    key: "_getItemByIndex",
    value: function _getItemByIndex(index) {
      return this._getItems()[index];
    }
  }, {
    key: "_getFocusedItem",
    value: function _getFocusedItem() {
      return this.getItemByItemElement(this.option('focusedElement'));
    }
  }, {
    key: "_focusItem",
    value: function _focusItem(item, scrollToItem) {
      this.option('focusedElement', this.getItemElementByItem(item));

      if (scrollToItem) {
        this._layoutUtils.scrollToItem(this._getIndexByItem(item));
      }
    }
  }, {
    key: "_focusItemByIndex",
    value: function _focusItemByIndex(index, scrollToItem, eventArgs) {
      if (index >= 0 && index < this._getItemsLength()) {
        var item = this._getItemByIndex(index);

        this._focusItem(item, scrollToItem, eventArgs);
      }
    }
  }, {
    key: "_syncFocusedItemKey",
    value: function _syncFocusedItemKey() {
      var _this4 = this;

      if (!this._syncFocusedItemKeyDeferred) {
        this._syncFocusedItemKeyDeferred = new _deferred.Deferred();
      }

      var deferred = this._syncFocusedItemKeyDeferred;

      if (this._dataSource && this._dataSource.isLoading()) {
        return deferred.promise();
      }

      var focusedItemKey = this.option('focusedItemKey');

      if ((0, _type.isDefined)(focusedItemKey)) {
        var items = this.option('items');
        var focusedItem = (0, _array.find)(items, function (item) {
          return _this4.keyOf(item) === focusedItemKey;
        });

        if (focusedItem) {
          this._focusItem(focusedItem, true);

          deferred.resolve();
        } else {
          this.option('focusedItemKey', undefined);
          deferred.reject();
        }
      } else {
        deferred.resolve();
      }

      this._syncFocusedItemKeyDeferred = null;
      return deferred.promise();
    }
  }, {
    key: "_onFocusedItemChanged",
    value: function _onFocusedItemChanged() {
      var focusedItem = this._getFocusedItem();

      var newFocusedItemKey = this.keyOf(focusedItem);
      var oldFocusedItemKey = this.option('focusedItemKey');

      if (newFocusedItemKey !== oldFocusedItemKey) {
        this._lockFocusedItemProcessing = true;
        this.option('focusedItemKey', newFocusedItemKey);
        this._lockFocusedItemProcessing = false;

        this._raiseFocusedItemChanged(focusedItem);
      }
    }
  }, {
    key: "_raiseFocusedItemChanged",
    value: function _raiseFocusedItemChanged(focusedItem) {
      var args = {
        item: focusedItem,
        itemElement: this.option('focusedElement')
      };

      this._actions.onFocusedItemChanged(args);
    }
  }, {
    key: "_changeItemSelection",
    value: function _changeItemSelection(item, select) {
      if (this.isItemSelected(item) === select) {
        return;
      }

      var itemElement = this.getItemElementByItem(item);

      var index = this._getIndexByItemElement(itemElement);

      this._selection.changeItemSelection(index, {
        control: this._isPreserveSelectionMode
      });
    }
  }, {
    key: "_chooseSelectOption",
    value: function _chooseSelectOption() {
      return 'selectedItemKeys';
    }
  }, {
    key: "getSelectedItems",
    value: function getSelectedItems() {
      return this._selection.getSelectedItems();
    }
  }, {
    key: "getItemElementByItem",
    value: function getItemElementByItem(item) {
      return this._editStrategy.getItemElement(item);
    }
  }, {
    key: "getItemByItemElement",
    value: function getItemByItemElement(itemElement) {
      return this._getItemByIndex(this._getIndexByItemElement(itemElement));
    }
  }, {
    key: "selectAll",
    value: function selectAll() {
      if (this.option('selectionMode') !== 'multiple') return;

      this._selection.selectAll();

      this._isPreserveSelectionMode = true;
    }
  }, {
    key: "selectItem",
    value: function selectItem(item) {
      this._changeItemSelection(item, true);
    }
  }, {
    key: "deselectItem",
    value: function deselectItem(item) {
      this._changeItemSelection(item, false);
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      this._selection.deselectAll();
    }
  }, {
    key: "_optionChanged",
    value: function _optionChanged(args) {
      var _this5 = this;

      switch (args.name) {
        case 'items':
          if (this._layoutUtils) {
            this._layoutUtils.updateItems(this.itemElements().first());
          }

          _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_optionChanged", this).call(this, args);

          break;

        case 'focusedItemKey':
          if (this._lockFocusedItemProcessing) {
            break;
          }

          if ((0, _type.isDefined)(args.value)) {
            this._syncFocusedItemKey().done(function () {
              var focusedItem = _this5._getFocusedItem();

              _this5._raiseFocusedItemChanged(focusedItem);
            });
          } else {
            this.option('focusedElement', null);

            this._raiseFocusedItemChanged(null);
          }

          break;

        case 'onItemEnterKeyPressed':
        case 'onFocusedItemChanged':
          this._actions[args.name] = this._createActionByOption(args.name);
          break;

        default:
          _get(_getPrototypeOf(FileManagerThumbnailListBox.prototype), "_optionChanged", this).call(this, args);

      }
    }
  }]);

  return FileManagerThumbnailListBox;
}(_uiCollection_widget.default);

var ListBoxLayoutUtils = /*#__PURE__*/function () {
  function ListBoxLayoutUtils(scrollView, $viewPort, $itemContainer, $item) {
    _classCallCheck(this, ListBoxLayoutUtils);

    this._layoutModel = null;
    this._scrollView = scrollView;
    this._$viewPort = $viewPort;
    this._$itemContainer = $itemContainer;
    this._$item = $item;
  }

  _createClass(ListBoxLayoutUtils, [{
    key: "updateItems",
    value: function updateItems($item) {
      this._$item = $item;
    }
  }, {
    key: "reset",
    value: function reset() {
      this._layoutModel = null;
    }
  }, {
    key: "getLayoutModel",
    value: function getLayoutModel() {
      if (!this._layoutModel) {
        this._layoutModel = this._createLayoutModel();
      }

      return this._layoutModel;
    }
  }, {
    key: "_createLayoutModel",
    value: function _createLayoutModel() {
      if (!this._$item) {
        return null;
      }

      var itemWidth = this._$item.outerWidth(true);

      if (itemWidth === 0) {
        return null;
      }

      var itemHeight = this._$item.outerHeight(true);

      var viewPortWidth = this._$itemContainer.innerWidth();

      var viewPortHeight = this._$viewPort.innerHeight();

      var viewPortScrollTop = this._scrollView.scrollTop();

      var viewPortScrollBottom = viewPortScrollTop + viewPortHeight;
      var itemPerRowCount = Math.floor(viewPortWidth / itemWidth);
      var rowPerPageRate = viewPortHeight / itemHeight;
      return {
        itemWidth: itemWidth,
        itemHeight: itemHeight,
        viewPortWidth: viewPortWidth,
        viewPortHeight: viewPortHeight,
        viewPortScrollTop: viewPortScrollTop,
        viewPortScrollBottom: viewPortScrollBottom,
        itemPerRowCount: itemPerRowCount,
        rowPerPageRate: rowPerPageRate
      };
    }
  }, {
    key: "createItemLayoutModel",
    value: function createItemLayoutModel(index) {
      var layout = this.getLayoutModel();

      if (!layout) {
        return null;
      }

      var itemRowIndex = Math.floor(index / layout.itemPerRowCount);
      var itemColumnIndex = index % layout.itemPerRowCount;
      var itemTop = itemRowIndex * layout.itemHeight;
      var itemBottom = itemTop + layout.itemHeight;
      return {
        itemRowIndex: itemRowIndex,
        itemColumnIndex: itemColumnIndex,
        itemTop: itemTop,
        itemBottom: itemBottom
      };
    }
  }, {
    key: "scrollToItem",
    value: function scrollToItem(index) {
      var layout = this.getLayoutModel();

      if (!layout) {
        return;
      }

      var itemRowIndex = Math.floor(index / layout.itemPerRowCount);
      var itemTop = itemRowIndex * layout.itemHeight;
      var itemBottom = itemTop + layout.itemHeight;
      var newScrollTop = layout.viewPortScrollTop;

      if (itemTop < layout.viewPortScrollTop) {
        newScrollTop = itemTop;
      } else if (itemBottom > layout.viewPortScrollBottom) {
        newScrollTop = itemBottom - layout.viewPortHeight;
      }

      this._scrollView.scrollTo(newScrollTop);
    }
  }]);

  return ListBoxLayoutUtils;
}();

var _default = FileManagerThumbnailListBox;
exports.default = _default;
module.exports = exports.default;