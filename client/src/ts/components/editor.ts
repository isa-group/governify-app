/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />

import {Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter} from "angular2/core";
import {GoogleService} from "../services/GoogleService";
import {LanguageService} from '../services/languageService';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {ILanguage, IFormat, IOperation, IConfiguration, IAnnotations} from "../interfaces";
import {ActionButton} from './action-button.component';

@Component({
    selector: 'editor',
    templateUrl: 'templates/editor.html',
    providers: [LanguageService, GoogleService],
	directives: [ActionButton]
})
export class Editor implements OnChanges {
    @Input() id: string;
    @Input() selectedFormat: string;
    @Input() language: ILanguage;
    @Input() config: IConfiguration;
    @Output() fileExtension: EventEmitter<string> = new EventEmitter<string>();
    @Output() fileNameChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() disabledTabs: boolean;
    @Output() disabledTabsChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    editor: ace;
    saveTimeout;
    @Input() fileName: string;
    formatSettings: IFormat;
    oldFormatSettings: IFormat;
    hasError: boolean;
    ignoreChangeAceEvent: boolean = false;

    constructor(public http: Http, private _GS: GoogleService, private _languageService: LanguageService) {}

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
            this.setEditorParameters(this.language.formats[0]);
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
                            this.fileExtension.next(file.fileExtension);
                            this._GS.getFileContent(file.downloadUrl)
                                .map(res => res.text())
                                .subscribe(
                                    (content) => {
                                        this.replaceEditorContent(content);
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

        // Disable sintax error
        // this.editor.getSession().setUseWorker(true);

        //Remove 80character vertical line
        this.editor.setShowPrintMargin(false);
    }

    setAnnotations(annotations) {
        this.editor.getSession().setAnnotations(annotations);
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
            this._languageService.postCheckLanguage(this.config.languages[this.language.id], this.formatSettings.format, this.editor.getValue(), this.fileName)
                .subscribe(
                    (data: IAnnotations) => {
                        this.setAnnotations(data.annotations);
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
        this.editor.on('change', (content) => {
            if (!this.ignoreChangeAceEvent) {
                if (this.formatSettings.checkLanguage) {
                    this.checkEditorLanguage().then(() => {
                        if (!this.hasError) {
                            if (this.saveTimeout !== null) {
                                clearTimeout(this.saveTimeout);
                            }

                            this.saveTimeout = setTimeout(() => {
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
        let langId = this.config.languages[this.language.id],
            content = this.editor.getValue();

        if(!this.hasError /*&& content !== null && content !== ""*/) {
            this._languageService.convertLanguage(langId, oldFormatSettings, desiredFormat, content, this.fileName)
                .subscribe(
                    (res: IAnnotations) => {
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
            console.log('Default format has errors!');
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