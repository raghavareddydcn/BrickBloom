import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Normalize any hash route (e.g. /#/admin) into regular path before mounting router
if (window.location.hash && window.location.hash.startsWith('#/')) {
  const target = window.location.hash.slice(1);
  window.history.replaceState(null, '', target);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

