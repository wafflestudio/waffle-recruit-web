import React from 'react';

import ReactGA from 'react-ga';
import { Switch, useHistory, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Footer from './component/Footer';
import MainModal from './component/Modal/MainModal';
import AuthorizedRouter from './pages/AuthorizedRouter';
import UnauthorizedRouter from './pages/UnauthorizedRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

ReactGA.initialize('UA-204463168-1');

const App = () => {
  const { pathname, search } = useLocation();

  const isAuthNeeded = pathname.includes('problem') || pathname.includes('main') || pathname.includes('coverletter');

  //  useEffect(() => {
  //    ReactGA.pageview(search + pathname);
  //  }, [search, pathname]);

  /*리팩토링*/
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
