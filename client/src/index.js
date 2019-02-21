import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
//import HashFile from './HashFile';
//import SignHash from './SignHash';
import SignerListForm from './SignerListForm';
//import LoadWeb3 from './LoadWeb3';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <div>
  <SignerListForm />
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
