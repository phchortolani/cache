"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _common = require("../../core/utils/common");

var _element = require("../../core/element");

var _iterator = require("../../core/utils/iterator");

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _utils = require("../overlay/utils");

var _index = require("../../events/utils/index");

var _pointer = _interopRequireDefault(require("../../events/pointer"));

var _hover = require("../../events/hover");

var _ui = _interopRequireDefault(require("../context_menu/ui.menu_base"));

var _overlay = _interopRequireDefault(require("../overlay"));

var _ui2 = _interopRequireDefault(require("./ui.submenu"));

var _button = _interopRequireDefault(require("../button"));

var _tree_view = _interopRequireDefault(require("../tree_view"));

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

// STYLE menu
var DX_MENU_CLASS = 'dx-menu';
var DX_MENU_VERTICAL_CLASS = DX_MENU_CLASS + '-vertical';
var DX_MENU_HORIZONTAL_CLASS = DX_MENU_CLASS + '-horizontal';
var DX_MENU_ITEM_CLASS = DX_MENU_CLASS + '-item';
var DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + '-items-container';
var DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + '-expanded';
var DX_CONTEXT_MENU_CLASS = 'dx-context-menu';
var DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = DX_CONTEXT_MENU_CLASS + '-container-border';
var DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = 'dx-context-menu-content-delimiter';
var DX_SUBMENU_CLASS = 'dx-submenu';
var DX_STATE_DISABLED_CLASS = 'dx-state-disabled';
var DX_STATE_HOVER_CLASS = 'dx-state-hover';
var DX_STATE_ACTIVE_CLASS = 'dx-state-active';
var DX_ADAPTIVE_MODE_CLASS = DX_MENU_CLASS + '-adaptive-mode';
var DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = DX_MENU_CLASS + '-hamburger-button';
var DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = DX_ADAPTIVE_MODE_CLASS + '-overlay-wrapper';
var FOCUS_UP = 'up';
var FOCUS_DOWN = 'down';
var FOCUS_LEFT = 'left';
var FOCUS_RIGHT = 'right';
var SHOW_SUBMENU_OPERATION = 'showSubmenu';
var NEXTITEM_OPERATION = 'nextItem';
var PREVITEM_OPERATION = 'prevItem';
var DEFAULT_DELAY = {
  'show': 50,
  'hide': 300
};
var ACTIONS = ['onSubmenuShowing', 'onSubmenuShown', 'onSubmenuHiding', 'onSubmenuHidden', 'onItemContextMenu', 'onItemClick', 'onSelectionChanged', 'onItemRendered'];

