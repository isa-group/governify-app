System.register(['angular2/core', 'angular2/http'], function(exports_1) {
    'use strict';
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var FileService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            FileService = (function () {
                function FileService(http, headers) {
                    this.http = http;
                    this.headers = headers;
                }
                FileService.prototype.getFileContentById = function (id) {
                    var _this = this;
                    return gapi.client.load('drive', 'v2', function () {
                        var request = gapi.client.drive.files.get({ 'fileId': id });
                        request.execute(function (resp) {
                            console.log("My file: " + resp.id);
                            console.log("downloadUrl: " + resp.downloadUrl);
                            console.log(resp);
                            _this.file = resp;
                            //this.headers = new Headers();
                            console.log(gapi.auth.getToken());
                            _this.headers.append('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
                            _this.http.get(resp.downloadUrl, { headers: _this.headers })
                                .map(function (res) { return res.text(); })
                                .map(function (content) {
                                console.log('fileLoaded');
                                //console.log(data);
                                _this.file['content'] = content;
                                return _this.file;
                            });
                        });
                    });
                };
                FileService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, http_1.Headers])
                ], FileService);
                return FileService;
            })();
            exports_1("FileService", FileService);
        }
    }
});
//# sourceMappingURL=user.service.js.map