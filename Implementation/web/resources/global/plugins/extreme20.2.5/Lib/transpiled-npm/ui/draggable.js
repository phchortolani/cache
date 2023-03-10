"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _window = require("../core/utils/window");

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _string = require("../core/utils/string");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _translator = require("../animation/translator");

var _animator = _interopRequireDefault(require("./scroll_view/animator"));

var _browser = _interopRequireDefault(require("../core/utils/browser"));

var _inflector = require("../core/utils/inflector");

var _extend = require("../core/utils/extend");

var _dom_component = _interopRequireDefault(require("../core/dom_component"));

var _element = require("../core/element");

var _index = require("../events/utils/index");

var _pointer = _interopRequireDefault(require("../events/pointer"));

var _drag = require("../events/drag");

var _position = _interopRequireDefault(require("../animation/position"));

var _type = require("../core/utils/type");

var _common = require("../core/utils/common");

var _view_port = require("../core/utils/view_port");

var _empty_template = require("../core/templates/empty_template");

var _deferred = require("../core/utils/deferred");

var _position2 = require("../core/utils/position");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var window = (0, _window.getWindow)();
var DRAGGABLE = 'dxDraggable';
var DRAGSTART_EVENT_NAME = (0, _index.addNamespace)(_drag.start, DRAGGABLE);
var DRAG_EVENT_NAME = (0, _index.addNamespace)(_drag.move, DRAGGABLE);
var DRAGEND_EVENT_NAME = (0, _index.addNamespace)(_drag.end, DRAGGABLE);
var DRAG_ENTER_EVENT_NAME = (0, _index.addNamespace)(_drag.enter, DRAGGABLE);
var DRAGEND_LEAVE_EVENT_NAME = (0, _index.addNamespace)(_drag.leave, DRAGGABLE);
var POINTERDOWN_EVENT_NAME = (0, _index.addNamespace)(_pointer.default.down, DRAGGABLE);
var CLONE_CLASS = 'clone';
var targetDraggable;
var sourceDraggable;
var ANONYMOUS_TEMPLATE_NAME = 'content';

var getMousePosition = function getMousePosition(event) {
  return {
    x: event.pageX - (0, _renderer.default)(window).scrollLeft(),
    y: event.pageY - (0, _renderer.default)(window).scrollTop()
  };
};

