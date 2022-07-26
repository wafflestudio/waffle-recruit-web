import React, { useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { requester } from '../../apis/requester';
import { useAuthContext } from '../../context/authContext';

const GitHub = () => {
  const location = useLocation();
  const { setUser } = useAuthContext();
  const code = new URLSearchParams(location.search).get('code');
  const history = useHistory();

  console.log(code);

  async function getGitHubCode() {
    try {
      const res = await requester.get(`/auth/signin/github/callback/?code=${code}`);
      console.log(res);
      setUser(res.data.login);
      history.push('/main');
    } catch (err) {
      toast.error('GitHub 로그인에 실패하였습니다.');
      history.push('/signin');
    }
  }

  useEffect(() => {
    getGitHubCode();
  }, []);

  return <div className="signup_page">GitHub 소셜 로그인 중...</div>;
};

export default GitHub;
