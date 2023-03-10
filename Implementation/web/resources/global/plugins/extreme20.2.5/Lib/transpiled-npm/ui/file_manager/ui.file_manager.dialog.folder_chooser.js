"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiFile_manager = require("./ui.file_manager.common");

var _uiFile_managerDialog = _interopRequireDefault(require("./ui.file_manager.dialog.js"));

var _uiFile_manager2 = _interopRequireDefault(require("./ui.file_manager.files_tree_view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
var FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';

var FileManagerFolderChooserDialog = /*#__PURE__*/function (_FileManagerDialogBas) {
  _inherits(FileManagerFolderChooserDialog, _FileManagerDialogBas);

  var _super = _createSuper(FileManagerFolderChooserDialog);

  function FileManagerFolderChooserDialog() {
    _classCallCheck(this, FileManagerFolderChooserDialog);

    return _super.apply(this, arguments);
  }

  _createClass(FileManagerFolderChooserDialog, [{
    key: "show",
    value: function show() {
      var _this$_filesTreeView;

      this._resetDialogSelectedDirectory();

      (_this$_filesTreeView = this._filesTreeView) === null || _this$_filesTreeView === void 0 ? void 0 : _this$_filesTreeView.refresh();

      _get(_getPrototypeOf(FileManagerFolderChooserDialog.prototype), "show", this).call(this);
    }
  }, {
    key: "switchToCopyDialog",
    value: function switchToCopyDialog(targetItemInfos) {
      this._targetItemInfos = targetItemInfos;

      this._setTitle(_message.default.format('dxFileManager-dialogDirectoryChooserCopyTitle'));

      this._setButtonText(_message.default.format('dxFileManager-dialogDirectoryChooserCopyButtonText'));
    }
  }, {
    key: "switchToMoveDialog",
    value: function switchToMoveDialog(targetItemInfos) {
      this._targetItemInfos = targetItemInfos;

      this._setTitle(_message.default.format('dxFileManager-dialogDirectoryChooserMoveTitle'));

      this._setButtonText(_message.default.format('dxFileManager-dialogDirectoryChooserMoveButtonText'));
    }
  }, {
    key: "_getDialogOptions",
    value: function _getDialogOptions() {
      return (0, _extend.extend)(_get(_getPrototypeOf(FileManagerFolderChooserDialog.prototype), "_getDialogOptions", this).call(this), {
        contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
        popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP
      });
    }
  }, {
    key: "_createContentTemplate",
    value: function _createContentTemplate(element) {
      var _this = this;

      _get(_getPrototypeOf(FileManagerFolderChooserDialog.prototype), "_createContentTemplate", this).call(this, element);

      this._filesTreeView = this._createComponent((0, _renderer.default)('<div>'), _uiFile_manager2.default, {
        getDirectories: this.option('getDirectories'),
        getCurrentDirectory: function getCurrentDirectory() {
          return _this._getDialogSelectedDirectory();
        },
        onDirectoryClick: function onDirectoryClick(e) {
          return _this._onFilesTreeViewDirectoryClick(e);
        },
        onFilesTreeViewContentReady: function onFilesTreeViewContentReady() {
          return _this._toggleUnavailableLocationsDisabled(true);
        }
      });

      this._$contentElement.append(this._filesTreeView.$element());
    }
  }, {
    key: "_getDialogResult",
    value: function _getDialogResult() {
      var result = this._getDialogSelectedDirectory();

      return result ? {
        folder: result
      } : result;
    }
  }, {
    key: "_getDefaultOptions",
    value: function _getDefaultOptions() {
      return (0, _extend.extend)(_get(_getPrototypeOf(FileManagerFolderChooserDialog.prototype), "_getDefaultOptions", this).call(this), {
        getItems: null
      });
    }
  }, {
    key: "_getDialogSelectedDirectory",
    value: function _getDialogSelectedDirectory() {
      return this._selectedDirectoryInfo;
    }
  }, {
    key: "_resetDialogSelectedDirectory",
    value: function _resetDialogSelectedDirectory() {
      this._selectedDirectoryInfo = null;
    }
  }, {
    key: "_onFilesTreeViewDirectoryClick",
    value: function _onFilesTreeViewDirectoryClick(_ref) {
      var itemData = _ref.itemData;
      this._selectedDirectoryInfo = itemData;

      this._filesTreeView.updateCurrentDirectory();
    }
  }, {
    key: "_onPopupShown",
    value: function _onPopupShown() {
      this._toggleUnavailableLocationsDisabled(true);

      _get(_getPrototypeOf(FileManagerFolderChooserDialog.prototype), "_onPopupShown", this).call(this);
    }
  }, {
    key: "_onPopupHidden",
    value: function _onPopupHidden() {
      this._toggleUnavailableLocationsDisabled(false);

      _get(_getPrototypeOf(FileManagerFolderChooserDialog.prototype), "_onPopupHidden", this).call(this);
    }
  }, {
    key: "_toggleUnavailableLocationsDisabled",
    value: function _toggleUnavailableLocationsDisabled(isDisabled) {
      var _this2 = this;

      if (!this._filesTreeView) {
        return;
      }

      var locations = this._getLocationsToProcess(isDisabled);

      this._filesTreeView.toggleDirectoryExpandedStateRecursive(locations.locationsToExpand[0], isDisabled).then(function () {
        return _this2._filesTreeView.toggleDirectoryLineExpandedState(locations.locationsToCollapse, !isDisabled).then(function () {
          return locations.locationKeysToDisable.forEach(function (key) {
            return _this2._filesTreeView.toggleNodeDisabledState(key, isDisabled);
          });
        });
      });
    }
  }, {
    key: "_getLocationsToProcess",
    value: function _getLocationsToProcess(isDisabled) {
      var _expandMap$keys;

      var expandLocations = {};
      var collapseLocations = {};

      this._targetItemInfos.forEach(function (itemInfo) {
        if (itemInfo.parentDirectory) {
          expandLocations[itemInfo.parentDirectory.getInternalKey()] = itemInfo.parentDirectory;
        }

        if (itemInfo.fileItem.isDirectory) {
          collapseLocations[itemInfo.getInternalKey()] = itemInfo;
        }
      });

      var expandMap = (0, _uiFile_manager.getMapFromObject)(expandLocations);
      var collapseMap = (0, _uiFile_manager.getMapFromObject)(collapseLocations);
      return {
        locationsToExpand: isDisabled ? expandMap.values : [],
        locationsToCollapse: isDisabled ? collapseMap.values : [],
        locationKeysToDisable: (_expandMap$keys = expandMap.keys).concat.apply(_expandMap$keys, _toConsumableArray(collapseMap.keys))
      };
    }
  }]);

  return FileManagerFolderChooserDialog;
}(_uiFile_managerDialog.default);

var _default = FileManagerFolderChooserDialog;
exports.default = _default;
module.exports = exports.default;