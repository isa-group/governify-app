/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, Output, SimpleChange, EventEmitter} from "angular2/core";

@Component({
    selector: 'tabs',
    templateUrl: 'templates/tabs.html',
})
export class Tabs {
    @Input() tabs : string[];
    @Output() changeTab: EventEmitter<string> = new EventEmitter();
    @Input() selectedFormat: string;

    setSelectedTab($event,  language: string): void{
        $event.preventDefault();
        if(this.selectedFormat === language)
            return;
        this.selectedFormat= language;
        this.changeTab.emit(this.selectedFormat);
    }
}