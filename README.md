# ExamClient
uses [TypeScript](https://typescriptlang.org/), [Angular](https://angular.io/) and [NgZorro](https://ng.ant.design/)    
you could also deloy the project on desktop via [Electron](https://electron.atom.io/)
## Development
* install [node.js](https://nodejs.org/en/)
* intall typescript support by running `npm install -g typescript typings`
* install angular-cli by running `npm install -g @angular/cli`
* clone the code to your local repo
* enter the project root dir and run `npm install`
* run `npm run start` to debug the web version (localhost:4200)
* run `npm run start electron` to debug the electron desktop version
## Deployment
* run `npm run packWeb` to build web app
* run `npm run packWin64 or buildPackWin64` to build desktop app