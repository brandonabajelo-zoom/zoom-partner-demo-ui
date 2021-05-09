# Zoom-Partner-Demo-UI

Virtual Event sample application bootstrapped with [Create React App](https://github.com/facebook/create-react-app) that utilizes the [Zoom Web SDK](https://marketplace.zoom.us/docs/sdk/native-sdks/web) and [Zoom-Partner-Demo-Api](https://github.com/brandonabajelo-zoom/zoom-partner-demo-api). Follow the installation guide on the demo api before continuing here.

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

## Features

#### Note: Zoom provides a variety of different meeting and webinar types. In this application, only type: 2 [Scheduled Meetings](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate) and type: 5 [Nonrecurring Webinars](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarcreate) are used as default.

### Users
* View active/pending users
* Create/edit users
* Update user settings (add features)

### Webinars
* View/edit webinars
* Schedule new webinars
* View webinar participants/registrants
* Webinar registration (create/approve/deny registrants)
* Start webinars via Web SDK

### Meetings
* View/edit meetings
* Schedule new meetings
* View meeting participants
* Start meetings via Web SDK

### Live Dashboard
* View live meetings dashboard report
* View live webinars dashboard report

### Reports
* View meeting/webinar reports

### Cloud Recordings
* View cloud recordings
* Delete cloud recording

## Zoom API's
#### To view which Zoom API's are being used to provide data to each component, simply click the info icon associated with each header text:

![Screen Shot 2021-05-05 at 3 43 27 PM](https://user-images.githubusercontent.com/81645097/117219273-ca542800-adb9-11eb-87cd-333a1dac0dfd.png)

