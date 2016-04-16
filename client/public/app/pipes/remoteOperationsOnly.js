System.register(['angular2/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var RemoteOperationsOnly;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            RemoteOperationsOnly = (function () {
                function RemoteOperationsOnly() {
                }
                RemoteOperationsOnly.prototype.transform = function (arr) {
                    return arr.filter(function (element) {
                        return element['_remoteExecution'] === "true";
                    });
                };
                RemoteOperationsOnly = __decorate([
                    core_1.Pipe({
                        name: 'remoteOperationsOnly'
                    }), 
                    __metadata('design:paramtypes', [])
                ], RemoteOperationsOnly);
                return RemoteOperationsOnly;
            })();
            exports_1("RemoteOperationsOnly", RemoteOperationsOnly);
        }
    }
});
//# sourceMappingURL=remoteOperationsOnly.js.map