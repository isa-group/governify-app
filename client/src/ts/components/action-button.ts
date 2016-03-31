/**
 * Created by mrivero on 23/03/2016.
 */
import {Component, Input, Output, SimpleChange, EventEmitter} from 'angular2/core';
import {IOperation} from '../interfaces';

@Component({
    selector: 'action-button',
    templateUrl: 'templates/action-button.html'
})
export class ActionButton {
    @Input() operations: IOperation[];
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

    perform($event, operationId: string): void {
        $event.preventDefault();
    }
}