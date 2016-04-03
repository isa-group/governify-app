/**
 * Created by mrivero on 23/03/2016.
 */
/// <reference path="../d/jquery.d.ts" />

import {Component, Input, Output, SimpleChange, EventEmitter} from 'angular2/core';
import {IOperation, ILanguageResponse} from '../interfaces';
import {LanguageService} from  '../services/languageService';
import {GoogleService} from  '../services/GoogleService';
import {RemoteOperationsOnly} from '../pipes/remoteOperationsOnly'

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

        this.initModal(true, operationName);
        this._languageService.executeOperation(this.languagePath, operationId, this.fileContent, this.fileUri)
            .subscribe(
                (res: ILanguageResponse) => {
                    if(res.status != 'OK_PROBLEMS' && res.status != "ERROR") {
                        let subheader;
                        if (res.fileUri && res.fileUri !== "") {
                            subheader = "File: " + res.fileUri;
                        }

                        if(generativeOperations.indexOf(operationId) > -1){
                            this._GS.uploadFileToDrive(res.data, res.fileUri, this.fileParents)
                                .then(
                                    () =>{
                                        this.replaceModalContentSuccess(false, operationName, res.message, subheader);
                                    }
                                );
                        } else {
                            this.replaceModalContentSuccess(false, operationName, res.message, subheader);
                        }
                    } else {
                        if (!res.message || res.message == "") res.message = "An error has happened.";
                        this.replaceModalContentError(false, operationName, res.message);
                    }
                },
                (err) => {
                    console.error(err);
                }
            );
    }

    initModal(spinner: boolean, header?: string, content?: string, subheader?: string){
        this.replaceModalContentSuccess(spinner, header, content, subheader);
        this.$modal.openModal({
            dismissible: false
        });
    }

    replaceModalContentSuccess(spinner: boolean, header?: string, content?: string, subheader?: string){
        this.$modal.find('.modal-content .modal-body').removeClass("red-text");
        this.replaceModalContent(spinner, header, content, subheader);
    }

    replaceModalContentError(spinner: boolean, header?: string, content?: string, subheader?: string){
        this.$modal.find('.modal-content .modal-body').addClass("red-text");
        this.replaceModalContent(spinner, header, content, subheader);
    }

    replaceModalContent(spinner: boolean, header?: string, content?: string, subheader?: string) {
        if (!header) header = "";
        if (!content) content = "";
        if (!subheader) subheader = "";

        if(spinner === true){
            this.$modal.addClass('spinner');
        } else {
            this.$modal.removeClass('spinner');
        }

        if (content){
            content = content.replace(/<.*?>/g, '');
        }

        this.$modal.find('.modal-content .modal-header').html(header);
        this.$modal.find('.modal-content .modal-subheader').html(subheader);
        this.$modal.find('.modal-content .modal-body').html(content);

    }
}