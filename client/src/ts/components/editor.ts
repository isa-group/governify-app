/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />

import {Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter} from 'angular2/core';
import {GoogleService} from '../services/GoogleService';
import {LanguageService} from '../services/languageService';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {ILanguage, IFormat, IOperation, IConfiguration, ILanguageResponse} from '../interfaces';
import {ActionButton} from './action-button';
import {ModalOptions} from '../modal';

@Component({
    selector: 'editor',
    templateUrl: 'templates/editor.html',
    providers: [LanguageService, GoogleService],
	directives: [ActionButton]
})
export class Editor implements OnChanges {
    /**
     * The file id needed for retrieving the file content.
     * @type {string}
     */
    @Input() id: string;
    /**
     * Define the selected tab from [Tabs] web component.
     * @type {string}
     */
    @Input() selectedFormat: string;
    /**
     * Language of the loaded file.
     * @type {ILanguage}
     */
    @Input() language: ILanguage;
    /**
     * Initial app configuration containing the manifests of all the [languages].
     * @type {IConfiguration}
     */
    @Input() config: IConfiguration;
    /**
     * Whether the tabs are disabled.
     * @type {boolean}
     */
    @Input() disabledTabs: boolean;
     /**
     * EventEmitter to emit the changes in file extension.
     * @type {EventEmitter}
     */
    @Output() fileExtension: EventEmitter<string> = new EventEmitter<string>();
     /**
     * EventEmitter to emit the changes in the file name.
     * @type {EventEmitter}
     */
    @Output() fileNameChange: EventEmitter<string> = new EventEmitter<string>();
    /**
     * EventEmitter to emit the changes in disabledTabs.
     * @type {EventEmitter}
     */
    @Output() disabledTabsChange: EventEmitter<boolean> = new EventEmitter<boolean>();
     /**
     * File name.
     * @type {string}
     */
    fileName: string;
     /**
     * The editor itself.
     * @type {AceAjax.Editor}
     */
    editor: AceAjax.Editor;
    /**
     * Editor content at any time.
     * @type {string}
     */
    fileContent: string;
    /**
     * Current format selected in tabs and content format inside the editor.
     * @type {IFormat}
     */
    formatSettings: IFormat;
    /**
     * Old format selected in tabs and content format inside the editor.
     * @type {IFormat}
     */
    oldFormatSettings: IFormat;
    /**
     * Whether the content has an error.
     * @type {boolean}
     */
    hasError: boolean;
    /**
     * A flag to prevent content to be save to drive on a change caused by a format change.
     * @type {boolean}
     */
    ignoreChangeAceEvent: boolean = false;
    /**
     * Language path for the file language.
     * @type {string}
     */
    languagePath: string;
    /**
     * Google drive parents of the file.
     * @type {Array<string>}
     */
    fileParents: string[];

    @Output() initModal: EventEmitter<ModalOptions> = new EventEmitter();
    @Output() updateModal: EventEmitter<[ModalOptions, boolean]> = new EventEmitter();

    constructor(public http: Http, private _GS: GoogleService, private _languageService: LanguageService) {}

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
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
                    } else {
                        this.convertLanguage(this.formatSettings.format, this.oldFormatSettings.format);
                    }
                }
            }
        }
        if (changes["id"] && typeof changes["id"].currentValue !== 'undefined' && changes["id"].currentValue !== "") {
            this.initAce();
            this._GS.authorize().then(
                () => {
                    this._GS.loadDriveFile(this.id).then(
                        (file:Object) => {
                            this.fileName = file.title;
                            this.fileNameChange.next(this.fileName);
                            this.fileParents = file.parents;
                            this.fileExtension.next(file.fileExtension);
                            this._GS.getFileContent(file.downloadUrl)
                                .map(res => res.text())
                                .subscribe(
                                    (content) => {
                                        this.fileContent = content;
                                        this.replaceEditorContent(this.fileContent);
                                        this.checkEditorLanguage();
                                        this.setEditorHandlers();
                                    },
                                    (err) => {
                                        console.error('error getting file content');
                                    }
                                )
                        }
                    )

                }
            );
        }
    }

    initAce() {
        this.editor = ace.edit("editor");

        //Remove 80-character vertical line
        this.editor.setShowPrintMargin(false);
    }

    replaceEditorContent(newContent: string) {
        this.ignoreChangeAceEvent = true;
        this.editor.setValue(newContent, -1);
        this.ignoreChangeAceEvent = false;

        if (this.formatSettings.checkLanguage) {
            this.checkEditorLanguage();
        } else {
            this.disabledTabsChange.emit(false);
        }
    }

    setEditorParameters(formatSettings: IFormat){
        this.formatSettings = formatSettings;

        if(this.formatSettings.editorThemeId){
            this.editor.setTheme(this.formatSettings.editorThemeId);
        }
        if(this.formatSettings.editorModeId){
            this.editor.getSession().setMode(this.formatSettings.editorModeId);
        }
    }

    checkEditorLanguage() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._languageService.postCheckLanguage(this.languagePath, this.formatSettings.format, this.editor.getValue(), this.fileName)
                .subscribe(
                    (data: ILanguageResponse) => {
                        this.editor.getSession().setAnnotations(data.annotations);
                        if (data.status === 'OK'){
                            this.hasError = false;
                            this.disabledTabsChange.emit(false);
                        } else {
                            this.hasError = true;
                            this.disabledTabsChange.emit(true);
                        }
                        resolve();
                    },
                    (err) => {
                        console.error(err);
                        reject();
                    }
            );
        });
    }

    setEditorHandlers() {
        let saveTimeout;
        this.editor.on('change', (ev: AceAjax.EditorChangeEvent) => {
            this.fileContent = this.editor.getValue();
            if (!this.ignoreChangeAceEvent) {
                if (this.formatSettings.checkLanguage) {
                    this.checkEditorLanguage().then(() => {
                        if (!this.hasError) {
                            if (saveTimeout !== null) {
                                clearTimeout(saveTimeout);
                            }

                            saveTimeout = setTimeout(() => {
                                this._GS.saveFileToDrive(this.id, this.editor.getValue());
                            }, 2000);
                        }
                    })
                } else {
                    /**
                     * TODO: Ensure that the file is saved on the original format.
                     */
                }
            }
        });
    }

    convertLanguage(desiredFormat: string, oldFormatSettings: string){
        let content = this.editor.getValue();

        if(!this.hasError /*&& content !== null && content !== ""*/) {
            this._languageService.convertLanguage(this.languagePath, oldFormatSettings, desiredFormat, content, this.fileName)
                .subscribe(
                    (res: ILanguageResponse) => {
                        if(res.status == 'OK'){
                            let content = res.data;
                            this.replaceEditorContent(content);
                        }
                    },
                    (err) => {
                        console.error(err);
                    }
                )
        }else{
            Materialize.toast('Default format has errors!', 4000);
        }
    }

    getFormatFromId(formatId: string) : IFormat {
        let fmt: IFormat;
        for(let f of this.language.formats) {
            if(f.format === formatId) {
                fmt = f;
                break;
            }
        }
        return fmt;
    }
}