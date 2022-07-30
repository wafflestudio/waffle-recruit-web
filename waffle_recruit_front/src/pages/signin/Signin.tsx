import React, { useState } from 'react';

import { Button } from 'semantic-ui-react';

import '../containers.css';

const Signin: React.FC = () => {
  return (
    <div className="login_page">
      <a href={`https://github.com/login/oauth/authorize?client_id=ca61f5ee19f092f55e8e`}>
        <Button>GitHub 로그인 하기</Button>
      </a>
    </div>
  );
};

export default Signin;
