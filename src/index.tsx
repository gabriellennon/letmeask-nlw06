import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './services/firebase';

//posso importar em qualquer pagina que ele vai reconhecer como global
import './styles/global.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

