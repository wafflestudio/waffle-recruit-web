import React from 'react';

import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Footer from './component/Footer';
import Main from './pages/problem/[probNum]';
import Submit from './pages/problem/[probNum]/submit';
import Signin from './pages/signin/Signin';
import Signup from './pages/signup/Signup';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/signin" exact render={() => <Signin />} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/problem/:prob_num" exact component={Main} />
          <Route path="/problem/:prob_num/submit" exact component={Submit} />
          <Redirect from="/" to="/signin" />
        </Switch>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;
