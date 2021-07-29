import React from 'react';

import { Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import Footer from './component/Footer';
import Main from './containers/Main';
import Signin from './containers/Signin';
import Signup from './containers/Signup';

import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/signin" exact render={() => <Signin />} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/main/:prob_num" exact component={Main} />
          <Redirect from="/" to="/signin" />
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
