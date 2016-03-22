System.register(['angular2/core', 'angular2/http', "rxjs/Observable"], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1;
    var LanguageService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            LanguageService = (function () {
                function LanguageService(http) {
                    this.http = http;
                }
                LanguageService.prototype.getLanguage = function (languagePath) {
                    return this.http.get('/api/language' + languagePath)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                LanguageService.prototype.postCheckLanguage = function (languageId, format, content, fileUri) {
                    var url = '/api/checkLanguage' + languageId + "/format/" + format;
                    var body = 'id=' + format + '&content=' + encodeURIComponent(content) + '&fileUri=' + fileUri;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    headers.append('accept', 'application/json');
                    var options = {
                        headers: headers
                    };
                    return this.http.post(url, body, options)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                LanguageService.prototype.convertLanguage = function (languageId, currentFormat, desiredFormat, content, fileUri) {
                    var url = '/api/convert' + languageId;
                    var body = 'currentFormat=' + currentFormat +
                        '&desiredFormat=' + desiredFormat +
                        '&fileUri=' + '' +
                        '&content=' + encodeURIComponent(content);
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    headers.append('accept', 'application/json');
                    var options = {
                        headers: headers
                    };
                    return this.http.post(url, body, options)
                        .map(function (res) { return res.json(); })
                        .catch(this.handleError);
                };
                LanguageService.prototype.handleError = function (error) {
                    return Observable_1.Observable.throw('Server error');
                };
                LanguageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], LanguageService);
                return LanguageService;
            }());
            exports_1("LanguageService", LanguageService);
        }
    }
});
//# sourceMappingURL=languageService.js.map