/**
 * Created by mrivero on 27/12/2015.
 */

/// <reference path="./d/ace.d.ts" />
/// <reference path="./d/gapi.d.ts" />
/// <reference path="./d/jquery.d.ts" />

import {Component, OnInit} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {LanguageService} from './services/languageService';
import {GoogleService} from './services/GoogleService';
import 'rxjs/Rx';
import { IConfiguration, ILanguage, IFormat, IOperation} from './interfaces';
import {Tabs} from './components/tabs';
import {Editor} from './components/editor';
import {Modal, ModalOptions, ModalButton} from './modal';
import authorize = gapi.auth.authorize;


@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
    directives: [Tabs, Editor],
    providers: [GoogleService]
})
export class AppComponent implements OnInit {
    /**
     *
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
    loading: boolean = true;
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
    /**
     * The modal dialog.
     * @type {Modal}
     */
    modal: Modal;
    /**
     * Whether the user is authorized.
     * @type {boolean}
     */
    authorize: boolean = false;

    constructor(public http: Http, private _languageService: LanguageService, private _GS: GoogleService) {}

    ngOnInit() {
        var self = this;
        new Promise((resolve, reject) => {
            gapi.load("auth2", () => {
                $('body').removeClass('unresolved');
                let googleAuth = gapi.auth2.init({
                    client_id: this._GS.clientId,
                    scope: "https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive email profile"
                    //cookie_policy: "none"
                });
                googleAuth.then(
                    () => {
                        resolve(googleAuth);
                    },
                    () => {
                        console.error("Google user can't be checked");
                        reject();
                    }
                );
                googleAuth.isSignedIn.listen((isAuth) => {
                    isAuth ? resolve(googleAuth) : reject();
                });
                //gapi.auth2.currentUser.listen(() => resolve(googleAuth));
            });
        }).then((googleAuth) => {
            this.authorize = googleAuth.isSignedIn.get();
            let scopes = 'profile email https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive';
            if (this.authorize) {
                let googleUser = googleAuth.currentUser.get();
                console.log(googleUser);
                console.log(googleUser.hasGrantedScopes(scopes));
                if (googleUser.hasGrantedScopes(scopes)) {
                    this.init();
                } else {
                    //googleUser.disconnect();
                    //this.createSignInButton(scopes);
                    googleUser.signIn({
                        'scope': 'profile email https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive'
                    });
                }
            } else {
                this.createSignInButton(scopes);
            }
        });
    }

    private createSignInButton(scopes) {
        new Promise((resolve, reject) => {
            gapi.signin2.render('my-signin2', {
                'scope': scopes,
                'width': 150,
                'height': 36,
                'longtitle': false,
                'theme': 'light',
                'onsuccess': resolve,
                'onfailure': reject
            });
        }).then(
            () => {
                this.authorize = true;
                this.init()
            },
            () => this.authorize = false
        );
    };

    init() {
        this.languages = {};

        let getConfigLang = new Promise((resolve, reject) => {
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
                                            (lang:ILanguage) => {
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
            this.fileId = this.getIdFromURL();
        });
    };

    getIdFromURL() {
        let pathname = window.location.pathname,
            regex = /^\/ids\/([\d\w]+)/g,
            match = regex.exec(pathname),
            result = null;
        if (match && match.length > 1) {
            result = match[1];
        }
        return result;
    }

    getUrlParameters(param: string) {
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
    }

    fileNameChangedEvent(fileName: string) {
        this.fileName = fileName;
    }


    initModal(options: ModalOptions){
        console.log('capturado evento INITmodal en appcomponent');
        console.log(options);
        if (!this.modal)
            this.modal = new Modal(options, $('#Modal'))
        else
            this.modal.setModal(options);
        this.modal.open();
    }

    updateModal([options, error]: [ModalOptions, boolean]){
        console.log('capturado evento UPDATEmodal en appcomponent');
        console.log(options);
        console.log(error);
        if (error)
            this.modal.setErrorMode();
        else
            this.modal.setSuccessMode();
        this.modal.updateContent(options.loadingIndicator, options.header, options.content, options.subheader);
    }
}
