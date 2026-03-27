import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import { AuthProvider } from '@features/auth/AuthProvider';
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <BrowserRouter>
          <AuthProvider>
              <App /> 
                </AuthProvider>
      </BrowserRouter>
    {/* </Provider> */}
  </React.StrictMode>
);
