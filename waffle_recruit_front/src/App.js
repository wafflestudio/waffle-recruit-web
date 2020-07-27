import React, {Component} from 'react';
import './App.css';

import {Route, Redirect, Switch, BrowserRouter} from 'react-router-dom';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import Main from './containers/Main';
import Footer from './component/Footer'

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/signin" exact render={() => <Signin/>}/>
            <Route path="/signup" exact component={Signup}/>
            <Route path="/main/:prob_num" exact component={Main}/>
            <Redirect from="/" to="/signin"/>
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
