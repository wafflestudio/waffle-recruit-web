import React, { useEffect, useState } from 'react';

import ReactGA from 'react-ga';
import { Switch, useHistory, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button, Header, Loader, Modal } from 'semantic-ui-react';

import { requester } from './apis/requester';
import Footer from './component/Footer';
import MainModal from './component/Modal/MainModal';
import { useAuthContext } from './context/authContext';
import AuthorizedRouter from './pages/AuthorizedRouter';
import UnauthorizedRouter from './pages/UnauthorizedRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

ReactGA.initialize('UA-204463168-1');

const App = () => {
  const [isTokenChecked, setTokenChecked] = useState<boolean>(false);
  const { setUser, clearUser, setCsrf } = useAuthContext();
  const history = useHistory();
  const { pathname, search } = useLocation();

  const isAuthNeeded = pathname.includes('problem') || pathname.includes('main');

  useEffect(() => {
    ReactGA.pageview(search + pathname);
  }, [search, pathname]);

  /* useEffect(() => {
    requester.get<{ user?: string; token: string }>('/check/token/').then((res) => {
      setTokenChecked(true);
      setCsrf(res.data.token);
      requester.defaults.headers['X-CSRFToken'] = res.data.token;
      if (!res.data.user && isAuthNeeded) {
        clearUser();
        history.replace('/signin');
      } else if (res.data.user) {
        setUser(res.data.user);
        if (!isAuthNeeded) {
          history.replace('main');
        }
      }
    });
  }, [pathname]);
*/
  //  if (!isTokenChecked) return <Loader active />;

  return (
    <>
      <div className="App">
        <Switch>{isAuthNeeded ? <AuthorizedRouter /> : <UnauthorizedRouter />}</Switch>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MainModal />
    </>
  );
};

export default App;
