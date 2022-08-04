import React, { useEffect } from 'react';

import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { authRequester } from '../apis/requester';

import GitHub from './github/GitHub';
import Signin from './signin/Signin';
import Signup from './signup/Signup';

const UnauthorizedRouter: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    //check login
    const isLoggedIn = false;
    if (isLoggedIn) {
      history.push('/main');
    }
  }, []);

  return (
    <>
      <Route path="/signin" exact component={Signin} />
      <Route path="/github" exact component={GitHub} />
      <Redirect to="/signin" />
    </>
  );
};

export default UnauthorizedRouter;
