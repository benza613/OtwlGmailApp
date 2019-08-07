// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  url: {
    // server: 'http://localhost:36690/OtwlGmailApp/Home.aspx',
    // uploadsGA: 'http://localhost:36690/OtwlGmailApp/UploadGA.ashx',
    // downloadsGA: 'http://localhost:36690/OtwlGmailApp/DownloadAttch.ashx',
    // previewGA: 'http://localhost:36690/OtwlGmailApp/PreviewAttch.ashx',
    // uploadPdf: 'http://localhost:36690/OtwlFileServer/Upload.ashx'

    server: 'http://localhost:3001/OtwlGmailApp/Home.aspx',
    uploadsGA: 'http://localhost:3001/OtwlGmailApp/UploadGA.ashx',
    downloadsGA: 'http://localhost:3001/OtwlGmailApp/DownloadAttch.ashx',
    previewGA: 'http://localhost:3001/OtwlGmailApp/PreviewAttch.ashx',
    uploadPdf: 'http://localhost:3001/OtwlFileServer/Upload.ashx'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
