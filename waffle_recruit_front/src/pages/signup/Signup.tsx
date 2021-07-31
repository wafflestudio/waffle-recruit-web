import React from 'react';

import { AxiosError, AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import toNumber from 'lodash/toNumber';
import Form from 'react-bootstrap/Form';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';

import { requester } from '../../apis/requester';
import { useAuthContext } from '../../context/authContext';
import '../containers.css';

interface ISignupForm {
  username: string;
  password: string;
  email: string;
  major: string;
  grade: number | null;
}

const Signup: React.FC = () => {
  const history = useHistory();

  const { setUser } = useAuthContext();

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik<ISignupForm>({
    initialValues: {
      username: '',
      password: '',
      email: '',
      major: '',
      grade: null,
    },
    onSubmit: (values) => {
      signUpMutation.mutate({ user: values });
    },
  });

  const signUpMutation = useMutation<AxiosResponse<{ user: string }>, AxiosError, { user: ISignupForm }, unknown>(
    ({ user }: { user: ISignupForm }) => {
      return requester.post('/check/signup/', user);
    },
    {
      onSuccess: (res) => {
        setUser(res.data.user);
        history.replace('/problem/');
      },
      onError: () => {
        // TODO 체크 필요
        toast.error('중복된 아이디입니다.');
      },
    }
  );

  return (
    <div className="signup_page">
      <Form className="login_form" onSubmit={handleSubmit}>
        <p className="SignUpLabel">회원가입</p>
        <Form.Group controlId="formBasicEmail">
          <Form.Label className="SignUpSmallLabel">이메일 주소</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="연락 가능한 이메일 주소를 적어주세요."
            value={values.email}
            onChange={handleChange}
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
            name="username"
            value={values.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">전공</Form.Label>
          <Form.Control
            type="text"
            name="major"
            placeholder="Enter major"
            value={values.major}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="SignUpSmallLabel">학년</Form.Label>
          <Form.Control
            type="number"
            name="grade"
            value={`${values.grade}`}
            onChange={(e) => setFieldValue('grade', toNumber(e.currentTarget.value))}
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
