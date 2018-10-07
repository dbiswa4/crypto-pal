import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {register} from './serviceWorker';
// import { unregister } from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import reducer from './reducers'
import { Provider } from 'react-redux'

// mandatory
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

import './index.css';

const store = createStore(
  reducer,
)

//<BrowserRouter basename={'/app_console'}>
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
register();
// unregister();
