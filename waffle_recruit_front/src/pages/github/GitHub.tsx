import React, { useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { saveTokens, saveUser } from '../../apis/localStorages';
import { requester } from '../../apis/requester';
import { useAuthContext } from '../../context/authContext';

const GitHub = () => {
  const location = useLocation();
  const { setUser } = useAuthContext();
  const code = new URLSearchParams(location.search).get('code');
  const history = useHistory();

  async function getGitHubCode() {
    try {
      const res = await requester.get(`/auth/signin/github/callback/?code=${code}`);
      //setUser(res.data[0].username);
      saveUser(res.data[0].username);
      saveTokens(res.data[1]);
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
