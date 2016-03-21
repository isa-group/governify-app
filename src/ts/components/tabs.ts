/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, Output, SimpleChange, EventEmitter} from "angular2/core";

@Component({
    selector: 'tabs',
    templateUrl: 'templates/tabs.html'
})
export class Tabs {
    @Input() tabs: string[];
    @Input() selectedFormat: string;
    @Input() disabledTabs: boolean;
    @Output() disabledTabsChange: EventEmitter<boolean> = new EventEmitter();
    @Output() selectedFormatChange: EventEmitter<String> = new EventEmitter();

    setSelectedTab($event, newFormat: string): void {
        $event.preventDefault();
        if (this.selectedFormat === newFormat || this.disabledTabs) {
            return;
        }
        this.disabledTabsChange.emit(true);
        this.selectedFormatChange.emit(newFormat);
    }
}