var Menu = /*#__PURE__*/function (_MenuBase) {
  _inherits(Menu, _MenuBase);

  var _super = _createSuper(Menu);

  function Menu() {
    _classCallCheck(this, Menu);

    return _super.apply(this, arguments);
  }

  _createClass(Menu, [{
    key: "_getDefaultOptions",
    value: function _getDefaultOptions() {
      return (0, _extend.extend)(_get(_getPrototypeOf(Menu.prototype), "_getDefaultOptions", this).call(this), {
        orientation: 'horizontal',
        submenuDirection: 'auto',
        showFirstSubmenuMode: {
          /**
          * @name dxMenuOptions.showFirstSubmenuMode.name
          * @type Enums.ShowSubmenuMode
          * @default "onClick"
          */
          name: 'onClick',

          /**
          * @name dxMenuOptions.showFirstSubmenuMode.delay
          * @type Object|number
          * @default { show: 50, hide: 300 }
          */
          delay: {
            /**
            * @name dxMenuOptions.showFirstSubmenuMode.delay.show
            * @type number
            * @default 50
            */
            show: 50,

            /**
            * @name dxMenuOptions.showFirstSubmenuMode.delay.hide
            * @type number
            * @default 300
            */
            hide: 300
          }
        },
        hideSubmenuOnMouseLeave: false,
        onSubmenuShowing: null,
        onSubmenuShown: null,
        onSubmenuHiding: null,
        onSubmenuHidden: null,
        adaptivityEnabled: false
        /**
        * @name dxMenuOptions.selectedItems
        * @hidden
        */

        /**
        * @name dxMenuOptions.onSelectionChange
        * @hidden
        * @action
        */

        /**
        * @name dxMenuOptions.onItemReordered
        * @hidden
        */

        /**
        * @name dxMenuItem
        * @inherits dxMenuBaseItem
        * @type object
        */

      });
    }
  }, {
    key: "_setOptionsByReference",
    value: function _setOptionsByReference() {
      _get(_getPrototypeOf(Menu.prototype), "_setOptionsByReference", this).call(this);

      (0, _extend.extend)(this._optionsByReference, {
        animation: true,
        selectedItem: true
      });
    }
  }, {
    key: "_itemElements",
    value: function _itemElements() {
      var rootMenuElements = _get(_getPrototypeOf(Menu.prototype), "_itemElements", this).call(this);

      var submenuElements = this._submenuItemElements();

      return rootMenuElements.add(submenuElements);
    }
  }, {
    key: "_submenuItemElements",
    value: function _submenuItemElements() {
      var elements = [];
      var itemSelector = ".".concat(DX_MENU_ITEM_CLASS);
      var currentSubmenu = this._submenus.length && this._submenus[0];

      if (currentSubmenu && currentSubmenu.itemsContainer()) {
        elements = currentSubmenu.itemsContainer().find(itemSelector);
      }

      return elements;
    }
  }, {
    key: "_focusTarget",
    value: function _focusTarget() {
      return this.$element();
    }
  }, {
    key: "_isMenuHorizontal",
    value: function _isMenuHorizontal() {
      return this.option('orientation') === 'horizontal';
    }
  }, {
    key: "_moveFocus",
    value: function _moveFocus(location) {
      var $items = this._getAvailableItems();

      var isMenuHorizontal = this._isMenuHorizontal();

      var $activeItem = this._getActiveItem(true);

      var argument;
      var operation;
      var navigationAction;
      var $newTarget;

      switch (location) {
        case FOCUS_UP:
          operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(PREVITEM_OPERATION);
          argument = isMenuHorizontal ? $activeItem : $items;
          navigationAction = this._getKeyboardNavigationAction(operation, argument);
          $newTarget = navigationAction();
          break;

        case FOCUS_DOWN:
          operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(NEXTITEM_OPERATION);
          argument = isMenuHorizontal ? $activeItem : $items;
          navigationAction = this._getKeyboardNavigationAction(operation, argument);
          $newTarget = navigationAction();
          break;

        case FOCUS_RIGHT:
          operation = isMenuHorizontal ? this._getItemsNavigationOperation(NEXTITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
          argument = isMenuHorizontal ? $items : $activeItem;
          navigationAction = this._getKeyboardNavigationAction(operation, argument);
          $newTarget = navigationAction();
          break;

        case FOCUS_LEFT:
          operation = isMenuHorizontal ? this._getItemsNavigationOperation(PREVITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
          argument = isMenuHorizontal ? $items : $activeItem;
          navigationAction = this._getKeyboardNavigationAction(operation, argument);
          $newTarget = navigationAction();
          break;

        default:
          return _get(_getPrototypeOf(Menu.prototype), "_moveFocus", this).call(this, location);
      }

      if ($newTarget && $newTarget.length !== 0) {
        this.option('focusedElement', (0, _element.getPublicElement)($newTarget));
      }
    }
  }, {
    key: "_getItemsNavigationOperation",
    value: function _getItemsNavigationOperation(operation) {
      var navOperation = operation;

      if (this.option('rtlEnabled')) {
        navOperation = operation === PREVITEM_OPERATION ? NEXTITEM_OPERATION : PREVITEM_OPERATION;
      }

      return navOperation;
    }
  }, {
    key: "_getKeyboardNavigationAction",
    value: function _getKeyboardNavigationAction(operation, argument) {
      var action = _common.noop;

      switch (operation) {
        case SHOW_SUBMENU_OPERATION:
          if (!argument.hasClass(DX_STATE_DISABLED_CLASS)) {
            action = this._showSubmenu.bind(this, argument);
          }

          break;

        case NEXTITEM_OPERATION:
          action = this._nextItem.bind(this, argument);
          break;

        case PREVITEM_OPERATION:
          action = this._prevItem.bind(this, argument);
          break;
      }

      return action;
    }
  }, {
    key: "_clean",
    value: function _clean() {
      _get(_getPrototypeOf(Menu.prototype), "_clean", this).call(this);

      this.option('templatesRenderAsynchronously') && clearTimeout(this._resizeEventTimer);
    }
  }, {
    key: "_visibilityChanged",
    value: function _visibilityChanged(visible) {
      if (visible) {
        if (!this._menuItemsWidth) {
          this._updateItemsWidthCache();
        }

        this._dimensionChanged();
      }
    }
  }, {
    key: "_isAdaptivityEnabled",
    value: function _isAdaptivityEnabled() {
      return this.option('adaptivityEnabled') && this.option('orientation') === 'horizontal';
    }
  }, {
    key: "_updateItemsWidthCache",
    value: function _updateItemsWidthCache() {
      var $menuItems = this.$element().find('ul').first().children('li').children(".".concat(DX_MENU_ITEM_CLASS));
      this._menuItemsWidth = this._getSummaryItemsWidth($menuItems, true);
    }
  }, {
    key: "_dimensionChanged",
    value: function _dimensionChanged() {
      if (!this._isAdaptivityEnabled()) {
        return;
      }

      var containerWidth = this.$element().outerWidth();

      this._toggleAdaptiveMode(this._menuItemsWidth > containerWidth);
    }
  }, {
    key: "_init",
    value: function _init() {
      _get(_getPrototypeOf(Menu.prototype), "_init", this).call(this);

      this._submenus = [];
    }
  }, {
    key: "_initActions",
    value: function _initActions() {
      var _this = this;

      this._actions = {};
      (0, _iterator.each)(ACTIONS, function (index, action) {
        _this._actions[action] = _this._createActionByOption(action);
      });
    }
  }, {
    key: "_initMarkup",
    value: function _initMarkup() {
      this._visibleSubmenu = null;
      this.$element().addClass(DX_MENU_CLASS);

      _get(_getPrototypeOf(Menu.prototype), "_initMarkup", this).call(this);

      this.setAria('role', 'menubar');
    }
  }, {
    key: "_render",
    value: function _render() {
      _get(_getPrototypeOf(Menu.prototype), "_render", this).call(this);

      this._initAdaptivity();
    }
  }, {
    key: "_renderHamburgerButton",
    value: function _renderHamburgerButton() {
      this._hamburger = new _button.default((0, _renderer.default)('<div>').addClass(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS), {
        icon: 'menu',
        activeStateEnabled: false,
        onClick: this._toggleTreeView.bind(this)
      });
      return this._hamburger.$element();
    }
  }, {
    key: "_toggleTreeView",
    value: function _toggleTreeView(state) {
      if ((0, _type.isPlainObject)(state)) {
        state = !this._overlay.option('visible');
      }

      this._overlay.option('visible', state);

      this._toggleHamburgerActiveState(state);
    }
  }, {
    key: "_toggleHamburgerActiveState",
    value: function _toggleHamburgerActiveState(state) {
      this._hamburger && this._hamburger.$element().toggleClass(DX_STATE_ACTIVE_CLASS, state);
    }
  }, {
    key: "_toggleAdaptiveMode",
    value: function _toggleAdaptiveMode(state) {
      var $menuItemsContainer = this.$element().find(".".concat(DX_MENU_HORIZONTAL_CLASS));
      var $adaptiveElements = this.$element().find(".".concat(DX_ADAPTIVE_MODE_CLASS));

      if (state) {
        this._hideVisibleSubmenu();
      } else {
        this._treeView && this._treeView.collapseAll();
        this._overlay && this._toggleTreeView(state);
      }

      $menuItemsContainer.toggle(!state);
      $adaptiveElements.toggle(state);
    }
  }, {
    key: "_removeAdaptivity",
    value: function _removeAdaptivity() {
      if (!this._$adaptiveContainer) {
        return;
      }

      this._toggleAdaptiveMode(false);

      this._$adaptiveContainer.remove();

      this._$adaptiveContainer = null;
      this._treeView = null;
      this._hamburger = null;
      this._overlay = null;
    }
  }, {
    key: "_treeviewItemClickHandler",
    value: function _treeviewItemClickHandler(e) {
      this._actions['onItemClick'](e);

      if (!e.node.children.length) {
        this._toggleTreeView(false);
      }
    }
  }, {
    key: "_getAdaptiveOverlayOptions",
    value: function _getAdaptiveOverlayOptions() {
      var _this2 = this;

      var rtl = this.option('rtlEnabled');
      var position = rtl ? 'right' : 'left';
      return {
        maxHeight: function maxHeight() {
          return (0, _utils.getElementMaxHeightByWindow)(_this2.$element());
        },
        deferRendering: false,
        shading: false,
        animation: false,
        closeOnTargetScroll: true,
        onHidden: function onHidden() {
          _this2._toggleHamburgerActiveState(false);
        },
        height: 'auto',
        closeOnOutsideClick: function closeOnOutsideClick(e) {
          return !(0, _renderer.default)(e.target).closest(".".concat(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS)).length;
        },
        position: {
          collision: 'flipfit',
          at: 'bottom ' + position,
          my: 'top ' + position,
          of: this._hamburger.$element()
        }
      };
    }
  }, {
    key: "_getTreeViewOptions",
    value: function _getTreeViewOptions() {
      var _this3 = this;

      var menuOptions = {};
      var optionsToTransfer = ['rtlEnabled', 'width', 'accessKey', 'activeStateEnabled', 'animation', 'dataSource', 'disabled', 'displayExpr', 'displayExpr', 'focusStateEnabled', 'hint', 'hoverStateEnabled', 'itemsExpr', 'items', 'itemTemplate', 'selectedExpr', 'selectionMode', 'tabIndex', 'visible'];
      var actionsToTransfer = ['onItemContextMenu', 'onSelectionChanged'];
      (0, _iterator.each)(optionsToTransfer, function (_, option) {
        menuOptions[option] = _this3.option(option);
      });
      (0, _iterator.each)(actionsToTransfer, function (_, actionName) {
        menuOptions[actionName] = function (e) {
          _this3._actions[actionName](e);
        };
      });
      return (0, _extend.extend)(menuOptions, {
        dataSource: this.getDataSource(),
        animationEnabled: !!this.option('animation'),
        onItemClick: this._treeviewItemClickHandler.bind(this),
        onItemExpanded: function onItemExpanded(e) {
          _this3._overlay.repaint();

          _this3._actions['onSubmenuShown'](e);
        },
        onItemCollapsed: function onItemCollapsed(e) {
          _this3._overlay.repaint();

          _this3._actions['onSubmenuHidden'](e);
        },
        selectNodesRecursive: false,
        selectByClick: this.option('selectByClick'),
        expandEvent: 'click'
      });
    }
  }, {
    key: "_initAdaptivity",
    value: function _initAdaptivity() {
      if (!this._isAdaptivityEnabled()) return;
      this._$adaptiveContainer = (0, _renderer.default)('<div>').addClass(DX_ADAPTIVE_MODE_CLASS);

      var $hamburger = this._renderHamburgerButton();

      this._treeView = this._createComponent((0, _renderer.default)('<div>'), _tree_view.default, this._getTreeViewOptions());
      this._overlay = this._createComponent((0, _renderer.default)('<div>'), _overlay.default, this._getAdaptiveOverlayOptions());

      this._overlay.$content().append(this._treeView.$element()).addClass(DX_ADAPTIVE_MODE_CLASS).addClass(this.option('cssClass'));

      this._overlay._wrapper().addClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS);

      this._$adaptiveContainer.append($hamburger);

      this._$adaptiveContainer.append(this._overlay.$element());

      this.$element().append(this._$adaptiveContainer);

      this._updateItemsWidthCache();

      this._dimensionChanged();
    }
  }, {
    key: "_getDelay",
    value: function _getDelay(delayType) {
      var delay = this.option('showFirstSubmenuMode').delay;

      if (!(0, _type.isDefined)(delay)) {
        return DEFAULT_DELAY[delayType];
      } else {
        return (0, _type.isObject)(delay) ? delay[delayType] : delay;
      }
    }
  }, {
    key: "_keyboardHandler",
    value: function _keyboardHandler(e) {
      return _get(_getPrototypeOf(Menu.prototype), "_keyboardHandler", this).call(this, e, !!this._visibleSubmenu);
    }
  }, {
    key: "_renderContainer",
    value: function _renderContainer() {
      var $wrapper = (0, _renderer.default)('<div>');
      $wrapper.appendTo(this.$element()).addClass(this._isMenuHorizontal() ? DX_MENU_HORIZONTAL_CLASS : DX_MENU_VERTICAL_CLASS);
      return _get(_getPrototypeOf(Menu.prototype), "_renderContainer", this).call(this, $wrapper);
    }
  }, {
    key: "_renderSubmenuItems",
    value: function _renderSubmenuItems(node, $itemFrame) {
      var submenu = this._createSubmenu(node, $itemFrame);

      this._submenus.push(submenu);

      this._renderBorderElement($itemFrame);

      return submenu;
    }
  }, {
    key: "_getKeyboardListeners",
    value: function _getKeyboardListeners() {
      return _get(_getPrototypeOf(Menu.prototype), "_getKeyboardListeners", this).call(this).concat(this._visibleSubmenu);
    }
  }, {
    key: "_createSubmenu",
    value: function _createSubmenu(node, $rootItem) {
      var $submenuContainer = (0, _renderer.default)('<div>').addClass(DX_CONTEXT_MENU_CLASS).appendTo($rootItem);

      var items = this._getChildNodes(node);

      var result = this._createComponent($submenuContainer, _ui2.default, (0, _extend.extend)(this._getSubmenuOptions(), {
        _dataAdapter: this._dataAdapter,
        _parentKey: node.internalFields.key,
        items: items,
        onHoverStart: this._clearTimeouts.bind(this),
        position: this.getSubmenuPosition($rootItem)
      }));

      this._attachSubmenuHandlers($rootItem, result);

      return result;
    }
  }, {
    key: "_getSubmenuOptions",
    value: function _getSubmenuOptions() {
      var _this4 = this;

      var $submenuTarget = (0, _renderer.default)('<div>');

      var isMenuHorizontal = this._isMenuHorizontal();

      return {
        itemTemplate: this.option('itemTemplate'),
        target: $submenuTarget,
        orientation: this.option('orientation'),
        selectionMode: this.option('selectionMode'),
        cssClass: this.option('cssClass'),
        selectByClick: this.option('selectByClick'),
        hoverStateEnabled: this.option('hoverStateEnabled'),
        activeStateEnabled: this.option('activeStateEnabled'),
        focusStateEnabled: this.option('focusStateEnabled'),
        animation: this.option('animation'),
        showSubmenuMode: this.option('showSubmenuMode'),
        displayExpr: this.option('displayExpr'),
        disabledExpr: this.option('disabledExpr'),
        selectedExpr: this.option('selectedExpr'),
        itemsExpr: this.option('itemsExpr'),
        onFocusedItemChanged: function onFocusedItemChanged(e) {
          if (!e.component.option('visible')) {
            return;
          }

          _this4.option('focusedElement', e.component.option('focusedElement'));
        },
        onSelectionChanged: this._nestedItemOnSelectionChangedHandler.bind(this),
        onItemClick: this._nestedItemOnItemClickHandler.bind(this),
        onItemRendered: this._nestedItemOnItemRenderedHandler.bind(this),
        onLeftFirstItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, PREVITEM_OPERATION),
        onLeftLastItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION),
        onCloseRootSubmenu: this._moveMainMenuFocus.bind(this, isMenuHorizontal ? PREVITEM_OPERATION : null),
        onExpandLastSubmenu: isMenuHorizontal ? this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION) : null
      };
    }
  }, {
    key: "_getShowFirstSubmenuMode",
    value: function _getShowFirstSubmenuMode() {
      if (!this._isDesktopDevice()) {
        return 'onClick';
      }

      var optionValue = this.option('showFirstSubmenuMode');
      return (0, _type.isObject)(optionValue) ? optionValue.name : optionValue;
    }
  }, {
    key: "_moveMainMenuFocus",
    value: function _moveMainMenuFocus(direction) {
      var $items = this._getAvailableItems();

      var itemCount = $items.length;
      var $currentItem = $items.filter(".".concat(DX_MENU_ITEM_EXPANDED_CLASS)).eq(0);
      var itemIndex = $items.index($currentItem);

      this._hideSubmenu(this._visibleSubmenu);

      itemIndex += direction === PREVITEM_OPERATION ? -1 : 1;

      if (itemIndex >= itemCount) {
        itemIndex = 0;
      } else if (itemIndex < 0) {
        itemIndex = itemCount - 1;
      }

      var $newItem = $items.eq(itemIndex);
      this.option('focusedElement', (0, _element.getPublicElement)($newItem));
    }
  }, {
    key: "_nestedItemOnSelectionChangedHandler",
    value: function _nestedItemOnSelectionChangedHandler(args) {
      var selectedItem = args.addedItems.length && args.addedItems[0];

      var submenu = _ui2.default.getInstance(args.element);

      var onSelectionChanged = this._actions['onSelectionChanged'];
      onSelectionChanged(args);
      selectedItem && this._clearSelectionInSubmenus(selectedItem[0], submenu);

      this._clearRootSelection();

      this._setOptionWithoutOptionChange('selectedItem', selectedItem);
    }
  }, {
    key: "_clearSelectionInSubmenus",
    value: function _clearSelectionInSubmenus(item, targetSubmenu) {
      var _this5 = this;

      var cleanAllSubmenus = !arguments.length;
      (0, _iterator.each)(this._submenus, function (index, submenu) {
        var $submenu = submenu._itemContainer();

        var isOtherItem = !$submenu.is(targetSubmenu && targetSubmenu._itemContainer());
        var $selectedItem = $submenu.find(".".concat(_this5._selectedItemClass()));

        if (isOtherItem && $selectedItem.length || cleanAllSubmenus) {
          $selectedItem.removeClass(_this5._selectedItemClass());

          var selectedItemData = _this5._getItemData($selectedItem);

          if (selectedItemData) {
            selectedItemData.selected = false;
          }

          submenu._clearSelectedItems();
        }
      });
    }
  }, {
    key: "_clearRootSelection",
    value: function _clearRootSelection() {
      var $prevSelectedItem = this.$element().find(".".concat(DX_MENU_ITEMS_CONTAINER_CLASS)).first().children().children().filter(".".concat(this._selectedItemClass()));

      if ($prevSelectedItem.length) {
        var prevSelectedItemData = this._getItemData($prevSelectedItem);

        prevSelectedItemData.selected = false;
        $prevSelectedItem.removeClass(this._selectedItemClass());
      }
    }
  }, {
    key: "_nestedItemOnItemClickHandler",
    value: function _nestedItemOnItemClickHandler(e) {
      this._actions['onItemClick'](e);
    }
  }, {
    key: "_nestedItemOnItemRenderedHandler",
    value: function _nestedItemOnItemRenderedHandler(e) {
      this._actions['onItemRendered'](e);
    }
  }, {
    key: "_attachSubmenuHandlers",
    value: function _attachSubmenuHandlers($rootItem, submenu) {
      var _this6 = this;

      var $submenuOverlayContent = submenu.getOverlayContent();
      var submenus = $submenuOverlayContent.find(".".concat(DX_SUBMENU_CLASS));
      var submenuMouseLeaveName = (0, _index.addNamespace)(_hover.end, this.NAME + '_submenu');
      submenu.option({
        onShowing: this._submenuOnShowingHandler.bind(this, $rootItem, submenu),
        onShown: this._submenuOnShownHandler.bind(this, $rootItem, submenu),
        onHiding: this._submenuOnHidingHandler.bind(this, $rootItem, submenu),
        onHidden: this._submenuOnHiddenHandler.bind(this, $rootItem, submenu)
      });
      (0, _iterator.each)(submenus, function (index, submenu) {
        _events_engine.default.off(submenu, submenuMouseLeaveName);

        _events_engine.default.on(submenu, submenuMouseLeaveName, null, _this6._submenuMouseLeaveHandler.bind(_this6, $rootItem));
      });
    }
  }, {
    key: "_submenuOnShowingHandler",
    value: function _submenuOnShowingHandler($rootItem, submenu) {
      var $border = $rootItem.children(".".concat(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS));

      this._actions.onSubmenuShowing({
        rootItem: (0, _element.getPublicElement)($rootItem),
        submenu: submenu
      });

      $border.show();
      $rootItem.addClass(DX_MENU_ITEM_EXPANDED_CLASS);
    }
  }, {
    key: "_submenuOnShownHandler",
    value: function _submenuOnShownHandler($rootItem, submenu) {
      this._actions.onSubmenuShown({
        rootItem: (0, _element.getPublicElement)($rootItem),
        submenu: submenu
      });
    }
  }, {
    key: "_submenuOnHidingHandler",
    value: function _submenuOnHidingHandler($rootItem, submenu, eventArgs) {
      var $border = $rootItem.children(".".concat(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS));
      var args = eventArgs;
      args.rootItem = (0, _element.getPublicElement)($rootItem);
      args.submenu = submenu;

      this._actions.onSubmenuHiding(args);

      eventArgs = args;

      if (!eventArgs.cancel) {
        if (this._visibleSubmenu === submenu) this._visibleSubmenu = null;
        $border.hide();
        $rootItem.removeClass(DX_MENU_ITEM_EXPANDED_CLASS);
      }
    }
  }, {
    key: "_submenuOnHiddenHandler",
    value: function _submenuOnHiddenHandler($rootItem, submenu) {
      this._actions.onSubmenuHidden({
        rootItem: (0, _element.getPublicElement)($rootItem),
        submenu: submenu
      });
    }
  }, {
    key: "_submenuMouseLeaveHandler",
    value: function _submenuMouseLeaveHandler($rootItem, eventArgs) {
      var target = (0, _renderer.default)(eventArgs.relatedTarget).parents(".".concat(DX_CONTEXT_MENU_CLASS))[0];

      var contextMenu = this._getSubmenuByRootElement($rootItem).getOverlayContent()[0];

      if (this.option('hideSubmenuOnMouseLeave') && target !== contextMenu) {
        this._clearTimeouts();

        setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
      }
    }
  }, {
    key: "_hideSubmenuAfterTimeout",
    value: function _hideSubmenuAfterTimeout() {
      if (!this._visibleSubmenu) {
        return;
      }

      var isRootItemHovered = (0, _renderer.default)(this._visibleSubmenu.$element().context).hasClass(DX_STATE_HOVER_CLASS);

      var isSubmenuItemHovered = this._visibleSubmenu.getOverlayContent().find(".".concat(DX_STATE_HOVER_CLASS)).length;

      var hoveredElementFromSubMenu = this._visibleSubmenu.getOverlayContent().get(0).querySelector(':hover');

      if (!hoveredElementFromSubMenu && !isSubmenuItemHovered && !isRootItemHovered) {
        this._visibleSubmenu.hide();
      }
    }
  }, {
    key: "_getSubmenuByRootElement",
    value: function _getSubmenuByRootElement($rootItem) {
      if (!$rootItem) {
        return false;
      }

      var $submenu = $rootItem.children(".".concat(DX_CONTEXT_MENU_CLASS));
      return $submenu.length && _ui2.default.getInstance($submenu);
    }
  }, {
    key: "getSubmenuPosition",
    value: function getSubmenuPosition($rootItem) {
      var isHorizontalMenu = this._isMenuHorizontal();

      var submenuDirection = this.option('submenuDirection').toLowerCase();
      var rtlEnabled = this.option('rtlEnabled');
      var submenuPosition = {
        collision: 'flip',
        of: $rootItem
      };

      switch (submenuDirection) {
        case 'leftortop':
          submenuPosition.at = 'left top';
          submenuPosition.my = isHorizontalMenu ? 'left bottom' : 'right top';
          break;

        case 'rightorbottom':
          submenuPosition.at = isHorizontalMenu ? 'left bottom' : 'right top';
          submenuPosition.my = 'left top';
          break;

        default:
          if (isHorizontalMenu) {
            submenuPosition.at = rtlEnabled ? 'right bottom' : 'left bottom';
            submenuPosition.my = rtlEnabled ? 'right top' : 'left top';
          } else {
            submenuPosition.at = rtlEnabled ? 'left top' : 'right top';
            submenuPosition.my = rtlEnabled ? 'right top' : 'left top';
          }

          break;
      }

      return submenuPosition;
    }
  }, {
    key: "_renderBorderElement",
    value: function _renderBorderElement($item) {
      (0, _renderer.default)('<div>').appendTo($item).addClass(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS).hide();
    }
  }, {
    key: "_itemPointerDownHandler",
    value: function _itemPointerDownHandler(e) {
      var $target = (0, _renderer.default)(e.target);
      var $closestItem = $target.closest(this._itemElements());

      if ($closestItem.hasClass('dx-menu-item-has-submenu')) {
        this.option('focusedElement', null);
        return;
      }

      _get(_getPrototypeOf(Menu.prototype), "_itemPointerDownHandler", this).call(this, e);
    }
  }, {
    key: "_hoverStartHandler",
    value: function _hoverStartHandler(e) {
      var mouseMoveEventName = (0, _index.addNamespace)(_pointer.default.move, this.NAME);

      var $item = this._getItemElementByEventArgs(e);

      var node = this._dataAdapter.getNodeByItem(this._getItemData($item));

      var isSelectionActive = (0, _type.isDefined)(e.buttons) && e.buttons === 1 || !(0, _type.isDefined)(e.buttons) && e.which === 1;

      if (this._isItemDisabled($item)) {
        return;
      }

      _events_engine.default.off($item, mouseMoveEventName);

      if (!this._hasChildren(node)) {
        this._showSubmenuTimer = setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay('hide'));
        return;
      }

      if (this._getShowFirstSubmenuMode() === 'onHover' && !isSelectionActive) {
        var submenu = this._getSubmenuByElement($item);

        this._clearTimeouts();

        if (!submenu.isOverlayVisible()) {
          _events_engine.default.on($item, mouseMoveEventName, this._itemMouseMoveHandler.bind(this));

          this._showSubmenuTimer = this._getDelay('hide');
        }
      }
    }
  }, {
    key: "_hoverEndHandler",
    value: function _hoverEndHandler(eventArg) {
      var _this7 = this;

      var $item = this._getItemElementByEventArgs(eventArg);

      var relatedTarget = (0, _renderer.default)(eventArg.relatedTarget);

      _get(_getPrototypeOf(Menu.prototype), "_hoverEndHandler", this).call(this, eventArg);

      this._clearTimeouts();

      if (this._isItemDisabled($item)) {
        return;
      }

      if (relatedTarget.hasClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)) {
        return;
      }

      if (this.option('hideSubmenuOnMouseLeave') && !relatedTarget.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS)) {
        this._hideSubmenuTimer = setTimeout(function () {
          _this7._hideSubmenuAfterTimeout();
        }, this._getDelay('hide'));
      }
    }
  }, {
    key: "_hideVisibleSubmenu",
    value: function _hideVisibleSubmenu() {
      if (!this._visibleSubmenu) {
        return false;
      }

      this._hideSubmenu(this._visibleSubmenu);

      return true;
    }
  }, {
    key: "_showSubmenu",
    value: function _showSubmenu($itemElement) {
      var submenu = this._getSubmenuByElement($itemElement);

      if (this._visibleSubmenu !== submenu) {
        this._hideVisibleSubmenu();
      }

      if (submenu) {
        this._clearTimeouts();

        submenu.show();
        this.option('focusedElement', submenu.option('focusedElement'));
      }

      this._visibleSubmenu = submenu;
      this._hoveredRootItem = $itemElement;
    }
  }, {
    key: "_hideSubmenu",
    value: function _hideSubmenu(submenu) {
      submenu && submenu.hide();

      if (this._visibleSubmenu === submenu) {
        this._visibleSubmenu = null;
      }

      this._hoveredRootItem = null;
    }
  }, {
    key: "_itemMouseMoveHandler",
    value: function _itemMouseMoveHandler(e) {
      var _this8 = this;

      // todo: replace mousemove with hover event
      if (e.pointers && e.pointers.length) {
        return;
      }

      var $item = (0, _renderer.default)(e.currentTarget);

      if (!(0, _type.isDefined)(this._showSubmenuTimer)) {
        return;
      }

      this._clearTimeouts();

      this._showSubmenuTimer = setTimeout(function () {
        var submenu = _this8._getSubmenuByElement($item);

        if (submenu && !submenu.isOverlayVisible()) {
          _this8._showSubmenu($item);
        }
      }, this._getDelay('show'));
    }
  }, {
    key: "_clearTimeouts",
    value: function _clearTimeouts() {
      clearTimeout(this._hideSubmenuTimer);
      clearTimeout(this._showSubmenuTimer);
    }
  }, {
    key: "_getSubmenuByElement",
    value: function _getSubmenuByElement($itemElement, itemData) {
      var submenu = this._getSubmenuByRootElement($itemElement);

      if (submenu) {
        return submenu;
      } else {
        itemData = itemData || this._getItemData($itemElement);

        var node = this._dataAdapter.getNodeByItem(itemData);

        return this._hasChildren(node) && this._renderSubmenuItems(node, $itemElement);
      }
    }
  }, {
    key: "_updateSubmenuVisibilityOnClick",
    value: function _updateSubmenuVisibilityOnClick(actionArgs) {
      var args = actionArgs.args.length && actionArgs.args[0];

      if (!args || this._disabledGetter(args.itemData)) {
        return;
      }

      var $itemElement = (0, _renderer.default)(args.itemElement);

      var currentSubmenu = this._getSubmenuByElement($itemElement, args.itemData);

      this._updateSelectedItemOnClick(actionArgs);

      if (this._visibleSubmenu) {
        if (this._visibleSubmenu === currentSubmenu) {
          if (this.option('showFirstSubmenuMode') === 'onClick') this._hideSubmenu(this._visibleSubmenu);
          return;
        } else {
          this._hideSubmenu(this._visibleSubmenu);
        }
      }

      if (!currentSubmenu) {
        return;
      }

      if (!currentSubmenu.isOverlayVisible()) {
        this._showSubmenu($itemElement);

        return;
      }
    }
  }, {
    key: "_optionChanged",
    value: function _optionChanged(args) {
      if (ACTIONS.indexOf(args.name) >= 0) {
        this._initActions();

        return;
      }

      switch (args.name) {
        case 'orientation':
        case 'submenuDirection':
          this._invalidate();

          break;

        case 'showFirstSubmenuMode':
        case 'hideSubmenuOnMouseLeave':
          break;

        case 'showSubmenuMode':
          this._changeSubmenusOption(args.name, args.value);

          break;

        case 'adaptivityEnabled':
          args.value ? this._initAdaptivity() : this._removeAdaptivity();
          break;

        case 'width':
          if (this._isAdaptivityEnabled()) {
            this._treeView.option(args.name, args.value);

            this._overlay.option(args.name, args.value);
          }

          _get(_getPrototypeOf(Menu.prototype), "_optionChanged", this).call(this, args);

          this._dimensionChanged();

          break;

        case 'animation':
          if (this._isAdaptivityEnabled()) {
            this._treeView.option('animationEnabled', !!args.value);
          }

          _get(_getPrototypeOf(Menu.prototype), "_optionChanged", this).call(this, args);

          break;

        default:
          if (this._isAdaptivityEnabled()) {
            this._treeView.option(args.name, args.value);
          }

          _get(_getPrototypeOf(Menu.prototype), "_optionChanged", this).call(this, args);

      }
    }
  }, {
    key: "_changeSubmenusOption",
    value: function _changeSubmenusOption(name, value) {
      (0, _iterator.each)(this._submenus, function (index, submenu) {
        submenu.option(name, value);
      });
    }
  }, {
    key: "selectItem",
    value: function selectItem(itemElement) {
      this._hideSubmenu(this._visibleSubmenu);

      _get(_getPrototypeOf(Menu.prototype), "selectItem", this).call(this, itemElement);
    }
  }, {
    key: "unselectItem",
    value: function unselectItem(itemElement) {
      this._hideSubmenu(this._visibleSubmenu);

      _get(_getPrototypeOf(Menu.prototype), "selectItem", this).call(this, itemElement);
    }
  }]);

  return Menu;
}(_ui.default);

(0, _component_registrator.default)('dxMenu', Menu);
var _default = Menu;
exports.default = _default;
module.exports = exports.default;