var ScrollHelper = /*#__PURE__*/function () {
  function ScrollHelper(orientation, component) {
    _classCallCheck(this, ScrollHelper);

    this._preventScroll = true;
    this._component = component;

    if (orientation === 'vertical') {
      this._scrollValue = 'scrollTop';
      this._overFlowAttr = 'overflowY';
      this._sizeAttr = 'height';
      this._scrollSizeProp = 'scrollHeight';
      this._clientSizeProp = 'clientHeight';
      this._limitProps = {
        start: 'top',
        end: 'bottom'
      };
    } else {
      this._scrollValue = 'scrollLeft';
      this._overFlowAttr = 'overflowX';
      this._sizeAttr = 'width';
      this._scrollSizeProp = 'scrollWidth';
      this._clientSizeProp = 'clientWidth';
      this._limitProps = {
        start: 'left',
        end: 'right'
      };
    }
  }

  _createClass(ScrollHelper, [{
    key: "updateScrollable",
    value: function updateScrollable(elements, mousePosition) {
      var that = this;

      if (!elements.some(function (element) {
        return that._trySetScrollable(element, mousePosition);
      })) {
        that._$scrollableAtPointer = null;
        that._scrollSpeed = 0;
      }
    }
  }, {
    key: "isScrolling",
    value: function isScrolling() {
      return !!this._scrollSpeed;
    }
  }, {
    key: "isScrollable",
    value: function isScrollable($element) {
      var that = this;
      return ($element.css(that._overFlowAttr) === 'auto' || $element.hasClass('dx-scrollable-container')) && $element.prop(that._scrollSizeProp) > $element[that._sizeAttr]();
    }
  }, {
    key: "_trySetScrollable",
    value: function _trySetScrollable(element, mousePosition) {
      var that = this;
      var $element = (0, _renderer.default)(element);
      var distanceToBorders;

      var sensitivity = that._component.option('scrollSensitivity');

      var isScrollable = that.isScrollable($element);

      if (isScrollable) {
        distanceToBorders = that._calculateDistanceToBorders($element, mousePosition);

        if (sensitivity > distanceToBorders[that._limitProps.start]) {
          if (!that._preventScroll) {
            that._scrollSpeed = -that._calculateScrollSpeed(distanceToBorders[that._limitProps.start]);
            that._$scrollableAtPointer = $element;
          }
        } else if (sensitivity > distanceToBorders[that._limitProps.end]) {
          if (!that._preventScroll) {
            that._scrollSpeed = that._calculateScrollSpeed(distanceToBorders[that._limitProps.end]);
            that._$scrollableAtPointer = $element;
          }
        } else {
          isScrollable = false;
          that._preventScroll = false;
        }
      }

      return isScrollable;
    }
  }, {
    key: "_calculateDistanceToBorders",
    value: function _calculateDistanceToBorders($area, mousePosition) {
      var area = $area.get(0);
      var areaBoundingRect;

      if (area) {
        areaBoundingRect = (0, _position2.getBoundingRect)(area);
        return {
          left: mousePosition.x - areaBoundingRect.left,
          top: mousePosition.y - areaBoundingRect.top,
          right: areaBoundingRect.right - mousePosition.x,
          bottom: areaBoundingRect.bottom - mousePosition.y
        };
      } else {
        return {};
      }
    }
  }, {
    key: "_calculateScrollSpeed",
    value: function _calculateScrollSpeed(distance) {
      var component = this._component;
      var sensitivity = component.option('scrollSensitivity');
      var maxSpeed = component.option('scrollSpeed');
      return Math.ceil(Math.pow((sensitivity - distance) / sensitivity, 2) * maxSpeed);
    }
  }, {
    key: "scrollByStep",
    value: function scrollByStep() {
      var that = this;

      if (that._$scrollableAtPointer && that._scrollSpeed) {
        if (that._$scrollableAtPointer.hasClass('dx-scrollable-container')) {
          var $scrollable = that._$scrollableAtPointer.closest('.dx-scrollable');

          var scrollableInstance = $scrollable.data('dxScrollable') || $scrollable.data('dxScrollView');

          if (scrollableInstance) {
            var nextScrollPosition = scrollableInstance.scrollOffset()[that._limitProps.start] + that._scrollSpeed;

            scrollableInstance.scrollTo(_defineProperty({}, that._limitProps.start, nextScrollPosition));
          }
        } else {
          var _nextScrollPosition = that._$scrollableAtPointer[that._scrollValue]() + that._scrollSpeed;

          that._$scrollableAtPointer[that._scrollValue](_nextScrollPosition);
        }

        var dragMoveArgs = that._component._dragMoveArgs;

        if (dragMoveArgs) {
          that._component._dragMoveHandler(dragMoveArgs);
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this._$scrollableAtPointer = null;
      this._scrollSpeed = 0;
      this._preventScroll = true;
    }
  }, {
    key: "isOutsideScrollable",
    value: function isOutsideScrollable($scrollable, event) {
      if (!$scrollable) {
        return false;
      }

      var scrollableSize = (0, _position2.getBoundingRect)($scrollable.get(0));
      var start = scrollableSize[this._limitProps.start];
      var size = scrollableSize[this._sizeAttr];
      var mousePosition = getMousePosition(event);
      var location = this._sizeAttr === 'width' ? mousePosition.x : mousePosition.y;
      return location < start || location > start + size;
    }
  }]);

  return ScrollHelper;
}();

var ScrollAnimator = _animator.default.inherit({
  ctor: function ctor(strategy) {
    this.callBase();
    this._strategy = strategy;
  },
  _step: function _step() {
    var horizontalScrollHelper = this._strategy._horizontalScrollHelper;
    var verticalScrollHelper = this._strategy._verticalScrollHelper;
    horizontalScrollHelper && horizontalScrollHelper.scrollByStep();
    verticalScrollHelper && verticalScrollHelper.scrollByStep();
  }
});

var Draggable = _dom_component.default.inherit({
  reset: _common.noop,
  dragMove: _common.noop,
  dragEnter: _common.noop,
  dragLeave: _common.noop,
  dragEnd: function dragEnd(sourceEvent) {
    var sourceDraggable = this._getSourceDraggable();

    sourceDraggable._fireRemoveEvent(sourceEvent);

    return new _deferred.Deferred().resolve();
  },
  _fireRemoveEvent: _common.noop,
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      onDragStart: null,
      onDragMove: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragLeave: null,

      /**
       * @name dxDraggableOptions.onDrop
       * @type function(e)
       * @extends Action
       * @type_function_param1 e:object
       * @type_function_param1_field4 event:event
       * @type_function_param1_field5 itemData:any
       * @type_function_param1_field6 itemElement:dxElement
       * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 fromData:any
       * @type_function_param1_field10 toData:any
       * @action
       * @hidden
       */
      onDrop: null,
      immediate: true,
      dragDirection: 'both',
      boundary: undefined,
      boundOffset: 0,
      allowMoveByClick: false,
      itemData: null,
      container: undefined,
      dragTemplate: undefined,

      /**
       * @name DraggableBaseOptions.contentTemplate
       * @type template|function
       * @type_function_return string|Element|jQuery
       * @hidden
       * @default "content"
       */
      contentTemplate: 'content',
      handle: '',

      /**
       * @name dxDraggableOptions.filter
       * @type string
       * @default ""
       * @hidden
       */
      filter: '',
      clone: false,
      autoScroll: true,
      scrollSpeed: 30,
      scrollSensitivity: 60,
      group: undefined,
      data: undefined
      /**
       * @name DraggableBaseOptions.cursorOffset.x
       * @type number
       * @default 0
       */

      /**
       * @name DraggableBaseOptions.cursorOffset.y
       * @type number
       * @default 0
       */

    });
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase.apply(this, arguments);
    (0, _extend.extend)(this._optionsByReference, {
      component: true,
      group: true,
      itemData: true,
      data: true
    });
  },
  _init: function _init() {
    this.callBase();

    this._attachEventHandlers();

    this._scrollAnimator = new ScrollAnimator(this);
    this._horizontalScrollHelper = new ScrollHelper('horizontal', this);
    this._verticalScrollHelper = new ScrollHelper('vertical', this);
  },
  _normalizeCursorOffset: function _normalizeCursorOffset(offset) {
    if ((0, _type.isObject)(offset)) {
      offset = {
        h: offset.x,
        v: offset.y
      };
    }

    offset = (0, _common.splitPair)(offset).map(function (value) {
      return parseFloat(value);
    });
    return {
      left: offset[0],
      top: offset.length === 1 ? offset[0] : offset[1]
    };
  },
  _getNormalizedCursorOffset: function _getNormalizedCursorOffset(offset, options) {
    if ((0, _type.isFunction)(offset)) {
      offset = offset.call(this, options);
    }

    return this._normalizeCursorOffset(offset);
  },
  _calculateElementOffset: function _calculateElementOffset(options) {
    var elementOffset;
    var dragElementOffset;
    var event = options.event;
    var $element = (0, _renderer.default)(options.itemElement);
    var $dragElement = (0, _renderer.default)(options.dragElement);

    var isCloned = this._dragElementIsCloned();

    var cursorOffset = this.option('cursorOffset');
    var normalizedCursorOffset = {
      left: 0,
      top: 0
    };
    var currentLocate = this._initialLocate = (0, _translator.locate)($dragElement);

    if (isCloned || options.initialOffset || cursorOffset) {
      elementOffset = options.initialOffset || $element.offset();

      if (cursorOffset) {
        normalizedCursorOffset = this._getNormalizedCursorOffset(cursorOffset, options);

        if (isFinite(normalizedCursorOffset.left)) {
          elementOffset.left = event.pageX;
        }

        if (isFinite(normalizedCursorOffset.top)) {
          elementOffset.top = event.pageY;
        }
      }

      dragElementOffset = $dragElement.offset();
      elementOffset.top -= dragElementOffset.top + (normalizedCursorOffset.top || 0) - currentLocate.top;
      elementOffset.left -= dragElementOffset.left + (normalizedCursorOffset.left || 0) - currentLocate.left;
    }

    return elementOffset;
  },
  _initPosition: function _initPosition(options) {
    var $dragElement = (0, _renderer.default)(options.dragElement);

    var elementOffset = this._calculateElementOffset(options);

    if (elementOffset) {
      this._move(elementOffset, $dragElement);
    }

    this._startPosition = (0, _translator.locate)($dragElement);
  },
  _startAnimator: function _startAnimator() {
    if (!this._scrollAnimator.inProgress()) {
      this._scrollAnimator.start();
    }
  },
  _stopAnimator: function _stopAnimator() {
    this._scrollAnimator.stop();
  },
  _addWidgetPrefix: function _addWidgetPrefix(className) {
    var componentName = this.NAME;
    return (0, _inflector.dasherize)(componentName) + (className ? '-' + className : '');
  },
  _getItemsSelector: function _getItemsSelector() {
    return this.option('filter') || '';
  },
  _$content: function _$content() {
    var $element = this.$element();
    var $wrapper = $element.children('.dx-template-wrapper');
    return $wrapper.length ? $wrapper : $element;
  },
  _attachEventHandlers: function _attachEventHandlers() {
    var _this = this;

    if (this.option('disabled')) {
      return;
    }

    var $element = this._$content();

    var itemsSelector = this._getItemsSelector();

    var allowMoveByClick = this.option('allowMoveByClick');
    var data = {
      direction: this.option('dragDirection'),
      immediate: this.option('immediate'),
      checkDropTarget: function checkDropTarget($target, event) {
        var targetGroup = _this.option('group');

        var sourceGroup = _this._getSourceDraggable().option('group');

        var $scrollable = _this._getScrollable($target);

        if (_this._verticalScrollHelper.isOutsideScrollable($scrollable, event) || _this._horizontalScrollHelper.isOutsideScrollable($scrollable, event)) {
          return false;
        }

        return sourceGroup && sourceGroup === targetGroup;
      }
    };

    if (allowMoveByClick) {
      $element = this._getArea();

      _events_engine.default.on($element, POINTERDOWN_EVENT_NAME, data, this._pointerDownHandler.bind(this));
    }

    if (itemsSelector[0] === '>') {
      itemsSelector = itemsSelector.slice(1);
    }

    _events_engine.default.on($element, DRAGSTART_EVENT_NAME, itemsSelector, data, this._dragStartHandler.bind(this));

    _events_engine.default.on($element, DRAG_EVENT_NAME, data, this._dragMoveHandler.bind(this));

    _events_engine.default.on($element, DRAGEND_EVENT_NAME, data, this._dragEndHandler.bind(this));

    _events_engine.default.on($element, DRAG_ENTER_EVENT_NAME, data, this._dragEnterHandler.bind(this));

    _events_engine.default.on($element, DRAGEND_LEAVE_EVENT_NAME, data, this._dragLeaveHandler.bind(this));
  },
  _dragElementIsCloned: function _dragElementIsCloned() {
    return this._$dragElement && this._$dragElement.hasClass(this._addWidgetPrefix(CLONE_CLASS));
  },
  _getDragTemplateArgs: function _getDragTemplateArgs($element, $container) {
    return {
      container: (0, _element.getPublicElement)($container),
      model: {
        itemData: this.option('itemData'),
        itemElement: (0, _element.getPublicElement)($element)
      }
    };
  },
  _createDragElement: function _createDragElement($element) {
    var result = $element;
    var clone = this.option('clone');

    var $container = this._getContainer();

    var template = this.option('dragTemplate');

    if (template) {
      template = this._getTemplate(template);
      result = (0, _renderer.default)('<div>').appendTo($container);
      template.render(this._getDragTemplateArgs($element, result));
    } else if (clone) {
      result = (0, _renderer.default)('<div>').appendTo($container);
      $element.clone().css({
        width: $element.css('width'),
        height: $element.css('height')
      }).appendTo(result);
    }

    return result.toggleClass(this._addWidgetPrefix(CLONE_CLASS), result.get(0) !== $element.get(0)).toggleClass('dx-rtl', this.option('rtlEnabled'));
  },
  _resetDragElement: function _resetDragElement() {
    if (this._dragElementIsCloned()) {
      this._$dragElement.remove();
    } else {
      this._toggleDraggingClass(false);
    }

    this._$dragElement = null;
  },
  _resetSourceElement: function _resetSourceElement() {
    this._toggleDragSourceClass(false);

    this._$sourceElement = null;
  },
  _detachEventHandlers: function _detachEventHandlers() {
    _events_engine.default.off(this._$content(), '.' + DRAGGABLE);

    _events_engine.default.off(this._getArea(), '.' + DRAGGABLE);
  },
  _move: function _move(position, $element) {
    (0, _translator.move)($element || this._$dragElement, position);
  },
  _getDraggableElement: function _getDraggableElement(e) {
    var $sourceElement = this._getSourceElement();

    if ($sourceElement) {
      return $sourceElement;
    }

    var allowMoveByClick = this.option('allowMoveByClick');

    if (allowMoveByClick) {
      return this.$element();
    }

    var $target = (0, _renderer.default)(e && e.target);

    var itemsSelector = this._getItemsSelector();

    if (itemsSelector[0] === '>') {
      var $items = this._$content().find(itemsSelector);

      if (!$items.is($target)) {
        $target = $target.closest($items);
      }
    }

    return $target;
  },
  _getSourceElement: function _getSourceElement() {
    var draggable = this._getSourceDraggable();

    return draggable._$sourceElement;
  },
  _pointerDownHandler: function _pointerDownHandler(e) {
    if ((0, _index.needSkipEvent)(e)) {
      return;
    }

    var position = {};
    var $element = this.$element();
    var dragDirection = this.option('dragDirection');

    if (dragDirection === 'horizontal' || dragDirection === 'both') {
      position.left = e.pageX - $element.offset().left + (0, _translator.locate)($element).left - $element.width() / 2;
    }

    if (dragDirection === 'vertical' || dragDirection === 'both') {
      position.top = e.pageY - $element.offset().top + (0, _translator.locate)($element).top - $element.height() / 2;
    }

    this._move(position, $element);

    this._getAction('onDragMove')(this._getEventArgs(e));
  },
  _isValidElement: function _isValidElement(event, $element) {
    var handle = this.option('handle');
    var $target = (0, _renderer.default)(event.originalEvent && event.originalEvent.target);

    if (handle && !$target.closest(handle).length) {
      return false;
    }

    if (!$element.length) {
      return false;
    }

    return !$element.is('.dx-state-disabled, .dx-state-disabled *');
  },
  _dragStartHandler: function _dragStartHandler(e) {
    var $element = this._getDraggableElement(e);

    if (this._$sourceElement) {
      return;
    }

    if (!this._isValidElement(e, $element)) {
      e.cancel = true;
      return;
    }

    var dragStartArgs = this._getDragStartArgs(e, $element);

    this._getAction('onDragStart')(dragStartArgs);

    if (dragStartArgs.cancel) {
      e.cancel = true;
      return;
    }

    this.option('itemData', dragStartArgs.itemData);

    this._setSourceDraggable();

    this._$sourceElement = $element;
    var initialOffset = $element.offset();

    var $dragElement = this._$dragElement = this._createDragElement($element);

    this._toggleDraggingClass(true);

    this._toggleDragSourceClass(true);

    var isFixedPosition = $dragElement.css('position') === 'fixed';

    this._initPosition((0, _extend.extend)({}, dragStartArgs, {
      dragElement: $dragElement.get(0),
      initialOffset: isFixedPosition && initialOffset
    }));

    var $area = this._getArea();

    var areaOffset = this._getAreaOffset($area);

    var boundOffset = this._getBoundOffset();

    var areaWidth = $area.outerWidth();
    var areaHeight = $area.outerHeight();
    var elementWidth = $dragElement.width();
    var elementHeight = $dragElement.height();
    var startOffset = {
      left: $dragElement.offset().left - areaOffset.left,
      top: $dragElement.offset().top - areaOffset.top
    };

    if ($area.length) {
      e.maxLeftOffset = startOffset.left - boundOffset.left;
      e.maxRightOffset = areaWidth - startOffset.left - elementWidth - boundOffset.right;
      e.maxTopOffset = startOffset.top - boundOffset.top;
      e.maxBottomOffset = areaHeight - startOffset.top - elementHeight - boundOffset.bottom;
    }

    if (this.option('autoScroll')) {
      this._startAnimator();
    }
  },
  _getAreaOffset: function _getAreaOffset($area) {
    var offset = $area && _position.default.offset($area);

    return offset ? offset : {
      left: 0,
      top: 0
    };
  },
  _toggleDraggingClass: function _toggleDraggingClass(value) {
    this._$dragElement && this._$dragElement.toggleClass(this._addWidgetPrefix('dragging'), value);
  },
  _toggleDragSourceClass: function _toggleDragSourceClass(value, $element) {
    var $sourceElement = $element || this._$sourceElement;
    $sourceElement && $sourceElement.toggleClass(this._addWidgetPrefix('source'), value);
  },
  _getBoundOffset: function _getBoundOffset() {
    var boundOffset = this.option('boundOffset');

    if ((0, _type.isFunction)(boundOffset)) {
      boundOffset = boundOffset.call(this);
    }

    return (0, _string.quadToObject)(boundOffset);
  },
  _getArea: function _getArea() {
    var area = this.option('boundary');

    if ((0, _type.isFunction)(area)) {
      area = area.call(this);
    }

    return (0, _renderer.default)(area);
  },
  _getContainer: function _getContainer() {
    var container = this.option('container');

    if (container === undefined) {
      container = (0, _view_port.value)();
    }

    return (0, _renderer.default)(container);
  },
  _dragMoveHandler: function _dragMoveHandler(e, scrollBy) {
    this._dragMoveArgs = e;

    if (!this._$dragElement) {
      e.cancel = true;
      return;
    }

    var offset = e.offset;
    var startPosition = this._startPosition;

    this._move({
      left: startPosition.left + offset.x,
      top: startPosition.top + offset.y
    });

    if (!scrollBy) {
      this._updateScrollable(e);
    }

    var eventArgs = this._getEventArgs(e);

    this._getAction('onDragMove')(eventArgs);

    if (eventArgs.cancel === true) {
      return;
    }

    var targetDraggable = this._getTargetDraggable();

    targetDraggable.dragMove(e, scrollBy);
  },
  _updateScrollable: function _updateScrollable(e) {
    var that = this;

    if (that.option('autoScroll')) {
      var mousePosition = getMousePosition(e);
      var allObjects = that.getElementsFromPoint(mousePosition);

      that._verticalScrollHelper.updateScrollable(allObjects, mousePosition);

      that._horizontalScrollHelper.updateScrollable(allObjects, mousePosition);
    }
  },
  getElementsFromPoint: function getElementsFromPoint(position, dragElement) {
    var ownerDocument = (dragElement || this._$dragElement.get(0)).ownerDocument;

    if (_browser.default.msie) {
      var msElements = ownerDocument.msElementsFromPoint(position.x, position.y);

      if (msElements) {
        return Array.prototype.slice.call(msElements);
      }

      return [];
    }

    return ownerDocument.elementsFromPoint(position.x, position.y);
  },
  _getScrollable: function _getScrollable($element) {
    var _this2 = this;

    var $scrollable;
    $element.parents().toArray().some(function (parent) {
      var $parent = (0, _renderer.default)(parent);

      if (_this2._horizontalScrollHelper.isScrollable($parent) || _this2._verticalScrollHelper.isScrollable($parent)) {
        $scrollable = $parent;
        return true;
      }
    });
    return $scrollable;
  },
  _defaultActionArgs: function _defaultActionArgs() {
    var args = this.callBase.apply(this, arguments);
    var component = this.option('component');

    if (component) {
      args.component = component;
      args.element = component.element();
    }

    return args;
  },
  _getEventArgs: function _getEventArgs(e) {
    var sourceDraggable = this._getSourceDraggable();

    var targetDraggable = this._getTargetDraggable();

    return {
      event: e,
      itemData: sourceDraggable.option('itemData'),
      itemElement: (0, _element.getPublicElement)(sourceDraggable._$sourceElement),
      fromComponent: sourceDraggable.option('component') || sourceDraggable,
      toComponent: targetDraggable.option('component') || targetDraggable,
      fromData: sourceDraggable.option('data'),
      toData: targetDraggable.option('data')
    };
  },
  _getDragStartArgs: function _getDragStartArgs(e, $itemElement) {
    var args = this._getEventArgs(e);

    return {
      event: args.event,
      itemData: args.itemData,
      itemElement: $itemElement,
      fromData: args.fromData
    };
  },
  _revertItemToInitialPosition: function _revertItemToInitialPosition() {
    !this._dragElementIsCloned() && this._move(this._initialLocate, this._$sourceElement);
  },
  _dragEndHandler: function _dragEndHandler(e) {
    var _this3 = this;

    var d = new _deferred.Deferred();

    var dragEndEventArgs = this._getEventArgs(e);

    var dropEventArgs = this._getEventArgs(e);

    var targetDraggable = this._getTargetDraggable();

    var needRevertPosition = true;

    try {
      this._getAction('onDragEnd')(dragEndEventArgs);
    } finally {
      (0, _deferred.when)((0, _deferred.fromPromise)(dragEndEventArgs.cancel)).done(function (cancel) {
        if (!cancel) {
          if (targetDraggable !== _this3) {
            targetDraggable._getAction('onDrop')(dropEventArgs);
          }

          if (!dropEventArgs.cancel) {
            needRevertPosition = false;
            (0, _deferred.when)((0, _deferred.fromPromise)(targetDraggable.dragEnd(dragEndEventArgs))).always(d.resolve);
            return;
          }
        }

        d.resolve();
      }).fail(d.resolve);
      d.done(function () {
        if (needRevertPosition) {
          _this3._revertItemToInitialPosition();
        }

        _this3.reset();

        targetDraggable.reset();

        _this3._stopAnimator();

        _this3._horizontalScrollHelper.reset();

        _this3._verticalScrollHelper.reset();

        _this3._resetDragElement();

        _this3._resetSourceElement();

        _this3._resetTargetDraggable();

        _this3._resetSourceDraggable();
      });
    }
  },
  _isTargetOverAnotherDraggable: function _isTargetOverAnotherDraggable(e) {
    var _this4 = this;

    var sourceDraggable = this._getSourceDraggable();

    if (this === sourceDraggable) {
      return false;
    }

    var $dragElement = sourceDraggable._$dragElement;
    var $sourceDraggableElement = sourceDraggable.$element();
    var $targetDraggableElement = this.$element();
    var mousePosition = getMousePosition(e);
    var elements = this.getElementsFromPoint(mousePosition, e.target);
    var firstWidgetElement = elements.filter(function (element) {
      var $element = (0, _renderer.default)(element);

      if ($element.hasClass(_this4._addWidgetPrefix())) {
        return !$element.closest($dragElement).length;
      }
    })[0];

    var $sourceElement = this._getSourceElement();

    var isTargetOverItself = firstWidgetElement === $sourceDraggableElement.get(0);
    var isTargetOverNestedDraggable = (0, _renderer.default)(firstWidgetElement).closest($sourceElement).length;
    return !firstWidgetElement || firstWidgetElement === $targetDraggableElement.get(0) && !isTargetOverItself && !isTargetOverNestedDraggable;
  },
  _dragEnterHandler: function _dragEnterHandler(e) {
    this._fireDragEnterEvent(e);

    if (this._isTargetOverAnotherDraggable(e)) {
      this._setTargetDraggable();
    }

    var sourceDraggable = this._getSourceDraggable();

    sourceDraggable.dragEnter(e);
  },
  _dragLeaveHandler: function _dragLeaveHandler(e) {
    this._fireDragLeaveEvent(e);

    this._resetTargetDraggable();

    if (this !== this._getSourceDraggable()) {
      this.reset();
    }

    var sourceDraggable = this._getSourceDraggable();

    sourceDraggable.dragLeave(e);
  },
  _getAction: function _getAction(name) {
    return this['_' + name + 'Action'] || this._createActionByOption(name);
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates: function _initTemplates() {
    if (!this.option('contentTemplate')) return;

    this._templateManager.addDefaultTemplates({
      content: new _empty_template.EmptyTemplate()
    });

    this.callBase.apply(this, arguments);
  },
  _render: function _render() {
    this.callBase();
    this.$element().addClass(this._addWidgetPrefix());
    var transclude = this._templateManager.anonymousTemplateName === this.option('contentTemplate');

    var template = this._getTemplateByOption('contentTemplate');

    if (template) {
      (0, _renderer.default)(template.render({
        container: this.element(),
        transclude: transclude
      }));
    }
  },
  _optionChanged: function _optionChanged(args) {
    var name = args.name;

    switch (name) {
      case 'onDragStart':
      case 'onDragMove':
      case 'onDragEnd':
      case 'onDrop':
      case 'onDragEnter':
      case 'onDragLeave':
        this['_' + name + 'Action'] = this._createActionByOption(name);
        break;

      case 'dragTemplate':
      case 'contentTemplate':
      case 'container':
      case 'clone':
        break;

      case 'allowMoveByClick':
      case 'dragDirection':
      case 'disabled':
      case 'boundary':
      case 'filter':
      case 'immediate':
        this._resetDragElement();

        this._detachEventHandlers();

        this._attachEventHandlers();

        break;

      case 'autoScroll':
        this._verticalScrollHelper.reset();

        this._horizontalScrollHelper.reset();

        break;

      case 'scrollSensitivity':
      case 'scrollSpeed':
      case 'boundOffset':
      case 'handle':
      case 'group':
      case 'data':
      case 'itemData':
        break;

      default:
        this.callBase(args);
    }
  },
  _getTargetDraggable: function _getTargetDraggable() {
    return targetDraggable || this;
  },
  _getSourceDraggable: function _getSourceDraggable() {
    return sourceDraggable || this;
  },
  _setTargetDraggable: function _setTargetDraggable() {
    var currentGroup = this.option('group');

    var sourceDraggable = this._getSourceDraggable();

    if (currentGroup && currentGroup === sourceDraggable.option('group')) {
      targetDraggable = this;
    }
  },
  _setSourceDraggable: function _setSourceDraggable() {
    sourceDraggable = this;
  },
  _resetSourceDraggable: function _resetSourceDraggable() {
    sourceDraggable = null;
  },
  _resetTargetDraggable: function _resetTargetDraggable() {
    targetDraggable = null;
  },
  _dispose: function _dispose() {
    this.callBase();

    this._detachEventHandlers();

    this._resetDragElement();

    this._resetTargetDraggable();

    this._resetSourceDraggable();

    this._$sourceElement = null;

    this._stopAnimator();
  },
  _fireDragEnterEvent: function _fireDragEnterEvent(sourceEvent) {
    var args = this._getEventArgs(sourceEvent);

    this._getAction('onDragEnter')(args);
  },
  _fireDragLeaveEvent: function _fireDragLeaveEvent(sourceEvent) {
    var args = this._getEventArgs(sourceEvent);

    this._getAction('onDragLeave')(args);
  }
});

(0, _component_registrator.default)(DRAGGABLE, Draggable);
var _default = Draggable;
exports.default = _default;
module.exports = exports.default;