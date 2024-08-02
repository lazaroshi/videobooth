# About Videbooth

This project started as a takehome exercise for `sewerai-org` but I found building the electron app to be fun and a good way to explore some video processing technologies I was interested in toying around with so I decided to expand it. The UI is inspired by OSX's Photo booth.

## Tech Stack

Backend: Electron
Frontend: React
CSS: styled-components

## Getting Started

### `npm run start` | `yarn start`

Runs the application in development, concurrently starting backend and frontend processes

### `npm run make` | `yarn make`

Builds the app for production

## Tech Stack Reasoning

### Mainly Typescript codebase

There are multiple advantanges to developing with a strongly typed language. Mostly to ensure type safety and prevent runtime errors, but can also provide self-documentated code and encourage better programming practices. Since the electron backend and frontend are both typescript, API contracts between the two are clearer and easier to design.

### Electron

Electron is best used for general-purpose applications and has a robust ecosystem with build methods for most operating systems. It can be considered overkill for a small project like this and might be more resource-heavy compared to other desktop app frameworks like `Tauri` or `Neutralino.js`. Electron's integration with Chromium however can be useful for dealing with web technologies in a standardized way.

### React

React offers several advantages over other frameworks, namely its virtual DOM and strong community and ecosystem. This allows for a flexible solution with good performance and a wide range of support. I have found JSX to be a great way to integrate JS into HTML in a readable way compared to soley working with HTML templates.

### styled-components

styled-components provides component based CSS styling that follows React's prop based development. It is a resilient CSS package that can handle dynamic styles easily, integrates with JSX nicely, is colocated with components, and prevents styling leakage.

## Code Architecture

### Foundational details

This project was bootstrapped with [electron-forge](https://www.electronforge.io/templates/typescript-+-webpack-template) with the typescript and webpack template.

It was then extended with the [react-typescript framework integration](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

Webpack was configured in order to structure the project files into main (electron codebase) and renderer (react codebase) folders.
The code is located in `src` folder that is organized between the processes that electron supervises.

### Generally...

Maintaining clean divisions between the processes makes them modular which in turn makes this project flexible. For instance, if we wanted to drop Electron from this project and be completely web-based, all one would need to do is replace the api calls on the frontend.

### On Electron

I consider it good practice to have the electron `index.ts` solely define window creation and window management functions. To init handlers to communicate with the renderer `index.ts` calls upon `setupIpcHandlers` on window creation. Inter process communication handlers are all defined in `ipc.ts`. Lastly, `preload.ts` defines the interface between main and renderer supported by `interface.d.ts`.

### On React

I find it good practice to componentize only when components need to be reused or when refs or state variables need to be encapsulated with JSX to handle rerendering and deconstructors (although the latter might be less of a good reason since React's useEffect batching). This results in clearer code that won't require frequent file switching for developers. Since Electron and React draw from the same types, contracts are strongly coupled. API calls are handled in the `services` folder.

## TODOs

- Hide native media controls to replace with custom controls
- Create custom media controls and display in `VideoPlayer` component
- Bugfix: when playing back videos, users cannot begin recording and input is ignored, a better user experience would be to end playback, start webcam, and start recording
- Bugfix: native playback controls are hidden by media library when playing back, a better user experience could be to either hide the media library component when playing back or use custom media controls that have a better position
- Bugfix: MP4 needs encoding
- Add husky and commitlint for commit linting
- Add codefences to ensure best practices
- Add facial recognition and facial landmarks
- Add facial video filters

## Other Ideas

### Other features

- Webgl can add shader video effects on the frontend

### It would be interesting...

- to explore and compare ffmpeg compiled for webassembly and ffmpeg provided in the backend for processing videos
- to compare performance between webassembly and fastapi
- to compare performance provided by FastAPI and ONNX(uses webGL too)
