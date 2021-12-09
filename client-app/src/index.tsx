import { createBrowserHistory } from 'history';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import App from './app/layout/App';
import ScrollToTop from './app/layout/ScrollToTop';
import './app/layout/styles.css';
import { store, StoreContext } from './app/stores/store';
import reportWebVitals from './reportWebVitals';

export const history = createBrowserHistory();

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <ScrollToTop />
      <App />
    </Router>
  </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
