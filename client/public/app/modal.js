System.register([], function(exports_1) {
    var Modal;
    return {
        setters:[],
        execute: function() {
            Modal = (function () {
                function Modal(options, $el) {
                    this.header = '';
                    this.subheader = '';
                    this.content = '';
                    this.buttons = [];
                    this.loading = false;
                    this.$modal = $('#Modal');
                    if (!$el)
                        this.$modal = $el;
                    else
                        this.$modal = $('#Modal');
                    this.setModal(options);
                }
                Modal.prototype.setModal = function (options) {
                    var _this = this;
                    console.log(this.$modal);
                    for (var key in options) {
                        var value = options[key];
                        switch (key) {
                            case 'header':
                                this.header = value;
                                break;
                            case 'subheader':
                                this.subheader = value;
                                break;
                            case 'content':
                                this.content = value;
                                break;
                            case 'buttons':
                                this.buttons = value;
                                break;
                            case 'open':
                                this.ready = value;
                                break;
                            case 'close':
                                this.complete = value;
                                break;
                            case 'loadingIndicator':
                                this.loading = value;
                                break;
                        }
                    }
                    if (this.loading) {
                        this.$modal.addClass('loading');
                    }
                    this.$modal.find('.modal-content .modal-header').html(this.header);
                    this.$modal.find('.modal-content .modal-subheader').html(this.subheader);
                    this.$modal.find('.modal-content .modal-body').html(this.content);
                    if (this.buttons.length > 0) {
                        this.$modal.find('.modal-footer').empty();
                    }
                    this.buttons.forEach(function (button) {
                        var $button = $($('<div>', {
                            'class': 'modal-action modal-close ' + (button.type === 'flat' ? 'btn-flat blue-text' : 'btn white-text') + ' ' + (button.class ? button.class : ''),
                            'text': button.text
                        }));
                        $button.on('click', function () {
                            button.click();
                        });
                        _this.$modal.find('.modal-footer').append($button);
                    });
                };
                Modal.prototype.open = function () {
                    this.$modal.openModal({
                        dismissible: false,
                        ready: this.ready,
                        complete: this.complete
                    });
                };
                Modal.prototype.updateContent = function (loadingIndicator, header, content, subheader) {
                    this.header = header || this.header;
                    this.content = content || this.content;
                    this.subheader = subheader || this.subheader;
                    if (loadingIndicator === true) {
                        this.$modal.addClass('loading');
                    }
                    else {
                        this.$modal.removeClass('loading');
                    }
                    if (content) {
                        this.content = content.replace(/<.*?>/g, '');
                    }
                    this.$modal.find('.modal-content .modal-header').html(this.header);
                    this.$modal.find('.modal-content .modal-subheader').html(this.subheader);
                    this.$modal.find('.modal-content .modal-body').html(this.content);
                };
                Modal.prototype.setButtons = function (buttons) {
                    var _this = this;
                    this.$modal.find('.modal-footer').empty();
                    buttons.forEach(function (button) {
                        var $button = $($('div'));
                        var classes = button.type === 'flat' ? 'btn-flat' : 'btn';
                        $button.addClass('modal-action modal-close ' + classes + button.class);
                        $button.on('click', function () { return button.click(); });
                        _this.$modal.find('.modal-footer').append($button);
                    });
                };
                Modal.prototype.setErrorMode = function () {
                    this.$modal.find('.modal-content .modal-body').addClass("red-text");
                };
                Modal.prototype.setSuccessMode = function () {
                    this.$modal.find('.modal-content .modal-body').removeClass("red-text");
                };
                return Modal;
            })();
            exports_1("Modal", Modal);
        }
    }
});
//# sourceMappingURL=modal.js.map