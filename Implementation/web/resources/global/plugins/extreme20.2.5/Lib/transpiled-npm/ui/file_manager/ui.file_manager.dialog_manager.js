"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiFile_managerDialog = _interopRequireDefault(require("./ui.file_manager.dialog.name_editor"));

var _uiFile_managerDialog2 = _interopRequireDefault(require("./ui.file_manager.dialog.folder_chooser"));

var _uiFile_managerDialog3 = _interopRequireDefault(require("./ui.file_manager.dialog.delete_item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FileManagerDialogManager = /*#__PURE__*/function () {
  function FileManagerDialogManager($element, options) {
    _classCallCheck(this, FileManagerDialogManager);

    this._$element = $element;
    this._options = options;
    var $chooseFolderDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._chooseDirectoryDialog = new _uiFile_managerDialog2.default($chooseFolderDialog, (0, _extend.extend)(this._options['chooseDirectoryDialog'], {
      onClosed: this._options['onDialogClosed']
    }));
    var $renameDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._renameItemDialog = new _uiFile_managerDialog.default($renameDialog, {
      title: _message.default.format('dxFileManager-dialogRenameItemTitle'),
      buttonText: _message.default.format('dxFileManager-dialogRenameItemButtonText'),
      onClosed: this._options['onDialogClosed']
    });
    var $createDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._createItemDialog = new _uiFile_managerDialog.default($createDialog, {
      title: _message.default.format('dxFileManager-dialogCreateDirectoryTitle'),
      buttonText: _message.default.format('dxFileManager-dialogCreateDirectoryButtonText'),
      onClosed: this._options['onDialogClosed']
    });
    var $deleteItemDialog = (0, _renderer.default)('<div>').appendTo(this._$element);
    this._deleteItemDialog = new _uiFile_managerDialog3.default($deleteItemDialog, {
      onClosed: this._options['onDialogClosed']
    });
  }

  _createClass(FileManagerDialogManager, [{
    key: "getCopyDialog",
    value: function getCopyDialog(targetItemInfos) {
      this._chooseDirectoryDialog.switchToCopyDialog(targetItemInfos);

      return this._chooseDirectoryDialog;
    }
  }, {
    key: "getMoveDialog",
    value: function getMoveDialog(targetItemInfos) {
      this._chooseDirectoryDialog.switchToMoveDialog(targetItemInfos);

      return this._chooseDirectoryDialog;
    }
  }, {
    key: "getRenameItemDialog",
    value: function getRenameItemDialog() {
      return this._renameItemDialog;
    }
  }, {
    key: "getCreateItemDialog",
    value: function getCreateItemDialog() {
      return this._createItemDialog;
    }
  }, {
    key: "getDeleteItemDialog",
    value: function getDeleteItemDialog() {
      return this._deleteItemDialog;
    }
  }]);

  return FileManagerDialogManager;
}();

var _default = FileManagerDialogManager;
exports.default = _default;
module.exports = exports.default;