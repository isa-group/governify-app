System.register(['angular2/core', '../services/languageService', '../services/GoogleService', '../pipes/remoteOperationsOnly'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, languageService_1, GoogleService_1, remoteOperationsOnly_1;
    var ActionButton;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (languageService_1_1) {
                languageService_1 = languageService_1_1;
            },
            function (GoogleService_1_1) {
                GoogleService_1 = GoogleService_1_1;
            },
            function (remoteOperationsOnly_1_1) {
                remoteOperationsOnly_1 = remoteOperationsOnly_1_1;
            }],
        execute: function() {
            ActionButton = (function () {
                function ActionButton(_GS, _languageService) {
                    this._GS = _GS;
                    this._languageService = _languageService;
                    this.initModal = new core_1.EventEmitter();
                    this.updateModal = new core_1.EventEmitter();
                    this.iconMap = {
                        "CheckCompliance": "assignment_turned_in",
                        "checkComplianceAuto": "assignment_turned_in",
                        "checkConsistency": "spellcheck",
                        "ComplianceAnalisys": "assignment_turned_in",
                        "computestats": "equalizer",
                        "execute": "settings",
                        "generateAFM": "build",
                        "generateOPL": "build",
                        "getOptimalConfiguration": "monetization_on",
                        "multiplecomparison": "compare",
                        "outofrange": "all_out",
                        "queryQ2": "query_builder",
                        "queryQ4": "query_builder",
                        "queryQ5": "query_builder",
                        "queryQ6": "query_builder",
                        "queryQ7": "query_builder",
                        "rank": "filter_1",
                        "smallsampling": "colorize",
                        "transform2iAgree": "transform"
                    };
                    this.$modal = $('#executeModal');
                }
                ActionButton.prototype.executeOperation = function ($event, operationId) {
                    var _this = this;
                    $event.preventDefault();
                    var basicOperations = ['checkConsistency', 'smallsampling', 'multiplecomparison', 'execute'], generativeOperations = ['generateOPL', 'generateAFM'], allowedOperations = basicOperations.concat(generativeOperations), notAllowedOperation = ['CheckCompliance', 'outofrange', 'computestats'];
                    if (allowedOperations.indexOf(operationId) == -1) {
                        if (notAllowedOperation.indexOf(operationId)) {
                            console.warn('Operation "' + operationId + '" not allowed.');
                            return this;
                        }
                        console.error('Operation "' + operationId + '" not listed.');
                        return;
                    }
                    var operationName;
                    for (var _i = 0, _a = this.operations; _i < _a.length; _i++) {
                        var operation = _a[_i];
                        if (operation.id === operationId) {
                            operationName = operation.name;
                            break;
                        }
                    }
                    this.initModal.emit({ header: operationName, loadingIndicator: true });
                    this._languageService.executeOperation(this.languagePath, operationId, this.fileContent, this.fileUri)
                        .subscribe(function (res) {
                        var options = {
                            header: operationName,
                            content: res.message,
                            subheader: '',
                            loadingIndicator: false
                        };
                        if (res.status != 'OK_PROBLEMS' && res.status != "ERROR") {
                            var subheader;
                            if (res.fileUri && res.fileUri !== "") {
                                options.subheader = "File: " + res.fileUri;
                            }
                            if (generativeOperations.indexOf(operationId) > -1) {
                                _this._GS.uploadFileToDrive(res.data, res.fileUri, _this.fileParents)
                                    .then(function () {
                                    var options = {
                                        header: operationName,
                                        subheader: subheader,
                                        content: res.message,
                                        loadingIndicator: false
                                    };
                                    _this.updateModal.emit([options, false]);
                                });
                            }
                            else {
                                var options_1 = {
                                    header: operationName,
                                    subheader: subheader,
                                    content: res.message,
                                    loadingIndicator: false
                                };
                                _this.updateModal.emit([options_1, false]);
                            }
                        }
                        else {
                            if (!res.message || res.message == "")
                                options.content = "An error has happened. Please try again.";
                            _this.updateModal.emit([options, true]);
                        }
                    }, function (err) {
                        _this.updateModal.emit([{ header: operationName,
                                content: 'Error executing operation. Please try again.',
                                loadingIndicator: false
                            }, true]);
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ActionButton.prototype, "operations", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ActionButton.prototype, "languagePath", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ActionButton.prototype, "fileContent", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ActionButton.prototype, "fileUri", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ActionButton.prototype, "fileParents", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ActionButton.prototype, "initModal", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ActionButton.prototype, "updateModal", void 0);
                ActionButton = __decorate([
                    core_1.Component({
                        selector: 'action-button',
                        templateUrl: 'templates/action-button.html',
                        providers: [languageService_1.LanguageService, GoogleService_1.GoogleService],
                        pipes: [remoteOperationsOnly_1.RemoteOperationsOnly]
                    }), 
                    __metadata('design:paramtypes', [GoogleService_1.GoogleService, languageService_1.LanguageService])
                ], ActionButton);
                return ActionButton;
            })();
            exports_1("ActionButton", ActionButton);
        }
    }
});
//# sourceMappingURL=action-button.js.map