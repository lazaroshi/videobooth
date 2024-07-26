# Getting Started

To run the app in development mode:
`npm run electron-dev`
`yarn electron-dev`

To build the app:
`npm run dist`
`yarn dist`

## More Info

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) with `--template typescript` and augmented with the following additional scripts to better run `electron`:

- ### `electron`
  Runs the electron app in dev mode. Needs react app running beforehand
- ### `electron-dev`
  Uses `concurrently` to build the react app and then run electron
- ### `dist`
  Builds the app for production using `electron-builder`
- ### `predist`
  pre command leveraging `copy-file` to move electron.js to public folder for electron-builder's opinionated build, at the reccomendation of [this guide](https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3)

For styling in the react app, `styled-components` was added

## Other Available Scripts Created By Create React App

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
