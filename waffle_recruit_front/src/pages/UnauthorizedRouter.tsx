import React, { useEffect } from 'react';

import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getRefresh } from '../apis/getAuth';
import { authRequester } from '../apis/requester';

import GitHub from './github/GitHub';
import Signin from './signin/Signin';

const UnauthorizedRouter: React.FC = () => {
  const history = useHistory();
  const checkLogin = async () => {
    if (!getRefresh()) {
      return Promise.reject();
    }
    try {
      const res = await authRequester.get('/auth/ping/');
      if (res.data.login) {
        history.push('/main');
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    } catch (e: any) {
      console.dir(e);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <Switch>
      <Route path="/signin" exact component={Signin} />
      <Route path="/github" exact component={GitHub} />
      <Redirect to="/signin" />
    </Switch>
  );
};

export default UnauthorizedRouter;
