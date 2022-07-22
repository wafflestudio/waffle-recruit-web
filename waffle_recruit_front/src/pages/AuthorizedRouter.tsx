import React, { useEffect } from 'react';

import { Redirect, Route, useHistory } from 'react-router-dom';

import ProblemPage from './main';
import Submit from './submit';

const AuthorizedRouter: React.FC = () => {
  const history = useHistory();

  //check login
  useEffect(() => {
    const isLoggedIn = true;

    if (!isLoggedIn) {
      history.push('/signin');
    }
  }, [history.location.pathname]);

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
