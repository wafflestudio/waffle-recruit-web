import React from 'react';

import { Redirect, Route } from 'react-router-dom';

import Signin from './signin/Signin';
import Signup from './signup/Signup';

const UnauthorizedRouter: React.FC = () => {
  return (
    <>
      <Route path="/signin" exact component={Signin} />
      <Route path="/signup" exact component={Signup} />
      <Redirect to="/signin" />
    </>
  );
};

export default UnauthorizedRouter;
