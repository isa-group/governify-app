/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, Output, EventEmitter, AfterViewInit} from 'angular2/core';

@Component({
    selector: 'tabs',
    templateUrl: 'templates/tabs.html'
})
export class Tabs implements AfterViewInit{
    /**
     * Values for each tab.
     * @type {string[]}
     */
    @Input() tabs: string[];
    /**
     * Selected tab.
     * @type {string}
     */
    @Input() selectedFormat: string;
    /**
     * Whether the tabs are disabled.
     * @type {boolean}
     */
    @Input() disabledTabs: boolean;
    /**
     * EventEmitter to emit the changes in disabledTabs.
     * @type {EventEmitter}
     */
    @Output() disabledTabsChange: EventEmitter<boolean> = new EventEmitter();
    /**
     * EventEmitter to emit the selected tab.
     * @type {EventEmitter}
     */
    @Output() selectedFormatChange: EventEmitter<String> = new EventEmitter();

    /**
     * Updates the selected format to be the clicked one.
     * @param $event
     * @param newFormat {string}
     */
    setSelectedTab($event, newFormat: string): void {
        $event.preventDefault();
        if (this.selectedFormat === newFormat || this.disabledTabs) {
            return;
        }
        this.disabledTabsChange.emit(true);
        this.selectedFormatChange.emit(newFormat);
    }

    /**
     * Initialilize the materialisecss tabs.
     */
    ngAfterViewInit(){
        $('ul.tabs').tabs();

        // Force the tab to be rendered correctly.
        setTimeout(() => $(window).trigger('resize'), 0);
    }
}