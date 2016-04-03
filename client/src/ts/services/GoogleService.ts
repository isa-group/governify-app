/**
 * Created by mrivero on 28/02/2016.
 */

import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from "rxjs/Observable";

/// <reference path="../d/gapi.d.ts" />

export interface User {
    email: string;
    displayName: string;
    picture?: string;
}

@Injectable()
export class GoogleService {

    gapi: any;
    clientId = "460896514595-568adgcd2u9j9ue8s1kmn5l2un6lieqt.apps.googleusercontent.com";
    scopes = [
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive',
        'profile',
        'email'
    ];
    headers: Headers;

    constructor(public http: Http){
        this.gapi = gapi;
        this.headers = new Headers();
    }

    authorize() {
        return new Promise((resolve, reject) => {
            let config: Object = {
                'client_id': this.clientId,
                'scope': this.scopes.join(' '),
                'immediate': true
            };
            this.gapi.auth.authorize(config,
                (token) => {
                    this.gapi.auth.setToken(token);
                    if (token && !token.error) {
                        resolve();
                    } else {
                        config['immediate'] = false;
                        gapi.auth.authorize(config, (token) => {
                            if (token && !token.error) {
                                resolve(token);
                            } else {
                                reject();
                            }
                        });
                    }
                })
        });
    }

    loadDriveFile(id: string) {
        let file: Object;

        return new Promise((resolve, reject)=> {
            this.gapi.client.load('drive', 'v2',
                () => {
                    let request = this.gapi.client.drive.files.get({'fileId': id});
                    request.execute((resp) => {
                        this.headers.append('Authorization', 'Bearer ' + this.gapi.auth.getToken().access_token);
                        resolve(resp);
                    });
                });
        });
    }

    getFileContent(downloadUrl: string){
        return  this.http.get(downloadUrl, {headers: this.headers});
    }

    getUserInfo(userId: any) {
        return new Promise((resolve, reject) => {
            let user: User;
            this.gapi.client.load('plus', 'v1').then(() => {
                let request = this.gapi.client.plus.people.get({
                    'userId': userId
                });

                request.execute((resp) => {
                    user = {
                        email: resp.emails[0].value,
                        displayName: resp.displayName,
                        picture: resp.image.url
                    };

                    resolve(user);
                });
            });
        });
    }

    saveFileToDrive(id: string, content: string, callback?) {
        var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + id,
            'method': 'PUT',
            'params': {'uploadType': 'media'},
            'headers': {
                'Content-Type': 'text/plain'
            },
            'body': content
        });

        request.execute(
            (resp) => {
                console.log('content updated');
                if (callback) callback();
            }
        );
    }

    uploadFileToDrive(content: string, fileName:string, parents: string[]){
        return new Promise((resolve, reject) => {
            gapi.client.load('drive', 'v2', () => {
                let request = gapi.client.request({
                    'path': '/drive/v2/files',
                    'method': 'POST',
                    'body':{
                        "title" : fileName,
                        "mimeType" : "text/plain",
                        "parents": parents,
                    }
                });
                request.execute(
                    (resp) => {
                        this.saveFileToDrive(resp.id, content, () => resolve());
                    }
                );
            });
        });
    }

}