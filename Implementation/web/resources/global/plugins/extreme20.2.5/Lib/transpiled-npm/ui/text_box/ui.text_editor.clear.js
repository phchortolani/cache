"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _button = _interopRequireDefault(require("./texteditor_button_collection/button"));

var _index = require("../../events/utils/index");

var _pointer = _interopRequireDefault(require("../../events/pointer"));

var _click = require("../../events/click");

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

var pointerDown = _pointer.default.down;
var STATE_INVISIBLE_CLASS = 'dx-state-invisible';
var TEXTEDITOR_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
var TEXTEDITOR_CLEAR_ICON_CLASS = 'dx-icon-clear';
var TEXTEDITOR_ICON_CLASS = 'dx-icon';
var TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = 'dx-show-clear-button';

var ClearButton = /*#__PURE__*/function (_TextEditorButton) {
  _inherits(ClearButton, _TextEditorButton);

  var _super = _createSuper(ClearButton);

  function ClearButton() {
    _classCallCheck(this, ClearButton);

    return _super.apply(this, arguments);
  }

  _createClass(ClearButton, [{
    key: "_create",
    value: function _create() {
      var $element = (0, _renderer.default)('<span>').addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS).append((0, _renderer.default)('<span>').addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS));

      this._addToContainer($element);

      this.update(true);
      return {
        instance: $element,
        $element: $element
      };
    }
  }, {
    key: "_isVisible",
    value: function _isVisible() {
      var editor = this.editor;
      return editor._isClearButtonVisible();
    }
  }, {
    key: "_attachEvents",
    value: function _attachEvents(instance, $button) {
      var editor = this.editor;
      var editorName = editor.NAME;

      _events_engine.default.on($button, (0, _index.addNamespace)(pointerDown, editorName), function (e) {
        e.preventDefault();

        if (e.pointerType !== 'mouse') {
          editor._clearValueHandler(e);
        }
      });

      _events_engine.default.on($button, (0, _index.addNamespace)(_click.name, editorName), function (e) {
        return editor._clearValueHandler(e);
      });
    } // TODO: get rid of it

  }, {
    key: "_legacyRender",
    value: function _legacyRender($editor, isVisible) {
      $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
    }
  }, {
    key: "update",
    value: function update() {
      var rendered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      !rendered && _get(_getPrototypeOf(ClearButton.prototype), "update", this).call(this);
      var editor = this.editor,
          instance = this.instance;
      var $editor = editor.$element();

      var isVisible = this._isVisible();

      instance && instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);

      this._legacyRender($editor, isVisible);
    }
  }]);

  return ClearButton;
}(_button.default);

exports.default = ClearButton;
module.exports = exports.default;