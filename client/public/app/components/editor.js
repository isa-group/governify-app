System.register(['angular2/core', '../services/GoogleService', '../services/languageService', 'angular2/http', './action-button'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, GoogleService_1, languageService_1, http_1, action_button_1;
    var Editor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (GoogleService_1_1) {
                GoogleService_1 = GoogleService_1_1;
            },
            function (languageService_1_1) {
                languageService_1 = languageService_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (action_button_1_1) {
                action_button_1 = action_button_1_1;
            }],
        execute: function() {
            Editor = (function () {
                function Editor(http, _GS, _languageService) {
                    this.http = http;
                    this._GS = _GS;
                    this._languageService = _languageService;
                    this.fileExtension = new core_1.EventEmitter();
                    this.fileNameChange = new core_1.EventEmitter();
                    this.disabledTabsChange = new core_1.EventEmitter();
                    this.ignoreChangeAceEvent = false;
                    this.initModal = new core_1.EventEmitter();
                    this.updateModal = new core_1.EventEmitter();
                    this.loading = new core_1.EventEmitter();
                }
                Editor.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
                        this.setEditorParameters(this.language.formats[0]);
                        this.languagePath = this.config.languages[this.language.id];
                    }
                    if (changes['selectedFormat']) {
                        if (Object.keys(changes['selectedFormat'].previousValue).length > 0 && Object.keys(changes['selectedFormat'].currentValue).length > 0
                            || (changes['selectedFormat'].currentValue != "" && changes['selectedFormat'].previousValue != "")) {
                            if (this.language != undefined) {
                                this.oldFormatSettings = this.getFormatFromId(changes["selectedFormat"].previousValue);
                                this.formatSettings = this.getFormatFromId(changes["selectedFormat"].currentValue);
                                if (this.formatSettings.checkLanguage) {
                                    this.convertLanguage(this.formatSettings.format, this.oldFormatSettings.format);
                                    this.checkEditorLanguage();
                                }
                                else {
                                    this.convertLanguage(this.formatSettings.format, this.oldFormatSettings.format);
                                }
                            }
                        }
                    }
                    if (changes["id"] && typeof changes["id"].currentValue !== 'undefined' && changes["id"].currentValue !== "") {
                        this.initAce();
                        this._GS.authorize().then(function () {
                            _this._GS.loadDriveFile(_this.id).then(function (file) {
                                _this.loading.emit(false);
                                console.log(file);
                                _this.fileName = file.title;
                                _this.fileNameChange.next(_this.fileName);
                                _this.fileParents = file.parents;
                                _this.fileExtension.next(file.fileExtension);
                                _this._GS.getFileContent(file.downloadUrl)
                                    .map(function (res) { return res.text(); })
                                    .subscribe(function (content) {
                                    _this.fileContent = content;
                                    _this.replaceEditorContent(_this.fileContent);
                                    _this.checkEditorLanguage();
                                    _this.setEditorHandlers();
                                }, function (err) {
                                    console.error('error getting file content');
                                });
                            }, function (err) {
                                _this.loading.emit(false);
                                if (err.code === 404) {
                                    console.log(err);
                                    _this.initModal.emit({
                                        loadingIndicator: false,
                                        header: 'File not found',
                                        subheader: err.message,
                                        content: 'The file you try to open may not exist or you dont have enought permissions. Please try again.',
                                        buttons: [{
                                                text: 'exit',
                                                click: function () { return window.location.replace(window.location.origin); },
                                                type: 'flat'
                                            }]
                                    });
                                }
                                console.log('file Not found');
                            });
                        });
                    }
                };
                Editor.prototype.initAce = function () {
                    this.editor = ace.edit("editor");
                    this.editor.setShowPrintMargin(false);
                };
                Editor.prototype.replaceEditorContent = function (newContent) {
                    this.ignoreChangeAceEvent = true;
                    this.editor.setValue(newContent, -1);
                    this.ignoreChangeAceEvent = false;
                    if (this.formatSettings.checkLanguage) {
                        this.checkEditorLanguage();
                    }
                    else {
                        this.disabledTabsChange.emit(false);
                    }
                };
                Editor.prototype.setEditorParameters = function (formatSettings) {
                    this.formatSettings = formatSettings;
                    if (this.formatSettings.editorThemeId) {
                        this.editor.setTheme(this.formatSettings.editorThemeId);
                    }
                    if (this.formatSettings.editorModeId) {
                        this.editor.getSession().setMode(this.formatSettings.editorModeId);
                    }
                };
                Editor.prototype.checkEditorLanguage = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this._languageService.postCheckLanguage(_this.languagePath, _this.formatSettings.format, _this.editor.getValue(), _this.fileName)
                            .subscribe(function (data) {
                            _this.editor.getSession().setAnnotations(data.annotations);
                            if (data.status === 'OK') {
                                _this.hasError = false;
                                _this.disabledTabsChange.emit(false);
                            }
                            else {
                                _this.hasError = true;
                                _this.disabledTabsChange.emit(true);
                            }
                            resolve();
                        }, function (err) {
                            console.error(err);
                            reject();
                        });
                    });
                };
                Editor.prototype.setEditorHandlers = function () {
                    var _this = this;
                    var saveTimeout;
                    this.editor.on('change', function (ev) {
                        _this.fileContent = _this.editor.getValue();
                        if (!_this.ignoreChangeAceEvent) {
                            if (_this.formatSettings.checkLanguage) {
                                _this.checkEditorLanguage().then(function () {
                                    if (!_this.hasError) {
                                        if (saveTimeout !== null) {
                                            clearTimeout(saveTimeout);
                                        }
                                        saveTimeout = setTimeout(function () {
                                            _this._GS.saveFileToDrive(_this.id, _this.editor.getValue());
                                        }, 2000);
                                    }
                                });
                            }
                            else {
                            }
                        }
                    });
                };
                Editor.prototype.convertLanguage = function (desiredFormat, oldFormatSettings) {
                    var _this = this;
                    var content = this.editor.getValue();
                    if (!this.hasError) {
                        this._languageService.convertLanguage(this.languagePath, oldFormatSettings, desiredFormat, content, this.fileName)
                            .subscribe(function (res) {
                            if (res.status == 'OK') {
                                var content_1 = res.data;
                                _this.replaceEditorContent(content_1);
                            }
                        }, function (err) {
                            console.error(err);
                        });
                    }
                    else {
                        Materialize.toast('Default format has errors!', 4000);
                    }
                };
                Editor.prototype.getFormatFromId = function (formatId) {
                    var fmt;
                    for (var _i = 0, _a = this.language.formats; _i < _a.length; _i++) {
                        var f = _a[_i];
                        if (f.format === formatId) {
                            fmt = f;
                            break;
                        }
                    }
                    return fmt;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], Editor.prototype, "id", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], Editor.prototype, "selectedFormat", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Editor.prototype, "language", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Editor.prototype, "config", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], Editor.prototype, "disabledTabs", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "fileExtension", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "fileNameChange", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "disabledTabsChange", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "initModal", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "updateModal", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "loading", void 0);
                Editor = __decorate([
                    core_1.Component({
                        selector: 'editor',
                        templateUrl: 'templates/editor.html',
                        providers: [languageService_1.LanguageService, GoogleService_1.GoogleService],
                        directives: [action_button_1.ActionButton]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, GoogleService_1.GoogleService, languageService_1.LanguageService])
                ], Editor);
                return Editor;
            })();
            exports_1("Editor", Editor);
        }
    }
});
//# sourceMappingURL=editor.js.map