# Zoom-Partner-Demo-UI

React sample application bootstrapped with [Create React App](https://github.com/facebook/create-react-app) which utilizes the [Zoom Web SDK](https://marketplace.zoom.us/docs/sdk/native-sdks/web) and [Zoom-Partner-Demo-Api](https://github.com/brandonabajelo-zoom/zoom-partner-demo-api). Follow the installation guide on this api and start your api server before continuing here.

## Installation

`git clone https://github.com/brandonabajelo-zoom/zoom-partner-demo-ui.git`


## Setup

1. Enter project directory

`cd zoom-partner-demo-ui`

2. Install project dependencies

`npm install` or `yarn install` (recommended)

3.  In the root directory of the project, create a `.env` file where you will store your relevant keys and variables. This file should also be added to your `.gitignore` file so your keys are not exposed to github

`touch .env`

4. Inside this `.env` file, provide the following keys.

`REACT_APP_ZOOM_API_KEY=xxxxx` [Api Key Generation](https://marketplace.zoom.us/develop/create)

`REACT_APP_SIGNATURE_ENDPOINT=xxxxx` [Signature Generation](https://github.com/zoom/websdk-sample-signature-node.js)

## Usage

5. Once your `.env` is configured properly, run the app and navigate to [http://localhost:3000](http://localhost:3000)

`npm start` or `yarn start`

6. Upon successful installation of the UI + API, you should be navigated to the landing page and you can begin exploring the capabilities of Zoom's api's and web sdks!

![Screen Shot 2021-04-28 at 6 13 50 PM](https://user-images.githubusercontent.com/81645097/116490939-88713200-a84d-11eb-9f44-800964433763.png)

