import React, { useEffect } from 'react';

import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
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
        return Promise.reject(res);
      }
    } catch (e) {
      toast.error(e);
    }
  };
  //check login
  useEffect(() => {
    checkLogin().then(
      () => {
        toast.success('로그인 되었습니다');
      },
      () => {
        toast.error('로그인이 만료되었습니다.');
        //    history.push('/signin');
      }
    );
  }, [location.pathname]);

  return (
    <>
      <Route path="/main" exact component={ProblemPage} />
      <Route path="/coverletter" exact component={ProblemPage} />
      <Route path="/problem/:prob_num" exact component={ProblemPage} />
      <Route path="/problem/:prob_num/submit" exact component={Submit} />
      <Redirect to="/main" />
    </>
  );
};

export default AuthorizedRouter;
