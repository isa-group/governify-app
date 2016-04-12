System.register(['angular2/core', 'angular2/http', './services/languageService', './services/GoogleService', 'rxjs/Rx', './components/tabs', './components/editor', './modal'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, languageService_1, GoogleService_1, tabs_1, editor_1, modal_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (languageService_1_1) {
                languageService_1 = languageService_1_1;
            },
            function (GoogleService_1_1) {
                GoogleService_1 = GoogleService_1_1;
            },
            function (_1) {},
            function (tabs_1_1) {
                tabs_1 = tabs_1_1;
            },
            function (editor_1_1) {
                editor_1 = editor_1_1;
            },
            function (modal_1_1) {
                modal_1 = modal_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http, _languageService, _GS) {
                    this.http = http;
                    this._languageService = _languageService;
                    this._GS = _GS;
                    this.fileName = 'Governify';
                    this.loading = true;
                    this.selectedFormat = '';
                    this.extensions = [''];
                    this.disabledTabs = false;
                }
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    $('body').removeClass('unresolved');
                    this.languages = {};
                    var getConfigLang = new Promise(function (resolve, reject) {
                        _this.http.get('/api/configuration')
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            _this.configuration = data;
                            var aLenguagesDeferred = [];
                            $.each(_this.configuration.languages, function (languageId, languagePath) {
                                aLenguagesDeferred.push((function () {
                                    var d = new Promise(function (resolve, reject) {
                                        _this._languageService.getLanguage(languagePath)
                                            .subscribe(function (lang) {
                                            _this.languages[lang.extension] = lang;
                                            resolve();
                                        }, function (err) {
                                            console.error(err);
                                            reject();
                                        });
                                    });
                                    return d;
                                })());
                            });
                            Promise.all(aLenguagesDeferred).then(function () { return resolve(); }, function () { return reject(); });
                        }, function (err) {
                            console.error(err);
                        });
                    });
                    Promise.all([
                        getConfigLang
                    ]).then(function () {
                        _this.fileId = _this.getUrlParameters('ids');
                    });
                };
                AppComponent.prototype.getUrlParameters = function (param) {
                    var result = null, query = window.location.search, map = {};
                    if (param === null || query === '') {
                        return result;
                    }
                    var groups = query.substr(1).split("&");
                    for (var i in groups) {
                        var _a = groups[i].split("="), key = _a[0], val = _a[1];
                        map[key] = val;
                    }
                    if (map != null) {
                        var value = map[param];
                        try {
                            result = JSON.parse(value);
                        }
                        catch (e) {
                            result = value;
                        }
                    }
                    return result;
                };
                AppComponent.prototype.extensionSelectedEvent = function (ext) {
                    this.languageSettings = this.languages[ext];
                    var formats = this.languageSettings.formats;
                    this.extensions = [];
                    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
                        var f = formats_1[_i];
                        this.extensions.push(f.format);
                    }
                    this.selectedFormat = this.extensions[0];
                };
                AppComponent.prototype.fileNameChangedEvent = function (fileName) {
                    this.fileName = fileName;
                };
                AppComponent.prototype.initModal = function (options) {
                    console.log('capturado evento INITmodal en appcomponent');
                    console.log(options);
                    if (!this.modal)
                        this.modal = new modal_1.Modal(options, $('#Modal'));
                    else
                        this.modal.setModal(options);
                    this.modal.open();
                };
                AppComponent.prototype.updateModal = function (_a) {
                    var options = _a[0], error = _a[1];
                    console.log('capturado evento UPDATEmodal en appcomponent');
                    console.log(options);
                    console.log(error);
                    if (error)
                        this.modal.setErrorMode();
                    else
                        this.modal.setSuccessMode();
                    this.modal.updateContent(options.loadingIndicator, options.header, options.content, options.subheader);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'templates/app.html',
                        directives: [tabs_1.Tabs, editor_1.Editor],
                        providers: [GoogleService_1.GoogleService]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, languageService_1.LanguageService, GoogleService_1.GoogleService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map