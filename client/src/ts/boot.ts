/**
 * Created by mrivero on 27/12/2015.
 */
import {bootstrap} from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {Http, HTTP_PROVIDERS, Response, Request} from 'angular2/http';
import {LanguageService} from './services/languageService';

bootstrap(AppComponent, [HTTP_PROVIDERS, LanguageService]);