/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />

import {Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter} from "angular2/core";
import {GoogleService} from "../services/GoogleService";
import {LanguageService} from '../services/languageService';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {ILanguage, IFormat, IOperation, IConfiguration, IAnnotations} from "../interfaces";


@Component({
    selector: 'editor',
    templateUrl: 'templates/editor.html',
    providers: [LanguageService, GoogleService]
})
export class Editor implements OnChanges {
    @Input() id: string;
    @Input() format: string;
    @Input() language: ILanguage;
    @Input() config: IConfiguration;
    @Output() fileExtension: EventEmitter<string> = new EventEmitter<string>();
    @Output() fileNameChange: EventEmitter<string> = new EventEmitter<string>();
    editor: ace;
    saveTimeout;
    fileName: string;
    selectedFormat: IFormat;
    oldFormat: IFormat;
    hasError: boolean;
    ignoreChangeAceEvent: boolean = false;

    constructor(public http: Http, private _GS: GoogleService, private _languageService: LanguageService) {}

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
            this.setEditorParameters(this.language.formats[0]);
        }

        if (changes['format']) {
            if (Object.keys(changes['format'].previousValue).length > 0 && Object.keys(changes['format'].currentValue).length > 0
                || (changes['format'].currentValue != "" && changes['format'].previousValue != "")) {

                if (this.language != undefined) {
                    this.oldFormat = this.getFormatFromId(changes["format"].previousValue);
                    this.selectedFormat = this.getFormatFromId(changes["format"].currentValue);
                    if (this.selectedFormat.checkLanguage) {
                        this.convertLanguage(this.selectedFormat.format, this.oldFormat.format);
                        this.checkEditorLanguage();
                    } else {
                        this.convertLanguage(this.selectedFormat.format, this.oldFormat.format);
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

    setAnnotations(annotations) {
        this.editor.getSession().setAnnotations(annotations);
    }

    initAce() {
        this.editor = ace.edit("editor");

        // Disable sintax error
        this.editor.getSession().setUseWorker(false);

        //Remove 80character vertical line
        this.editor.setShowPrintMargin(false);
    }

    replaceEditorContent(newContent: string) {
        this.ignoreChangeAceEvent = true;
        this.editor.setValue(newContent, -1);
        if (this.selectedFormat.checkLanguage) {
            this.checkEditorLanguage();
        }
        this.ignoreChangeAceEvent = false;
    }

    setEditorParameters(selectedFormat: IFormat){
        this.selectedFormat = selectedFormat;

        if(this.selectedFormat.editorThemeId){
            this.editor.setTheme(this.selectedFormat.editorThemeId);
        }
        if(this.selectedFormat.editorModeId){
            this.editor.getSession().setMode(this.selectedFormat.editorModeId);
        }
    }

    checkEditorLanguage() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._languageService.postCheckLanguage(this.config.languages[this.language.id], this.selectedFormat.format, this.editor.getValue(), this.fileName)
                .subscribe(
                    (data: IAnnotations) => {
                        this.setAnnotations(data.annotations);
                        if (data.status === 'OK'){
                            this.hasError = false;
                        } else {
                            this.hasError = true;
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
                if (this.selectedFormat.checkLanguage) {
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

    convertLanguage(desiredFormat: string, oldFormat: string){
        let langId = this.config.languages[this.language.id],
            content = this.editor.getValue();

        if(!this.hasError /*&& content !== null && content !== ""*/) {
            this._languageService.convertLanguage(langId, oldFormat, desiredFormat, content, this.fileName)
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