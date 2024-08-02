# Getting Started

### `npm run start` `yarn start`

Runs the application in development

### `npm run make` `yarn make`

Builds the app for production

### More Info

This project was bootstrapped with [electron-forge](https://www.electronforge.io/templates/typescript-+-webpack-template) with the typescript and webpack template.

It was then extended with the [react-typescript framework integration](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

Webpack was configured in order to structure the project files into mainProcess (electron codebase) and rendererProcess (react codebase) folders.

### TODOs

- Hide native media controls to replace with custom controls
- Create custom media controls and display in `VideoPlayer` component
- Bugfix: when playing back videos, user cannot begin recording and input is ignored, a better user experience would be to end playback
- Bugfix: native playback controls are hidden by media library when playing back, a better user experience could be to either hide the media library component when playing back or use custom media controls that have a better position
