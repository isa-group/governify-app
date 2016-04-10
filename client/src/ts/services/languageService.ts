import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from "rxjs/Observable";
import {ILanguage, IFormat, IOperation, ILanguageResponse} from '../interfaces'
// import 'rxjs/add/operator/timeout';



@Injectable()
export class LanguageService {

    constructor(public http: Http) { }

    getLanguage(languagePath: string){
        return this.http.get('/api/language' + languagePath)
            .map((res) => <ILanguage> res.json())
            // .do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    postCheckLanguage(languageId: string, format: string, content: string, fileUri: string){
        let url = '/api/language' + languageId + "/format/" + format + '/checkLanguage';
        let body = 'id='+format+'&content='+encodeURIComponent(content)+'&fileUri='+fileUri;
        let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('accept', 'application/json');
        let options = {
            headers: headers
        };

        return this.http.post(url, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    convertLanguage(languageId: string, currentFormat: string, desiredFormat: string, content: string, fileUri: string ){
        let url = '/api/convert' + languageId;
        let body =  'currentFormat='+currentFormat +
            '&desiredFormat='+ desiredFormat +
            '&fileUri='+ fileUri +
            '&content='+ encodeURIComponent(content);
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('accept', 'application/json');
        let options = {
            headers: headers
        };
        return this.http.post(url, body, options)
            .map(res => <ILanguageResponse> res.json())
            .catch(this.handleError);
    }

    executeOperation(languageId: string, operationId: string, content: string, fileUri: string ){
        let url = '/api/execute' + languageId + '/operation/' + operationId;
        let body =  'id=' + operationId +
            '&fileUri=' + fileUri +
            '&content=' + encodeURIComponent(content);
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('accept', 'application/json');
        let options = {
            headers: headers
        };
        return this.http.post(url, body, options)
            // .timeout(5000, 'limite alzando')
            .map(res => <ILanguageResponse> res.json())
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        // return Observable.throw(error.json().error || 'Server error');
        return Observable.throw('Server error');
    }

}