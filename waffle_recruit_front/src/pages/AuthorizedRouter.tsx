import React from 'react';

import { Redirect, Route } from 'react-router-dom';

import ProblemPage from './main';
import Submit from './submit';

const AuthorizedRouter: React.FC = () => {
  //check token logic

  return (
    <>
      <Route path="/main" exact component={ProblemPage} />
      <Route path="/problem/:prob_num" exact component={ProblemPage} />
      <Route path="/problem/:prob_num/submit" exact component={Submit} />
      <Redirect to="/main" />
    </>
  );
};

export default AuthorizedRouter;
