/**
 * Created by mrivero on 23/03/2016.
 */
/// <reference path="../d/jquery.d.ts" />

import {Component, Input, Output, SimpleChange, EventEmitter} from 'angular2/core';
import {IOperation, ILanguageResponse} from '../interfaces';
import {LanguageService} from  '../services/languageService';
import {GoogleService} from  '../services/GoogleService';
import {RemoteOperationsOnly} from '../pipes/remoteOperationsOnly';
import {ModalOptions, ModalButton} from '../modal';


@Component({
    selector: 'action-button',
    templateUrl: 'templates/action-button.html',
    providers: [LanguageService, GoogleService],
    pipes: [RemoteOperationsOnly]
})
export class ActionButton {
    /**
     * The list of operations available on a language.
     * @type {IOperation[]}
     */
    @Input() operations: IOperation[];
    /**
     * The relative path of the language within the url.
     * @type {string}
     */
    @Input() languagePath: string;
    /**
     * The file's content.
     * @type {string}
     */
    @Input() fileContent: string;
    /**
     * The file uri.
     * @type {string}
     */
    @Input() fileUri: string;
    /**
     * The list of parent files.
     * @type {string[]}
     */
    @Input() fileParents: string[];
    /**
     * The emitter that initiates the modal.
     * @type {EventEmitter}
     */
    @Output() initModal: EventEmitter<ModalOptions> = new EventEmitter();
    /**
     * The emitter that updates the modal.
     * @type {EventEmitter}
     */
    @Output() updateModal: EventEmitter<[ModalOptions, boolean]> = new EventEmitter();

    iconMap: Object = {
        "CheckCompliance": "assignment_turned_in",
        "checkComplianceAuto": "assignment_turned_in",
        "checkConsistency": "spellcheck",
        "ComplianceAnalisys": "assignment_turned_in",
        "computestats" : "equalizer",
        "execute": "settings",
        "generateAFM": "build",
        "generateOPL": "build",
        "getOptimalConfiguration": "monetization_on",
        "multiplecomparison" : "compare",
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

    constructor( private _GS: GoogleService, private _languageService: LanguageService){}

    executeOperation($event, operationId){
        $event.preventDefault();

        let basicOperations: string[] = ['checkConsistency', 'smallsampling', 'multiplecomparison', 'execute'],
            generativeOperations: string[] = ['generateOPL', 'generateAFM'],
            allowedOperations: string[] = [...basicOperations,  ...generativeOperations],
            notAllowedOperation = ['CheckCompliance', 'outofrange', 'computestats']

        if(allowedOperations.indexOf(operationId) == -1 ){
            if(notAllowedOperation.indexOf(operationId)){
                console.warn('Operation "' + operationId + '" not allowed.');
                return this;
            }

            console.error('Operation "' + operationId + '" not listed.');
            return;
        }

        let operationName;
        for (let operation of this.operations){
            if (operation.id === operationId){
                operationName = operation.name;
                break;
            }
        }
        this.initModal.emit({header:operationName, loadingIndicator:true});
        this._languageService.executeOperation(this.languagePath, operationId, this.fileContent, this.fileUri)
            .subscribe(
                (res: ILanguageResponse) => {
                    let options : ModalOptions = {
                        header: operationName,
                        content: res.message,
                        subheader: '',
                        loadingIndicator: false
                    };
                    if(res.status != 'OK_PROBLEMS' && res.status != "ERROR") {
                        let subheader: string;
                        if (res.fileUri && res.fileUri !== "") {
                            options.subheader = "File: " + res.fileUri;
                        }

                        if(generativeOperations.indexOf(operationId) > -1){
                            this._GS.uploadFileToDrive(res.data, res.fileUri, this.fileParents)
                                .then(
                                    () => {
                                        let options: ModalOptions = {
                                            header: operationName,
                                            subheader: subheader,
                                            content: res.message,
                                            loadingIndicator: false
                                        }
                                        this.updateModal.emit([options, false]);
                                    }
                                );
                        } else {
                            let options: ModalOptions = {
                                header: operationName,
                                subheader: subheader,
                                content: res.message,
                                loadingIndicator: false
                            }
                            this.updateModal.emit([options, false]);
                        }
                    } else {
                        // OK_PROBLEMS or ERROR
                        if (!res.message || res.message == "") options.content = "An error has happened. Please try again.";
                        this.updateModal.emit([options, true]);
                        // this.replaceModalContentError(false, operationName, res.message);
                    }
                },
                (err) => {
                    // Error in the ajax call.
                    this.updateModal.emit([{header: operationName,
                            content: 'Error executing operation. Please try again.',
                            loadingIndicator: false
                        }, true]);
                }
            );
    }

}