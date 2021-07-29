import React, {useState} from 'react';
import './containers.css';
import {Button} from 'semantic-ui-react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import storage from '../lib/storage';

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [major, setMajor] = useState('')
  const [grade, setGrade] = useState('')
  let history = useHistory()

  const onClickSignUpButton = e => {
    const user = {
      email: email,
      username: username,
      password: password,
      major: major,
      grade: grade,
    };
    e.preventDefault();
    axios
      .post('/check/signup/', user)
      .then(res => {
        storage.set("logged_in_user", res.data.user)
        history.replace('/main/');
      })
      .catch(err => {
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
            onChange={event => setEmail(event.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            올바른 이메일 주소가 아닙니다.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="validationFormUsername">
          <Form.Label className="SignUpSmallLabel">아이디</Form.Label>
          <Form.Control
            type="text"
            placeholder="Github ID와 동일하게 해주시기 바랍니다."
            aria-describedby="inputGroupPrepend"
            value={username}
            onChange={event =>
              setUsername(event.target.value)
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={event =>
              setPassword(event.target.value)
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">전공</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter major"
            value={major}
            onChange={event =>
              setMajor(event.target.value)
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">학년</Form.Label>
          <Form.Control
            type="number"
            value={grade}
            onChange={event =>
              setGrade(parseInt(event.target.value))
            }
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
}

export default Signup;
