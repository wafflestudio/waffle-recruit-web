import React from 'react';

import { Redirect, Route } from 'react-router-dom';

import ProblemPage from './main';
import Main from './problem/[probNum]';
import Submit from './problem/[probNum]/submit';

const AuthorizedRouter: React.FC = () => {
  return (
    <>
      <Route path="/main" exact component={ProblemPage} />
      <Route path="/problem/:prob_num" exact component={Main} />
      <Route path="/problem/:prob_num/submit" exact component={Submit} />
      <Redirect to="/main" />
    </>
  );
};

export default AuthorizedRouter;
