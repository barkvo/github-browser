import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from 'notistack';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/*
ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <Router>
        <App />
      </Router>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
*/

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <Router>
        <App />
      </Router>
    </SnackbarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



