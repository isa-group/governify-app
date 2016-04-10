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
    @Input() operations: IOperation[];
    @Input() languagePath: string;
    @Input() fileContent: string;
    @Input() fileUri: string;
    @Input() fileParents: string[];
    @Output() initModal: EventEmitter<ModalOptions> = new EventEmitter();
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
    $modal: JQuery = $('#executeModal');

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
        console.log('emit initmodal')
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
                                    () =>{
                                        let options: ModalOptions = {
                                            header: operationName,
                                            subheader: subheader,
                                            content: res.message,
                                            loadingIndicator: false
                                        }
                                        console.log('emit updatemodal')
                                        this.updateModal.emit([options, false]);

                                        // this.replaceModalContentSuccess(false, operationName, res.message, subheader);
                                    }
                                );
                        } else {
                            let options: ModalOptions = {
                                header: operationName,
                                subheader: subheader,
                                content: res.message,
                                loadingIndicator: false
                            }
                            console.log('emit updatemodal')
                            this.updateModal.emit([options, false]);
                            // this.replaceModalContentSuccess(false, operationName, res.message, subheader);
                        }
                    } else {
                        if (!res.message || res.message == "") options.content = "An error has happened.";
                        console.log('emit updatemodal')
                        this.updateModal.emit([options, true]);
                        // this.replaceModalContentError(false, operationName, res.message);
                    }
                },
                (err) => {
                    console.error(err);
                }
            );
    }

}