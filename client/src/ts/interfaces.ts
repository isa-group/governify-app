// app.component
export interface IConfiguration {
    languages: Object ,
    images: {
        logo: string,
        search: string
    },
    googleAnalyticsID?: string,
    configurationFiles?: Object,
    workbenchName?: string,
    helpURI?: string,
    baseURI: string
}

// language services
export interface ILanguage {
    id: string;
    extension: string;
    defaultFileName: string;
    formats: IFormat[];
    operations: IOperation[];
    templateProjects?: string;
    templateFiles?: string;
    inspectorLoader?: string;
}

export interface IFormat {
    format: string;
    editorModeId: string;
    _editorModeURI: string;
    editorThemeId: string;
    _editorThemeURI: string;
    action: any;
    checkLanguage: boolean;
}

export interface IOperation {
    id: string,
    name: string,
    _remoteExecution: string,  // It is a bool string. eg "true"
    data: Object,
    action: string;
}

export interface ILanguageResponse {
    annotations: any[];
    context: any;
    customStruct: any;
    data: any;
    fileUri: string;
    htmlMessage: any;
    message: any;
    status: string;
}