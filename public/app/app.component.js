/**
 * Created by mrivero on 27/12/2015.
 */
System.register(['angular2/core', 'angular2/http', './services/languageService', './services/GoogleService', 'rxjs/Rx', './components/tabs', './components/editor'], function(exports_1, context_1) {
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
    var core_1, http_1, languageService_1, GoogleService_1, tabs_1, editor_1;
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
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http, _languageService, _GS) {
                    var _this = this;
                    this.http = http;
                    this._languageService = _languageService;
                    this._GS = _GS;
                    /**
                     * The app title that will hold the file name.
                     * @type {string}
                     */
                    this.fileName = 'Governify';
                    /**
                     * True when the application has loaded all the initial components.
                     * @type {boolean}
                     */
                    this.loaded = false;
                    /**
                     * Define the selected tab from [Tabs] web component.
                     * @type {string}
                     */
                    this.selectedFormat = '';
                    /**
                     * Different extensions on the [languageSettings] used on [Tabs] to create every tab.
                     * @type {string[]}
                     */
                    this.extensions = [''];
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
                }
                AppComponent.prototype.getUrlParameters = function (param) {
                    var result = null, query = window.location.search, map = {}, state;
                    if (param === null || query === '') {
                        return result;
                    }
                    var groups = query.substr(1).split("&");
                    for (var i in groups) {
                        i = groups[i].split("=");
                        map[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
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
                    $('ul.tabs').tabs();
                    setTimeout(function () { return $(window).trigger('resize'); }, 100);
                };
                AppComponent.prototype.fileNameChangedEvent = function (fileName) {
                    this.fileName = fileName;
                    this.loaded = true;
                };
                AppComponent.prototype.changeSelectedFormatEvent = function (formatId) {
                    for (var _i = 0, _a = this.languageSettings.formats; _i < _a.length; _i++) {
                        var f = _a[_i];
                        if (f.format === formatId) {
                            this.selectedFormat = f.format;
                            break;
                        }
                    }
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