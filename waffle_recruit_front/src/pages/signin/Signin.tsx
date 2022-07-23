import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form } from 'semantic-ui-react';

import { requester } from '../../apis/requester';
import { useAuthContext } from '../../context/authContext';
import '../containers.css';
import { saveTokens } from '../../apis/token';

interface User {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const { setUser } = useAuthContext();

  const onClickSignInButton = () => {
    const user = {
      username: username,
      password: password,
    };
    onLoginUser(user);
  };

  const onLoginUser = async (user: User) => {
    try {
      const res = await requester.post<{ user: string; token: { access: string; refresh: string } }>('/auth/signin/', user);
      saveTokens(res.data.token);
      history.replace('/main');
    } catch (err) {
      toast.error('가입되지 않은 유저거나 아이디/비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="login_page">
      <Form className="login_form" onSubmit={onClickSignInButton}>
        <Form.Input
          icon="user"
          iconPosition="left"
          label="Username"
          id="username-input"
          placeholder="Enter github name"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <Form.Input
          icon="lock"
          iconPosition="left"
          label="Password"
          type="password"
          id="pw-input"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button id="login-button" type="submit" content="Login" primary />
        <Button content="Sign up" icon="signup" id="signup-button" onClick={() => history.push('/signup/')} />
      </Form>
    </div>
  );
};

export default Signin;
