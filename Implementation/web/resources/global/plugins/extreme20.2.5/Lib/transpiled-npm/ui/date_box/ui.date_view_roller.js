"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _index = require("../../events/utils/index");

var _click = require("../../events/click");

var _ui = _interopRequireDefault(require("../scroll_view/ui.scrollable"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _fx = _interopRequireDefault(require("../../animation/fx"));

var _translator = require("../../animation/translator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';
var DATEVIEW_ROLLER_ACTIVE_CLASS = 'dx-state-active';
var DATEVIEW_ROLLER_CURRENT_CLASS = 'dx-dateviewroller-current';
var DATEVIEW_ROLLER_ITEM_CLASS = 'dx-dateview-item';
var DATEVIEW_ROLLER_ITEM_SELECTED_CLASS = 'dx-dateview-item-selected';
var DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS = 'dx-dateview-item-selected-frame';
var DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS = 'dx-dateview-item-selected-border';

var DateViewRoller = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      showScrollbar: false,
      useNative: false,
      selectedIndex: 0,
      bounceEnabled: false,
      items: [],
      showOnClick: false,
      onClick: null,
      onSelectedIndexChanged: null
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'generic'
      },
      options: {
        scrollByContent: true
      }
    }]);
  },
  _init: function _init() {
    this.callBase();

    this._renderSelectedItemFrame();
  },
  _render: function _render() {
    this.callBase();
    this.$element().addClass(DATEVIEW_ROLLER_CLASS);

    this._renderContainerClick();

    this._renderItems();

    this._renderSelectedValue();

    this._renderItemsClick();

    this._renderWheelEvent();

    this._wrapAction('_endAction', this._endActionHandler.bind(this));

    this._renderSelectedIndexChanged();
  },
  _renderSelectedIndexChanged: function _renderSelectedIndexChanged() {
    this._selectedIndexChanged = this._createActionByOption('onSelectedIndexChanged');
  },
  _renderWheelEvent: function _renderWheelEvent() {
    var _this = this;

    _events_engine.default.on(this._$container, 'dxmousewheel', function (e) {
      _this._isWheelScrolled = true;
    });
  },
  _renderContainerClick: function _renderContainerClick() {
    if (!this.option('showOnClick')) {
      return;
    }

    var eventName = (0, _index.addNamespace)(_click.name, this.NAME);

    var clickAction = this._createActionByOption('onClick');

    _events_engine.default.off(this._$container, eventName);

    _events_engine.default.on(this._$container, eventName, function (e) {
      clickAction({
        event: e
      });
    });
  },
  _wrapAction: function _wrapAction(actionName, callback) {
    var strategy = this._strategy;
    var originalAction = strategy[actionName];

    strategy[actionName] = function () {
      callback.apply(this, arguments);
      return originalAction.apply(this, arguments);
    };
  },
  _renderItems: function _renderItems() {
    var items = this.option('items') || [];
    var $items = (0, _renderer.default)();

    this._$content.empty(); // NOTE: rendering ~166+30+12+24+60 <div>s >> 50mc


    items.forEach(function (item) {
      $items = $items.add((0, _renderer.default)('<div>').addClass(DATEVIEW_ROLLER_ITEM_CLASS).append(item));
    });

    this._$content.append($items);

    this._$items = $items;
    this.update();
  },
  _renderSelectedItemFrame: function _renderSelectedItemFrame() {
    (0, _renderer.default)('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS).append((0, _renderer.default)('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS)).appendTo(this._$container);
  },
  _renderSelectedValue: function _renderSelectedValue(selectedIndex) {
    var index = this._fitIndex(selectedIndex || this.option('selectedIndex'));

    this._moveTo({
      top: this._getItemPosition(index)
    });

    this._renderActiveStateItem();
  },
  _fitIndex: function _fitIndex(index) {
    var items = this.option('items') || [];
    var itemCount = items.length;

    if (index >= itemCount) {
      return itemCount - 1;
    }

    if (index < 0) {
      return 0;
    }

    return index;
  },
  _getItemPosition: function _getItemPosition(index) {
    return Math.round(this._itemHeight() * index);
  },
  _renderItemsClick: function _renderItemsClick() {
    var itemSelector = this._getItemSelector();

    var eventName = (0, _index.addNamespace)(_click.name, this.NAME);

    _events_engine.default.off(this.$element(), eventName, itemSelector);

    _events_engine.default.on(this.$element(), eventName, itemSelector, this._itemClickHandler.bind(this));
  },
  _getItemSelector: function _getItemSelector() {
    return '.' + DATEVIEW_ROLLER_ITEM_CLASS;
  },
  _itemClickHandler: function _itemClickHandler(e) {
    this.option('selectedIndex', this._itemElementIndex(e.currentTarget));
  },
  _itemElementIndex: function _itemElementIndex(itemElement) {
    return this._itemElements().index(itemElement);
  },
  _itemElements: function _itemElements() {
    return this.$element().find(this._getItemSelector());
  },
  _renderActiveStateItem: function _renderActiveStateItem() {
    var selectedIndex = this.option('selectedIndex');
    (0, _iterator.each)(this._$items, function (index) {
      (0, _renderer.default)(this).toggleClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS, selectedIndex === index);
    });
  },
  _shouldScrollToNeighborItem: function _shouldScrollToNeighborItem() {
    return _devices.default.real().deviceType === 'desktop' && this._isWheelScrolled;
  },
  _moveTo: function _moveTo(targetLocation) {
    targetLocation = this._normalizeLocation(targetLocation);

    var location = this._location();

    var delta = {
      x: -(location.left - targetLocation.left),
      y: -(location.top - targetLocation.top)
    };

    if (this._isVisible() && (delta.x || delta.y)) {
      this._strategy._prepareDirections(true);

      if (this._animation && !this._shouldScrollToNeighborItem()) {
        var that = this;

        _fx.default.stop(this._$content);

        _fx.default.animate(this._$content, {
          duration: 200,
          type: 'slide',
          to: {
            top: Math.floor(delta.y)
          },
          complete: function complete() {
            (0, _translator.resetPosition)(that._$content);

            that._strategy.handleMove({
              delta: delta
            });
          }
        });

        delete this._animation;
      } else {
        this._strategy.handleMove({
          delta: delta
        });
      }
    }
  },
  _validate: function _validate(e) {
    return this._strategy.validate(e);
  },
  _fitSelectedIndexInRange: function _fitSelectedIndexInRange(index) {
    var itemsCount = this.option('items').length;
    return Math.max(Math.min(index, itemsCount - 1), 0);
  },
  _isInNullNeighborhood: function _isInNullNeighborhood(x) {
    var EPS = 0.1;
    return -EPS <= x && x <= EPS;
  },
  _getSelectedIndexAfterScroll: function _getSelectedIndexAfterScroll(currentSelectedIndex) {
    var locationTop = -this._location().top;

    var currentSelectedIndexPosition = currentSelectedIndex * this._itemHeight();

    var dy = locationTop - currentSelectedIndexPosition;

    if (this._isInNullNeighborhood(dy)) {
      return currentSelectedIndex;
    }

    var direction = dy > 0 ? 1 : -1;

    var newSelectedIndex = this._fitSelectedIndexInRange(currentSelectedIndex + direction);

    return newSelectedIndex;
  },
  _getNewSelectedIndex: function _getNewSelectedIndex(currentSelectedIndex) {
    if (this._shouldScrollToNeighborItem()) {
      return this._getSelectedIndexAfterScroll(currentSelectedIndex);
    }

    this._animation = true;

    var ratio = -this._location().top / this._itemHeight();

    return Math.round(ratio);
  },
  _endActionHandler: function _endActionHandler() {
    var currentSelectedIndex = this.option('selectedIndex');

    var newSelectedIndex = this._getNewSelectedIndex(currentSelectedIndex);

    if (newSelectedIndex === currentSelectedIndex) {
      this._renderSelectedValue(newSelectedIndex);
    } else {
      this.option('selectedIndex', newSelectedIndex);
    }

    this._isWheelScrolled = false;
  },
  _itemHeight: function _itemHeight() {
    var $item = this._$items.first();

    return $item.height();
  },
  _toggleActive: function _toggleActive(state) {
    this.$element().toggleClass(DATEVIEW_ROLLER_ACTIVE_CLASS, state);
  },
  _isVisible: function _isVisible() {
    return this._$container.is(':visible');
  },
  _fireSelectedIndexChanged: function _fireSelectedIndexChanged(value, previousValue) {
    this._selectedIndexChanged({
      value: value,
      previousValue: previousValue,
      event: undefined
    });
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    this.callBase(visible);

    if (visible) {
      this._renderSelectedValue(this.option('selectedIndex'));
    }

    this.toggleActiveState(false);
  },
  toggleActiveState: function toggleActiveState(state) {
    this.$element().toggleClass(DATEVIEW_ROLLER_CURRENT_CLASS, state);
  },
  _refreshSelectedIndex: function _refreshSelectedIndex() {
    var selectedIndex = this.option('selectedIndex');

    var fitIndex = this._fitIndex(selectedIndex);

    if (fitIndex === selectedIndex) {
      this._renderActiveStateItem();
    } else {
      this.option('selectedIndex', fitIndex);
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'selectedIndex':
        this._fireSelectedIndexChanged(args.value, args.previousValue);

        this._renderSelectedValue(args.value);

        break;

      case 'items':
        this._renderItems();

        this._refreshSelectedIndex();

        break;

      case 'onClick':
      case 'showOnClick':
        this._renderContainerClick();

        break;

      case 'onSelectedIndexChanged':
        this._renderSelectedIndexChanged();

        break;

      default:
        this.callBase(args);
    }
  }
});

(0, _component_registrator.default)('dxDateViewRoller', DateViewRoller);
var _default = DateViewRoller;
exports.default = _default;
module.exports = exports.default;