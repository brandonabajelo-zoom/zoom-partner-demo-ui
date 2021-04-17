import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/styles.scss';
import 'antd/dist/antd.css';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { configure } from 'axios-hooks';

import App from './App';
import reportWebVitals from './reportWebVitals';

require('dotenv').config();

const apiHost = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.baseURL = apiHost;

configure({ cache: false });

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
