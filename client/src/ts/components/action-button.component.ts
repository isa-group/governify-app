/**
 * Created by mrivero on 23/03/2016.
 */
import {Component, Input, Output, SimpleChange, EventEmitter} from "angular2/core";
import {IOperation} from '../interfaces';

@Component({
    selector: 'action-button',
    templateUrl: 'templates/action-button.html'
})
export class ActionButton {
    @Input() operations: IOperation[];

    perform($event, operationId: string): void {
        $event.preventDefault();
    }
}