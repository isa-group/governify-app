export interface ModalOptions {
    header: string;
    subheader?: string;
    content?: string;
    buttons?: ModalButton[];
    loadingIndicator?: boolean
    open?: Function;
    close?: Function;
}

export interface ModalButton{
    text: string;
    type: string;
    click?: Function;
    class?: string;
}

/**
 * Modal based on materialize leanModal.
 */
export class Modal {
    header: string = '';
    subheader:string = '';
    content: string = '';
    buttons: ModalButton[] = [];
    ready: Function;
    complete: Function;
    loading: Boolean = false;
    $buttons: JQuery[];
    // Need to make sure #Modal exist in the app.
    $modal: JQuery = $('#Modal');

    constructor(options?: ModalOptions, $el?: JQuery) {
        if (!$el)
            this.$modal = $el;
        else
            this.$modal = $('#Modal');
        this.setModal(options);
    }

    setModal(options: ModalOptions){
        console.log(this.$modal);
        for (let key in options) {
            let value = options[key];
            switch(key){
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

        if( this.buttons.length > 0){
            this.$modal.find('.modal-footer').empty();
        }

        this.buttons.forEach((button: ModalButton) => {
           let $button = $($('<div>', {
				'class': 'modal-action modal-close ' + (button.type === 'flat' ? 'btn-flat blue-text' : 'btn white-text') + ' ' + (button.class ? button.class : ''),
				'text': button.text
			}));

           $button.on('click', () => {
              button.click();
           });

           this.$modal.find('.modal-footer').append($button);
        });
    }

    open(){
        this.$modal.openModal({
            dismissible: false,
            ready: this.ready,
            complete: this.complete
        });
    }

    updateContent(loadingIndicator: boolean, header?: string, content?: string, subheader?: string){
        this.header = header || this.header;
        this.content = content || this.content;
        this.subheader = subheader || this.subheader;

        if(loadingIndicator === true){
            this.$modal.addClass('loading');
        } else {
            this.$modal.removeClass('loading');
        }

        // Sometimes the content contains html. We need to strip the tags.
        if (content){
            this.content = content.replace(/<.*?>/g, '');
        }

        this.$modal.find('.modal-content .modal-header').html(this.header);
        this.$modal.find('.modal-content .modal-subheader').html(this.subheader);
        this.$modal.find('.modal-content .modal-body').html(this.content);
    }

    setButtons(buttons: ModalButton[]){
        this.$modal.find('.modal-footer').empty();

        buttons.forEach((button: ModalButton) => {
           let $button = $($('div'));
           let classes = button.type === 'flat' ? 'btn-flat' : 'btn';

           $button.addClass('modal-action modal-close ' + classes + button.class);
           $button.on('click', () => button.click());

           this.$modal.find('.modal-footer').append($button);
        });
    }

    setErrorMode(){
        this.$modal.find('.modal-content .modal-body').addClass("red-text");
    }
    setSuccessMode(){
        this.$modal.find('.modal-content .modal-body').removeClass("red-text");
    }
}