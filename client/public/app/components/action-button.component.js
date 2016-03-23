System.register(["angular2/core"], function(exports_1, context_1) {
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
    var core_1;
    var ActionButton;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ActionButton = (function () {
                function ActionButton() {
                }
                ActionButton.prototype.perform = function ($event, operationId) {
                    $event.preventDefault();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ActionButton.prototype, "operations", void 0);
                ActionButton = __decorate([
                    core_1.Component({
                        selector: 'action-button',
                        templateUrl: 'templates/action-button.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], ActionButton);
                return ActionButton;
            }());
            exports_1("ActionButton", ActionButton);
        }
    }
});
//# sourceMappingURL=action-button.component.js.map