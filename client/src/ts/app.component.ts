/**
 * Created by mrivero on 27/12/2015.
 */

/// <reference path="./d/ace.d.ts" />
/// <reference path="./d/gapi.d.ts" />
/// <reference path="./d/jquery.d.ts" />

import {Component} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {LanguageService} from './services/languageService';
import {GoogleService} from './services/GoogleService';
import 'rxjs/Rx';
import { IConfiguration, ILanguage, IFormat, IOperation, IUser} from './interfaces';
import {Tabs} from './components/tabs';
import {Editor} from './components/editor';


@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
    directives: [Tabs, Editor],
    providers: [GoogleService]
})
export class AppComponent {
    /**
     * The logged user's information. Contains the user's avatar and contact info.
     * @type {IUser}
     */
    user: IUser;
    /**
     * Instance of the ACE editor.
     */
    editor: any;
    /**
     * The app title that will hold the file name.
     * @type {string}
     */
    fileName: string  = 'Governify';
    /**
     * File id that comes from the URL parameter. It's used on the [Editor] component for retrieving
     * the file's content.
     * @type {string}
     */
    fileId: string;
    /**
     * The loading file's extension. This attribute is received from the [Editor] component and
     * it's used for loading the [extensions] tabs.
     * @type {string}
     */
    fileExtension: string;
    /**
     * True when the application has loaded all the initial components.
     * @type {boolean}
     */
    loaded: boolean = false;
    /**
     * Initial app configuration containing the manifests of all the [languages].
     * @type {IConfiguration}
     */
    configuration: IConfiguration;
    /**
     * Languages contained on [configuration]. It's a map which keys are file's extensions.
     * @type {Map<string, ILanguage>}
     */
    languages: { [key:string]: ILanguage };
    /**
     * Define the selected tab from [Tabs] web component.
     * @type {string}
     */
    selectedFormat: string = '';
    /**
     * Different extensions on the [languageSettings] used on [Tabs] to create every tab.
     * @type {string[]}
     */
    extensions: string[] = [''];
    /**
     * Language of the loaded file retrieved from [languages].
     * @type {ILanguage}
     */
    languageSettings: ILanguage;
    /**
     * Whether the tabs are disabled.
     * @type {boolean}
     */
    disabledTabs: boolean = false;

    constructor(public http: Http, private _languageService: LanguageService, private _GS: GoogleService) {
        $('body').removeClass('unresolved');

        this.languages = {};

        let getConfigLang =  new Promise ((resolve, reject) => {
            this.http.get('/api/configuration')
                .map(res => res.json())
                .subscribe(
                (data) => {
                    this.configuration = data;
                    let aLenguagesDeferred = [];
                    $.each(this.configuration.languages, (languageId, languagePath) => {
                        aLenguagesDeferred.push((() => {
                            let d = new Promise((resolve, reject) => {
                                this._languageService.getLanguage(languagePath)
                                    .subscribe(
                                    (lang: ILanguage) => {
                                        this.languages[lang.extension] = lang;
                                        resolve();
                                    },
                                    (err) => {
                                        console.error(err);
                                        reject();
                                    });
                            });
                            return d;
                        })());

                    });

                    Promise.all(aLenguagesDeferred).then(() => resolve(), ()=> reject());
                },
                (err) => {
                    console.error(err);
                })
        });

        Promise.all([
            getConfigLang
        ]).then(() => {
            this.fileId = this.getUrlParameters('ids');
        });

    }

    getUrlParameters(param) {
        let result = null,
            query = window.location.search,
            map: Object = {};
        if(param === null || query === '') {
            return result;
        }

        let groups: string[] = query.substr(1).split("&");
        for (let i in groups) {
            let [key, val] = groups[i].split("=");
            map[key] = val;
        }
        if (map != null) {
            var value = map[param];
            try{
                result=JSON.parse(value);
            }catch(e){
                result = value;
            }
        }
        return result;
    }

    extensionSelectedEvent(ext: string) {
        this.languageSettings = this.languages[ext];
        let formats = this.languageSettings.formats;
        this.extensions = [];
        for(let f of formats){
            this.extensions.push(f.format);
        }
        this.selectedFormat = this.extensions[0];
        $('ul.tabs').tabs();
        setTimeout(() => $(window).trigger('resize'), 100);
    }

    fileNameChangedEvent(fileName: string) {
        this.fileName = fileName;
        this.loaded = true;
    }

}
