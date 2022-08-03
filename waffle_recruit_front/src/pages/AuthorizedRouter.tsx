import React, { useEffect } from 'react';

import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { authRequester, requester } from '../apis/requester';

import ProblemPage from './main';
import Submit from './submit';

const AuthorizedRouter: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const checkLogin = async () => {
    try {
      const res = await authRequester.get('/auth/ping/');
      if (res.data.login) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    } catch (e: any) {
      //return Promise.reject();
    }
  };
  //check login
  useEffect(() => {
    checkLogin();
  }, [location.pathname]);

  return (
    <>
      <Switch>
        <Route path="/main" exact component={ProblemPage} />
        <Route path="/coverletter" exact component={ProblemPage} />
        <Route path="/problem/:prob_num" exact component={ProblemPage} />
        <Route path="/problem/:prob_num/submit" exact component={Submit} />
        <Redirect to="/main" />
      </Switch>
    </>
  );
};

export default AuthorizedRouter;
