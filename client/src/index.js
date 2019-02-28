import React from 'react';
import ReactDOM from 'react-dom';
import LoadWeb3 from './LoadWeb3';
import HashFile from './HashFile';
import ExpiryDate from './ExpiryDate';
import CheckBox from './CheckBox';
import CheckState from './CheckState';
import Play from './Play';

import * as serviceWorker from './serviceWorker';
//<CheckBox first="first" second="second"/>
ReactDOM.render(
  <div>
    <HashFile/>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
