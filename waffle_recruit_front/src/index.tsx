import React from 'react';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthContextProvider } from './context/authContext';
import store from './redux/store';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
//
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false,
//       queryFn: async ({ queryKey }) => {
//         try {
//           const response = await authRequester.get(queryKey[0] as string);
//           return response.data;
//         } catch (e) {
//           //throw new Error(e);
//         }
//       },
//     },
//   },
// });

ReactDOM.render(
  <AuthContextProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </AuthContextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
