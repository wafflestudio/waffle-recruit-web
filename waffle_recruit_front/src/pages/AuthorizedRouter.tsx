import React, { useEffect, useState } from 'react';

import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { authRequester } from '../apis/requester';

import ProblemPage from './main';
import Submit from './submit';

const spin = keyframes`
  100%  { 
    transform: rotate(360deg); 
  }
`;
const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Loader = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  border: 5px solid gray;
  margin-left: 3px;
  right: 0;
  border-top: 5px solid lightgray;
  animation: ${spin} 1000ms infinite linear;
  margin-bottom: 20px;
`;

const AuthorizedRouter: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkLogin = async () => {
    try {
      const res = await authRequester.get('/auth/ping/');
      if (res.data.login) {
        setIsLoading(false);
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    } catch (e: any) {}
  };
  //check login
  useEffect(() => {
    checkLogin();
  }, [location.pathname]);

  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
          로그인 정보 확인 중입니다
        </LoaderWrapper>
      ) : (
        <Switch>
          <Route path="/main" exact component={ProblemPage} />
          <Route path="/coverletter" exact component={ProblemPage} />
          <Route path="/problem/:prob_num" exact component={ProblemPage} />
          <Route path="/problem/:prob_num/submit" exact component={Submit} />
          <Redirect to="/main" />
        </Switch>
      )}
    </>
  );
};

export default AuthorizedRouter;
