import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';

import storage from '../../lib/storage';

import '../containers.css';

interface User {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const onClickSignInButton = () => {
    const user = {
      username: username,
      password: password,
    };
    onLoginUser(user);
  };

  const onLoginUser = (user: User) => {
    axios
      .post('/check/signin/', user)
      .then((res) => {
        storage.set('logged_in_user', res.data.user);
        history.replace('/problem/');
      })
      .catch(() => {
        alert('가입되지 않은 유저거나 아이디/비밀번호가 틀렸습니다.');
      });
  };

  useEffect(() => {
    axios.get('/check/token/').then((res) => {
      if (res.status === 200) {
        storage.set('logged_in_user', res.data.user);
        history.replace('/problem/1');
      }
    });
  }, []);

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
