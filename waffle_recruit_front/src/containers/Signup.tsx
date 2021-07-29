import React, { useState } from 'react';

import axios from 'axios';
import toNumber from 'lodash/toNumber';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import storage from '../lib/storage';

import './containers.css';

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [grade, setGrade] = useState<number>();
  const history = useHistory();

  const onClickSignUpButton = () => {
    const user = {
      email: email,
      username: username,
      password: password,
      major: major,
      grade: grade,
    };
    axios
      .post('/check/signup/', user)
      .then((res) => {
        storage.set('logged_in_user', res.data.user);
        history.replace('/main/');
      })
      .catch(() => {
        alert('중복된 아이디입니다.');
      });
  };

  return (
    <div className="signup_page">
      <Form className="login_form" onSubmit={onClickSignUpButton}>
        <p className="SignUpLabel">회원가입</p>
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="SignUpSmallLabel">이메일 주소</Form.Label>
          <Form.Control
            type="email"
            placeholder="연락 가능한 이메일 주소를 적어주세요."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">올바른 이메일 주소가 아닙니다.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="validationFormUsername">
          <Form.Label className="SignUpSmallLabel">아이디</Form.Label>
          <Form.Control
            type="text"
            placeholder="Github ID와 동일하게 해주시기 바랍니다."
            aria-describedby="inputGroupPrepend"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">전공</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter major"
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">학년</Form.Label>
          <Form.Control
            type="number"
            value={grade}
            onChange={(event) => setGrade(toNumber(event.currentTarget.value))}
            required
          />
        </Form.Group>
        <div className="SignUpFooter">
          <Button variant="primary" type="submit" id="login-button">
            회원가입
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
