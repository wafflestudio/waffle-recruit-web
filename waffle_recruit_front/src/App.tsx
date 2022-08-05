import React from 'react';

import ReactGA from 'react-ga';
import { Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Footer from './component/Footer';
import MainModal from './component/Modal/MainModal';
import AuthorizedRouter from './pages/AuthorizedRouter';
import UnauthorizedRouter from './pages/UnauthorizedRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

ReactGA.initialize('UA-204463168-1');

const App = () => {
  const { pathname } = useLocation();

  const isAuthNeeded = pathname.includes('problem') || pathname.includes('main') || pathname.includes('coverletter');

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
